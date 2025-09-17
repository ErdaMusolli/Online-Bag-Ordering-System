using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Corta.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }

        [Required]
        public string TokenHash { get; set; } = string.Empty;

        public DateTimeOffset ExpiresAt { get; set; }
        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset? RevokedAt { get; set; }
        public string? RevokeReason { get; set; }
        public string? ReplacedByTokenHash { get; set; }
        public string JwtId { get; set; } = string.Empty;
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}
