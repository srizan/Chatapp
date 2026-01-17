using Microsoft.EntityFrameworkCore;
using ChatApp.Models;

namespace ChatApp.Api.Data;

public class ChatDbContext : DbContext
{
    public ChatDbContext(DbContextOptions options) 
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<Message>()
            .HasOne(m => m.User)
            .WithMany()
            .HasForeignKey(m => m.UserId);
    }
}