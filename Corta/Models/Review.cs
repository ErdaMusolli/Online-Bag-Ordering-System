namespace Corta.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int ProductId { get; set; }

        public int UserId { get; set; }   

        public string UserEmail { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
    }
}


