namespace Corta.DTOs
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int Rating { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
