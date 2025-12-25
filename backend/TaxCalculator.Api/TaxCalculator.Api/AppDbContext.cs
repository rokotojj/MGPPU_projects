using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using TaxCalculator.Api.Models;


namespace TaxCalculator.Api
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<TaxCalculation> TaxCalculations { get; set; }
    }
}