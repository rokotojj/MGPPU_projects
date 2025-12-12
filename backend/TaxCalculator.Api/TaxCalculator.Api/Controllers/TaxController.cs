using Microsoft.AspNetCore.Mvc;
using TaxCalculator.Api.Models;
using TaxCalculator.Api.Repositories;
using System;

namespace TaxCalculator.Api.Controllers
{
    [ApiController]
    [Route("api/tax")]
    public class TaxController : ControllerBase
    {
        private readonly IRepository _repository;

        public TaxController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpPost("calculate")]
        public IActionResult Calculate([FromBody] CalculateRequest request)
        {
            // Выполняем расчет на бэкенде
            decimal taxAmount = request.Amount * (decimal)(request.TaxRate / 100.0);
            decimal total = request.Amount + taxAmount;

            var result = new TaxCalculation
            {
                Amount = request.Amount,
                TaxRate = request.TaxRate,
                TaxAmount = taxAmount,
                TotalAmount = total,
                Date = DateTime.Now
            };

            return Ok(result);
        }

        [HttpPost("history")]
        public IActionResult SaveCalculation([FromBody] TaxCalculation calc)
        {
            if (calc.UserId == 0) return BadRequest("UserId is required");

            _repository.AddCalculation(calc);
            return Ok();
        }

        [HttpGet("history/{userId}")]
        public IActionResult GetHistory(int userId)
        {
            var history = _repository.GetCalculations(userId);
            return Ok(history);
        }

        [HttpDelete("history/{id}")]
        public IActionResult DeleteCalculation(int id)
        {
            _repository.DeleteCalculation(id);
            return Ok();
        }
    }
}