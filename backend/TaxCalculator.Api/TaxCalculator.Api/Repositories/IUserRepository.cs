using TaxCalculator.Api.Models;

namespace TaxCalculator.Api.Repositories
{
    public interface IUserRepository
    {
        User? GetUser(string email, string password);
        User? CreateUser(string email, string password, string name);
        bool UserExists(string email);
    }
}