using Microsoft.AspNetCore.Mvc;
using Corta.DTOs;
using Corta.Services;
using Corta.Helpers;
using Corta.Data;
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
        public AuthController(UserService userService, JwtService jwtService, ApplicationDbContext context)
        {
            _userService = userService;
            _jwtService = jwtService;
            _context = context;
        }

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
            var tokens = await _userService.LoginWithTokensAsync(dto, _jwtService);
            if (tokens == null)
                return Unauthorized("Invalid credentials");

            return Ok(new
            {
                token = tokens.Value.accessToken,
                refreshToken = tokens.Value.refreshToken
            });
        }
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto dto)
        {
            var refreshTokenEntity = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == dto.RefreshToken && rt.ExpiresAt > DateTime.UtcNow);

            if (refreshTokenEntity == null || refreshTokenEntity.User == null)
            {
                return Unauthorized("Invalid or expired refresh token");
            }

            var newToken = _jwtService.GenerateToken(refreshTokenEntity.User);

            return Ok(new { token = newToken });
        }
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDto dto)
        {
            var success = await _userService.LogoutAsync(dto.RefreshToken);
            if (!success)
                return NotFound("Refresh token not found");

            return Ok("Logged out successfully");
        }
       [HttpPost("change-password")]
public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
{
    if (dto.NewPassword != dto.ConfirmPassword)
    {
        return BadRequest("New passwords do not match.");
    }

   
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userId))
    {
        return Unauthorized("User ID not found in token.");
    }

    
    var user = await _context.Users.FindAsync(int.Parse(userId));
    if (user == null)
    {
        return NotFound("User not found.");
    }

   
    if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
    {
        return BadRequest("Current password is incorrect.");
    }

   
    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
    await _context.SaveChangesAsync();

    return Ok("Password changed successfully.");
}
    }
}
