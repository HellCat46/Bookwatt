using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.dbContext;

public class UserDbContext : DbContext
{
    public UserDbContext(DbContextOptions options) : base(options)
    {
        
    }
    
    public DbSet<BookModel> Book { get; set; }
    public DbSet<UserModel> User { get; set; }
}