namespace Corta.Models
{
    public class News
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public DateTime DatePublished { get; set; } = DateTime.UtcNow;
        public string? ImageUrl { get; set; }
    }
}