using System;
using Microsoft.AspNetCore.Mvc;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;
using Microsoft.AspNetCore.Authorization;
namespace BankingSystem.src.BankingSystem.API.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);
        return Ok(response);
    }
}
