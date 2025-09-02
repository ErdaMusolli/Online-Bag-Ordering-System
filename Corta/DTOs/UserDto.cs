namespace Corta.DTOs
{
    public class UserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
        public DateTime? BirthDate { get; set; }
        public string? Gender { get; set; }
    
    }
}
