using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatApp.Api.Data;
using ChatApp.Models;
using System.Collections;

namespace ChatApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly ChatDbContext _context;

    public MessagesController(ChatDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable>> GetMessages()
    {
        return await _context.Messages
            .Include(m => m.User)
            .OrderBy(m => m.SentAt)
            .ToListAsync();
    }
}