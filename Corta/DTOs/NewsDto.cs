public class NewsDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public IFormFile? Image { get; set; }
    public List<IFormFile>? AdditionalImages { get; set; }
}
