using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Corta.Models;
using System.Security.Cryptography;


namespace Corta.Helpers
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public (string accessToken, string jti, DateTimeOffset expires) CreateAccessToken(User user)
        {
            var jti = Guid.NewGuid().ToString("N");
            var expires = DateTimeOffset.UtcNow.AddMinutes(
                int.TryParse(_configuration["Jwt:AccessTokenMinutes"], out var m) ? m : 5);

             var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, jti),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("UserId", user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? "User") 
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
           _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not found")));


            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expires.UtcDateTime,
                signingCredentials: creds
            );

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            return (accessToken, jti, expires);
        }
       public (string raw, string hash, DateTimeOffset expires) CreateRefreshToken(User user, string jwtId)
        {
           byte[] random = RandomNumberGenerator.GetBytes(64);

           var raw = Convert.ToBase64String(random)
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');

            var hash = Sha256(raw);
            var expires = DateTimeOffset.UtcNow.AddDays(
                int.TryParse(_configuration["Jwt:RefreshTokenDays"], out var d) ? d : 14);

            return (raw, hash, expires);
        }

        public string CreateCsrfToken()
        {
            byte[] random = new byte[32];
            RandomNumberGenerator.Fill(random);
            return Convert.ToBase64String(random);
        }

        public static string Sha256(string input)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToHexString(bytes);
        }
    }
}