using System.ComponentModel.DataAnnotations.Schema;

namespace Corta.Models
{

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        
         [Column(TypeName = "date")]
        public DateTime? BirthDate { get; set; }
        public string? Gender { get; set; }
        public string Role { get; set; } = "User";

        public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();


    }
}
