namespace ChatApp.Models;

public class Message
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    
    public User? User { get; set; }
}