using Npgsql;
using TaxCalculator.Api.Models;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using System;

namespace TaxCalculator.Api.Repositories
{
    public class SqlTemplateRepository : ITemplateRepository
    {
        private readonly string _connectionString;

        public SqlTemplateRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string not found");
        }

        public List<Template> GetTemplates(int userId)
        {
            var result = new List<Template>();
            using var conn = new NpgsqlConnection(_connectionString);
            conn.Open();
            string sql = "SELECT \"Id\", \"UserId\", \"Name\", \"Debit\", \"Credit\", \"Description\" FROM \"Templates\" WHERE \"UserId\" = @uid";

            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("uid", userId);

            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                result.Add(new Template
                {
                    Id = reader.GetInt32(0),
                    UserId = reader.GetInt32(1),
                    Name = reader.GetString(2),
                    Debit = reader.IsDBNull(3) ? "" : reader.GetString(3),
                    Credit = reader.IsDBNull(4) ? "" : reader.GetString(4),
                    Description = reader.IsDBNull(5) ? "" : reader.GetString(5)
                });
            }
            return result;
        }

        public void AddTemplate(Template t)
        {
            using var conn = new NpgsqlConnection(_connectionString);
            conn.Open();

            string sql = "INSERT INTO \"Templates\" (\"UserId\", \"Name\", \"Debit\", \"Credit\", \"Description\") VALUES (@uid, @nm, @db, @cr, @desc)";

            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("uid", t.UserId);
            cmd.Parameters.AddWithValue("nm", t.Name);
            cmd.Parameters.AddWithValue("db", t.Debit ?? "");
            cmd.Parameters.AddWithValue("cr", t.Credit ?? "");
            cmd.Parameters.AddWithValue("desc", t.Description ?? "");
            cmd.ExecuteNonQuery();
        }

        public void DeleteTemplate(int id)
        {
            using var conn = new NpgsqlConnection(_connectionString);
            conn.Open();
            string sql = "DELETE FROM \"Templates\" WHERE \"Id\" = @id";
            using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("id", id);
            cmd.ExecuteNonQuery();
        }
    }
}