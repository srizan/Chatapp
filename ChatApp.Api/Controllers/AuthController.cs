using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatApp.Api.Data;
using ChatApp.Api.Services;
using ChatApp.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;

namespace ChatApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ChatDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(ChatDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpGet("google-login")]
    public IActionResult GoogleLogin()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(GoogleCallback))
        };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("google-callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        var authenticateResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
        
        if (!authenticateResult.Succeeded)
            return BadRequest("Google authentication failed");

        var claims = authenticateResult.Principal!.Claims;
    var googleId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
    var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
    var name = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
    
    // Try multiple claim types for the picture
    var picture = claims.FirstOrDefault(c => c.Type == "picture")?.Value 
               ?? claims.FirstOrDefault(c => c.Type == "urn:google:picture")?.Value
               ?? claims.FirstOrDefault(c => c.Type == ClaimTypes.Uri)?.Value;

    if (string.IsNullOrEmpty(googleId) || string.IsNullOrEmpty(email))
        return BadRequest("Failed to retrieve user information from Google");

    // Check if user exists
    var user = await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId);

        if (user == null)
        {
            // Create new user
            user = new User
            {
                GoogleId = googleId,
                Email = email,
                Username = name ?? email.Split('@')[0],
                ProfilePictureUrl = picture,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        else
        {
            // Update profile picture if it changed
            if (!string.IsNullOrEmpty(picture) && user.ProfilePictureUrl != picture)
            {
                user.ProfilePictureUrl = picture;
                await _context.SaveChangesAsync();
            }
        }
        // Generate JWT token
        var token = _jwtService.GenerateToken(user);

        // Redirect to frontend with token
        return Redirect($"http://localhost:5173/auth/callback?token={token}");
    }

    [HttpGet("verify")]
    public async Task<IActionResult> VerifyToken([FromQuery] string token)
    {
        var principal = _jwtService.ValidateToken(token);
        
        if (principal == null)
            return Unauthorized("Invalid token");

        var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("Invalid token");

        var user = await _context.Users.FindAsync(int.Parse(userId));
        
        if (user == null)
            return NotFound("User not found");

        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email,
            user.ProfilePictureUrl
        });
    }
}