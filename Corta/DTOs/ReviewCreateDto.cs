namespace Corta.DTOs
{
    public class ReviewCreateDto
    {
        public int ProductId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
