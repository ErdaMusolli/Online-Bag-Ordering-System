using Microsoft.EntityFrameworkCore;
using Corta.Models; 

namespace Corta.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<News> News { get; set; }

    
    }
}

