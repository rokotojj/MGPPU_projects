using System.Collections.Generic;
using TaxCalculator.Api.Models;

namespace TaxCalculator.Api.Repositories
{
    public interface IReferenceRepository
    {
        List<TaxReference> GetTaxReferences();
        List<AccountingEntry> GetAccountingEntries();
    }
}