using System.Collections.Generic;
using TaxCalculator.Api.Models;

namespace TaxCalculator.Api.Repositories
{
    public interface ITemplateRepository
    {
        List<Template> GetTemplates(int userId);
        void AddTemplate(Template template);
        void DeleteTemplate(int id);
    }
}