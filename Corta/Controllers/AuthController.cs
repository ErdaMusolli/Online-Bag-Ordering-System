using Microsoft.AspNetCore.Mvc;
using Corta.DTOs;
using Corta.Services;
using Corta.Helpers;
using Corta.Data;
using Corta.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BCrypt.Net;

namespace Corta.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JwtService _jwtService;
        private readonly ApplicationDbContext _context;

        private const string RtCookie = "rt";
        private const string AccessCookie = "access_token";
        private const string CsrfCookie = "csrf-token";
        private const string CsrfHeader = "X-CSRF-Token";

        public AuthController(UserService userService, JwtService jwtService, ApplicationDbContext context)
        {
            _userService = userService;
            _jwtService = jwtService;
            _context = context;
        }

        private void SetAccessCookie(HttpResponse res, string token, DateTimeOffset expires)
        {
            res.Cookies.Append(AccessCookie, token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = expires,
                Path = "/"
            });
        }

        private void ClearAccessCookie(HttpResponse res)
        {
            res.Cookies.Delete(AccessCookie, new CookieOptions
            {
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            });
        }

        private void SetRefreshCookie(HttpResponse res, string token, DateTimeOffset expires)
        {
            res.Cookies.Append(RtCookie, token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = expires,
                Path = "/api/auth/refresh"
            });
        }

        private void ClearRefreshCookie(HttpResponse res)
        {
            res.Cookies.Delete(RtCookie, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/api/auth/refresh"
            });
        }

        private void SetCsrfCookie(HttpResponse res, string token)
        {
            res.Cookies.Append(CsrfCookie, token, new CookieOptions
            {
                HttpOnly = false,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(7),
                Path = "/"
            });
        }

        private bool ValidateCsrf(HttpRequest req)
        {
            var hdr = req.Headers[CsrfHeader].ToString();
            req.Cookies.TryGetValue(CsrfCookie, out var cookie);
            return !string.IsNullOrEmpty(hdr) && hdr == cookie;
        }

        private static string Hash(string raw) => JwtService.Sha256(raw);



        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var user = await _userService.RegisterAsync(dto);
            if (user == null)
                return BadRequest("Email already exists");

            return Ok("User registered successfully");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
           var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
if (user is null)
    return Unauthorized("Invalid credentials");

if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
    return Unauthorized("Invalid credentials");

var (accessToken, jti, accessExp) = _jwtService.CreateAccessToken(user);
            var (rtRaw, rtHash, rtExp) = _jwtService.CreateRefreshToken(user, jti);

            var rt = new RefreshToken
            {
                TokenHash = rtHash,
                CreatedAt = DateTimeOffset.UtcNow,
                ExpiresAt = rtExp,
                JwtId = jti,
                UserId = user.Id
            };
            _context.RefreshTokens.Add(rt); 
            await _context.SaveChangesAsync();

            SetAccessCookie(Response, accessToken, accessExp);
            SetRefreshCookie(Response, rtRaw, rtExp);
            SetCsrfCookie(Response, _jwtService.CreateCsrfToken());

        return Ok(new {
          expiresAt = accessExp,
          user = new { user.Id, user.Username, user.Email, role = user.Role }
          });
       }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue(RtCookie, out var rtRaw)) return Unauthorized();
            var rtHash = Hash(rtRaw);

            var token = await _context.RefreshTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.TokenHash == rtHash);

          if (token == null || token.User == null) return Unauthorized();

          if (token.ExpiresAt <= DateTimeOffset.UtcNow || token.RevokedAt != null) return Unauthorized();

          User user = token.User; 

          if (!string.IsNullOrEmpty(token.ReplacedByTokenHash))
          {
        var replaced = await _context.RefreshTokens
           .Include(t => t.User)
           .FirstOrDefaultAsync(t => t.TokenHash == token.ReplacedByTokenHash);

        if (replaced == null || replaced.RevokedAt != null || replaced.ExpiresAt <= DateTimeOffset.UtcNow)
           return Unauthorized();

          token = replaced;
          if (token.User is null) return Unauthorized();
           user = token.User; 
         }
 
       var (accessToken, jti, accessExp) = _jwtService.CreateAccessToken(user);
       var (newRtRaw, newRtHash, newRtExp) = _jwtService.CreateRefreshToken(user, jti);

            token.RevokedAt = DateTimeOffset.UtcNow;
            token.ReplacedByTokenHash = newRtHash;

            _context.RefreshTokens.Add(new RefreshToken
            {
                TokenHash = newRtHash,
                CreatedAt = DateTimeOffset.UtcNow,
                ExpiresAt = newRtExp,
                JwtId = jti,
                UserId = user.Id
            });

            await _context.SaveChangesAsync();

            SetAccessCookie(Response, accessToken, accessExp);
            SetRefreshCookie(Response, newRtRaw, newRtExp);
            SetCsrfCookie(Response, _jwtService.CreateCsrfToken());

            return Ok(new { expiresAt = accessExp });
        }


        private void ClearCsrfCookie(HttpResponse res)
        {
            res.Cookies.Append("csrf-token", "",
                new CookieOptions
                {
                    Expires = DateTimeOffset.UnixEpoch, 
                    Path = "/",                        
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    HttpOnly = false
                });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            if (!ValidateCsrf(Request)) return Forbid();

            if (Request.Cookies.TryGetValue(RtCookie, out var rtRaw))
            {
                var rtHash = Hash(rtRaw);
                var token = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == rtHash);
                if (token != null)
                {
                    token.RevokedAt = DateTimeOffset.UtcNow;
                    token.RevokeReason = "user logout";
                    await _context.SaveChangesAsync();
                }
            }

            ClearRefreshCookie(Response);
            ClearAccessCookie(Response);
            ClearCsrfCookie(Response);   
            return NoContent();
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (dto.NewPassword != dto.ConfirmPassword)
                return BadRequest("New passwords do not match.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized("User ID not found in token.");

            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound("User not found.");

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                return BadRequest("Current password is incorrect.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok("Password changed successfully.");
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var email = User.FindFirstValue(ClaimTypes.Email);
            var name = User.FindFirstValue(ClaimTypes.Name);

            var roleClaim = User.FindFirstValue(ClaimTypes.Role)
                          ?? User.FindFirstValue("role");

           string? role = User.FindFirstValue(ClaimTypes.Role) ?? User.FindFirstValue("role");

           if (string.IsNullOrEmpty(role) && int.TryParse(userId, out var uid))
       {
           var dbUser = await _context.Users.FindAsync(uid);
           role = dbUser?.Role;
       }

        role ??= string.Empty; 
        return Ok(new { userId, email, name, role });
        }

    }
}