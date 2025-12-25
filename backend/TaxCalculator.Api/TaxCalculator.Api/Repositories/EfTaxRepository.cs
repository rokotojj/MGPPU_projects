using TaxCalculator.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace TaxCalculator.Api.Repositories
{
    public class EfTaxRepository : ITaxRepository
    {
        private readonly AppDbContext _context;

        public EfTaxRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public List<TaxCalculation> GetCalculations(int userId)
        {
            return _context.TaxCalculations
                           .Where(c => c.UserId == userId)
                           .OrderByDescending(c => c.Date)
                           .ToList();
        }

        public void AddCalculation(TaxCalculation calc)
        {
            if (calc == null) throw new ArgumentNullException(nameof(calc));

            _context.TaxCalculations.Add(calc);
            _context.SaveChanges();
        }

        public void DeleteCalculation(int id)
        {
            var item = _context.TaxCalculations.Find(id);
            if (item != null)
            {
                _context.TaxCalculations.Remove(item);
                _context.SaveChanges();
            }
        }
    }
}