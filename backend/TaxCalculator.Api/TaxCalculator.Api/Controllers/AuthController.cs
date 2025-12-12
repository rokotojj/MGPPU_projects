using Microsoft.AspNetCore.Mvc;
using TaxCalculator.Api.Models;
using TaxCalculator.Api.Repositories;

namespace TaxCalculator.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IRepository _repository;

        public AuthController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _repository.GetUser(request.Email, request.Password);
            if (user == null)
                return Unauthorized(new { message = "Неверный логин или пароль" });

            return Ok(new { user });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            var user = _repository.CreateUser(request.Email, request.Password, request.Name);
            if (user == null)
                return BadRequest(new { message = "Пользователь с таким email уже существует" });

            return Ok(new { success = true });
        }
    }
}