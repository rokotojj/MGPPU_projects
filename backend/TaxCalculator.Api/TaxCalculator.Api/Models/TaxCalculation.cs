using System;

namespace TaxCalculator.Api.Models
{
    public class TaxCalculation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public double TaxRate { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
    }

    public class CalculateRequest
    {
        public decimal Amount { get; set; }
        public double TaxRate { get; set; }
    }
}