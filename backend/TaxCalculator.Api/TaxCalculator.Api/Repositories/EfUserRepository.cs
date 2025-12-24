using TaxCalculator.Api.Models;
using System.Linq;
using BCrypt.Net;

namespace TaxCalculator.Api.Repositories
{
    public class EfUserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public EfUserRepository(AppDbContext context)
        {
            _context = context;
        }

        public User? GetUser(string email, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null) return null;

            if (BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return user;
            }
            return null;
        }

        public User? CreateUser(string email, string password, string name)
        {
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            var newUser = new User
            {
                Email = email,
                PasswordHash = passwordHash,
                Name = name,
                Role = "User"
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();
            return newUser;
        }

        public bool UserExists(string email) => _context.Users.Any(u => u.Email == email);
    }
}