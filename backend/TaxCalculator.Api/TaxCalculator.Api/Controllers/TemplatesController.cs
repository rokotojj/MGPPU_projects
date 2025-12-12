using Microsoft.AspNetCore.Mvc;
using TaxCalculator.Api.Models;
using TaxCalculator.Api.Repositories;

namespace TaxCalculator.Api.Controllers
{
    [ApiController]
    [Route("api/templates")]
    public class TemplatesController : ControllerBase
    {
        private readonly IRepository _repository;

        public TemplatesController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("{userId}")]
        public IActionResult GetTemplates(int userId)
        {
            return Ok(_repository.GetTemplates(userId));
        }

        [HttpPost]
        public IActionResult AddTemplate([FromBody] Template template)
        {
            _repository.AddTemplate(template);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTemplate(int id)
        {
            _repository.DeleteTemplate(id);
            return Ok();
        }
    }
}