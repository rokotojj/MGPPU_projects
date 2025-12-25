using System.Collections.Generic;
using TaxCalculator.Api.Models;

namespace TaxCalculator.Api.Repositories
{
    public class InMemoryReferenceRepository : IReferenceRepository
    {
        private static List<TaxReference> _taxReferences = new List<TaxReference>
        {
             new TaxReference { Id = 1, Title = "НДС (Основной)", Description = "Налог на добавленную стоимость. Применяется при продаже товаров и услуг.", Rate = 20, Category = "Федеральный налог" },
             new TaxReference { Id = 2, Title = "НДС (Льготный)", Description = "Для продовольственных, детских и медицинских товаров.", Rate = 10, Category = "Федеральный налог" },
             new TaxReference { Id = 3, Title = "НДФЛ (Резиденты)", Description = "Налог на доходы физических лиц (зарплата, дивиденды).", Rate = 13, Category = "Федеральный налог" },
             new TaxReference { Id = 4, Title = "Налог на прибыль", Description = "Основной налог для организаций на ОСНО.", Rate = 20, Category = "Федеральный налог" },
             new TaxReference { Id = 5, Title = "Страховые взносы", Description = "Пенсионное, медицинское и социальное страхование сотрудников.", Rate = 30, Category = "Взносы" },
             new TaxReference { Id = 6, Title = "УСН 'Доходы'", Description = "Упрощенная система налогообложения. Платится со всей выручки.", Rate = 6, Category = "Спецрежим" },
             new TaxReference { Id = 7, Title = "УСН 'Доходы минус Расходы'", Description = "Упрощенка. Платится с разницы между доходами и расходами.", Rate = 15, Category = "Спецрежим" },
             new TaxReference { Id = 8, Title = "Самозанятость (НПД)", Description = "При работе с физлицами.", Rate = 4, Category = "Спецрежим" },
             new TaxReference { Id = 9, Title = "Транспортный налог", Description = "Зависит от региона и мощности двигателя (л.с.).", Rate = 0, Category = "Региональный налог" }
        };

        private static List<AccountingEntry> _entries = new List<AccountingEntry>
        {
             new AccountingEntry { Id = 1, Code = "Дт 20 — Кт 70", Debit = "20/26/44", Credit = "70", Description = "Начисление заработной платы", Example = "50 000 руб." },
             new AccountingEntry { Id = 2, Code = "Дт 70 — Кт 51", Debit = "70", Credit = "51", Description = "Выплата зарплаты", Example = "43 500 руб." },
             new AccountingEntry { Id = 3, Code = "Дт 10 — Кт 60", Debit = "10", Credit = "60", Description = "Поступление материалов", Example = "100 000 руб." },
             new AccountingEntry { Id = 4, Code = "Дт 62 — Кт 90.1", Debit = "62", Credit = "90.1", Description = "Выручка от продаж", Example = "200 000 руб." },
             new AccountingEntry { Id = 5, Code = "Дт 71 — Кт 50", Debit = "71", Credit = "50", Description = "Выдача под отчет", Example = "5 000 руб." }
        };

        public List<TaxReference> GetTaxReferences() => _taxReferences;
        public List<AccountingEntry> GetAccountingEntries() => _entries;
    }
}