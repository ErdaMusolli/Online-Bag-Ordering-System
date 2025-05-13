namespace Corta.DTOs
{
    public class NewsDto
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public DateTime DatePublished { get; set; }
        public required string Author { get; set; }
    }
}
