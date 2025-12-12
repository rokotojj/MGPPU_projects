using Microsoft.AspNetCore.Mvc;
using TaxCalculator.Api.Repositories;

namespace TaxCalculator.Api.Controllers
{
    [ApiController]
    [Route("api/reference")]
    public class ReferenceController : ControllerBase
    {
        private readonly IRepository _repository;

        public ReferenceController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("taxes")]
        public IActionResult GetTaxes()
        {
            return Ok(_repository.GetTaxReferences());
        }

        [HttpGet("entries")]
        public IActionResult GetEntries()
        {
            return Ok(_repository.GetAccountingEntries());
        }
    }
}