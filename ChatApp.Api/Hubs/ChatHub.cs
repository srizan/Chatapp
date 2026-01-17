
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using ChatApp.Models;
using ChatApp.Api.Data;
using System.Security.Claims;

namespace ChatApp.Api.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly ChatDbContext _context;

    public ChatHub(ChatDbContext context)
    {
        _context = context;
    }

    public async Task SendMessage(string message)
    {
        var username = Context.User?.FindFirst("username")?.Value;
        var email = Context.User?.FindFirst(ClaimTypes.Email)?.Value;
        var userIdStr = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(userIdStr))
            return;

        var userId = int.Parse(userIdStr);

        var msg = new Message
        {
            UserId = userId,
            Content = message,
            SentAt = DateTime.UtcNow
        };

        _context.Messages.Add(msg);
        await _context.SaveChangesAsync();

        // Broadcast to all clients
        await Clients.All.SendAsync("ReceiveMessage", username,email, message, msg.SentAt);
    }

    // public async Task JoinChat(string username)
    // {
    //     await Clients.All.SendAsync("UserJoined", username);
    // }

    public override async Task OnConnectedAsync()
    {
        var username = Context.User?.FindFirst("username")?.Value;
        if (!string.IsNullOrEmpty(username))
        {
            await Clients.All.SendAsync("UserJoined", username);
        }
        await base.OnConnectedAsync();
    }
}