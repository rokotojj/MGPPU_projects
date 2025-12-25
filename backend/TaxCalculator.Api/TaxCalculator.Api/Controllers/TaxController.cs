using Microsoft.AspNetCore.Authorization;
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
        private readonly ITaxRepository _taxRepository;

        public TaxController(ITaxRepository taxRepository)
        {
            _taxRepository = taxRepository ?? throw new ArgumentNullException(nameof(taxRepository));
        }

        [AllowAnonymous]
        [HttpPost("calculate")]
        public IActionResult Calculate([FromBody] CalculateRequest request)
        {
            if (request == null) return BadRequest("Данные не переданы");

            decimal taxAmount = request.Amount * (decimal)(request.TaxRate / 100.0);
            decimal total = request.Amount - taxAmount;

            var result = new TaxCalculation
            {
                Amount = request.Amount,
                TaxRate = request.TaxRate,
                TaxAmount = taxAmount,
                TotalAmount = total,
                Date = DateTime.UtcNow
            };

            return Ok(result);
        }

        [Authorize]
        [HttpPost("history")]
        public IActionResult SaveCalculation([FromBody] TaxCalculation calc)
        {
            if (calc == null) return BadRequest("Данные не переданы");

            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            calc.UserId = int.Parse(userIdClaim.Value);
            if (calc.Date == default) calc.Date = DateTime.UtcNow;

            _taxRepository.AddCalculation(calc);
            return Ok();
        }

        [Authorize]
        [HttpGet("history/{userId}")]
        public IActionResult GetHistory(int userId)
        {
            var history = _taxRepository.GetCalculations(userId);
            return Ok(history);
        }

        [Authorize]
        [HttpDelete("history/{id}")]
        public IActionResult DeleteCalculation(int id)
        {
            _taxRepository.DeleteCalculation(id);
            return Ok();
        }
    }
}