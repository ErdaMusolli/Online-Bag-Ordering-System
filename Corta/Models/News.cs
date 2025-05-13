namespace Corta.Models
{
    public class News
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Content { get; set; }
        public DateTime DatePublished { get; set; }
        public required string Author { get; set; }
    }
}

