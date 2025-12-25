using System.Collections.Generic;
using System.Linq;
using TaxCalculator.Api.Models;

namespace TaxCalculator.Api.Repositories
{
    public interface IRepository
    {
        User? GetUser(string email, string password);
        User? CreateUser(string email, string password, string name);

        List<TaxCalculation> GetCalculations(int userId);
        void AddCalculation(TaxCalculation calc);
        void DeleteCalculation(int id);
        List<Template> GetTemplates(int userId);
        void AddTemplate(Template template);
        void DeleteTemplate(int id);
        List<TaxReference> GetTaxReferences();
        List<AccountingEntry> GetAccountingEntries();
    }

    public class InMemoryRepository : IRepository
    {
        private static List<User> _users = new List<User>();
        private static List<TaxCalculation> _calculations = new List<TaxCalculation>();
        private static List<Template> _templates = new List<Template>();
        private static List<TaxReference> _taxReferences = new List<TaxReference>
        {
             new TaxReference { Id = 1, Title = "НДС", Description = "Налог на добавленную стоимость", Rate = 20, Category = "Косвенный налог" },
             new TaxReference { Id = 2, Title = "НДФЛ", Description = "Налог на доходы физлиц", Rate = 13, Category = "Прямой налог" }
        };
        private static List<AccountingEntry> _entries = new List<AccountingEntry>
        {
             new AccountingEntry { Id = 1, Code = "ДТ 20 КТ 10", Debit = "20", Credit = "10", Description = "Списание материалов", Example = "50000 руб." }
        };
        public User? GetUser(string email, string password) => _users.FirstOrDefault(u => u.Email == email && u.Password == password);
        public User? CreateUser(string email, string password, string name)
        {
            if (_users.Any(u => u.Email == email)) return null;
            var newUser = new User { Id = _users.Count + 1, Email = email, Password = password, Name = name };
            _users.Add(newUser);
            return newUser;
        }
        public List<TaxCalculation> GetCalculations(int userId) => _calculations.Where(c => c.UserId == userId).ToList();
        public void AddCalculation(TaxCalculation calc)
        {
            calc.Id = _calculations.Any() ? _calculations.Max(c => c.Id) + 1 : 1;
            _calculations.Add(calc);
        }
        public void DeleteCalculation(int id)
        {
            var item = _calculations.FirstOrDefault(c => c.Id == id);
            if (item != null) _calculations.Remove(item);
        }
        public List<Template> GetTemplates(int userId) => _templates.Where(t => t.UserId == userId).ToList();
        public void AddTemplate(Template template)
        {
            template.Id = _templates.Any() ? _templates.Max(t => t.Id) + 1 : 1;
            _templates.Add(template);
        }
        public void DeleteTemplate(int id)
        {
            var item = _templates.FirstOrDefault(t => t.Id == id);
            if (item != null) _templates.Remove(item);
        }
        public List<TaxReference> GetTaxReferences() => _taxReferences;
        public List<AccountingEntry> GetAccountingEntries() => _entries;
    }
}