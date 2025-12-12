namespace TaxCalculator.Api.Models
{
    public class Template
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Debit { get; set; } = string.Empty;
        public string Credit { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}