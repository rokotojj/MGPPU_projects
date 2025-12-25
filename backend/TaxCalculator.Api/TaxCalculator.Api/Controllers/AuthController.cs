using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaxCalculator.Api.Models;
using TaxCalculator.Api.Repositories;
using System;
using System.Text.RegularExpressions;

namespace TaxCalculator.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public AuthController(IUserRepository userRepository)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request == null) return BadRequest("Пустой запрос");
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest("Email и пароль обязательны");

            var user = _userRepository.GetUser(request.Email, request.Password);
            if (user == null)
                return Unauthorized(new { message = "Неверный email или пароль" });

            return Ok(new { user });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (request == null) return BadRequest("Пустой запрос");
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest("Все поля обязательны для заполнения");

            var passwordPattern = @"^(?=.*[A-Za-z])(?=.*\d).{8,}$";

            if (!Regex.IsMatch(request.Password, passwordPattern))
            {
                return BadRequest(new { message = "Пароль должен быть не менее 8 символов и содержать буквы и цифры" });
            }

            if (_userRepository.UserExists(request.Email))
                return BadRequest(new { message = "Пользователь уже существует" });

            var user = _userRepository.CreateUser(request.Email, request.Password, request.Name ?? "");
            return Ok(new { success = true });
        }
    }
}