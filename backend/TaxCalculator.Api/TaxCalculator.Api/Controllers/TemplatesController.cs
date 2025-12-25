using Microsoft.AspNetCore.Mvc;
using TaxCalculator.Api.Models;
using TaxCalculator.Api.Repositories;
using System;

namespace TaxCalculator.Api.Controllers
{
    [ApiController]
    [Route("api/templates")]
    public class TemplatesController : ControllerBase
    {
        private readonly ITemplateRepository _repository;

        public TemplatesController(ITemplateRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpGet("{userId}")]
        public IActionResult GetTemplates(int userId)
        {
            var templates = _repository.GetTemplates(userId);
            return Ok(templates);
        }

        [HttpPost]
        public IActionResult AddTemplate([FromBody] Template template)
        {
            if (template == null) 
                return BadRequest("Данные шаблона не переданы");
            if (string.IsNullOrWhiteSpace(template.Name))
                return BadRequest("Название шаблона обязательно");

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