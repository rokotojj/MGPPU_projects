namespace TaxCalculator.Api.Models
{
    public class TaxReference
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Rate { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    public class AccountingEntry
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Debit { get; set; } = string.Empty;
        public string Credit { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Example { get; set; } = string.Empty;
    }
}