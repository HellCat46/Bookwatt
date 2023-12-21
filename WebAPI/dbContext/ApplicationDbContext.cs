
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.dbContext;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions options) : base(options)
    {
        
    }
    
    public DbSet<SellerModel> Seller { get; set; }
    public DbSet<BookModel> Book { get; set; }
    public DbSet<UserModel> User { get; set; }
}