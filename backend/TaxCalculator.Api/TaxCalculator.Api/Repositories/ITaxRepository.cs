using System.Collections.Generic;
using TaxCalculator.Api.Models;

namespace TaxCalculator.Api.Repositories
{
    public interface ITaxRepository
    {
        List<TaxCalculation> GetCalculations(int userId);
        void AddCalculation(TaxCalculation calc);
        void DeleteCalculation(int id);
    }
}