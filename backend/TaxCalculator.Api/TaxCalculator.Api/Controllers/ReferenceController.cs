using Microsoft.AspNetCore.Mvc;
using TaxCalculator.Api.Repositories;
using System;

namespace TaxCalculator.Api.Controllers
{
    [ApiController]
    [Route("api/reference")]
    public class ReferenceController : ControllerBase
    {
        private readonly IReferenceRepository _repository;

        public ReferenceController(IReferenceRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
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