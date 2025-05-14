namespace Corta.Models
{
    public class ContactMessage
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime DateSent { get; set; } = DateTime.UtcNow;
    }
}
 