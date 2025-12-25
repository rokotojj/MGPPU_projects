using TaxCalculator.Api.Models;
using System;
using System.Linq;
using BCrypt.Net;

namespace TaxCalculator.Api.Repositories
{
    public class EfUserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public EfUserRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public User? GetUser(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email)) return null;
            if (string.IsNullOrWhiteSpace(password)) return null;

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
            if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("Email обязателен");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Пароль обязателен");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            var newUser = new User
            {
                Email = email,
                PasswordHash = passwordHash,
                Name = name ?? "",
                Role = "User"
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();
            return newUser;
        }

        public bool UserExists(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;
            return _context.Users.Any(u => u.Email == email);
        }
    }
}