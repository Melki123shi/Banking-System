using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;

namespace BankingSystem.src.BankingSystem.API.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUsersController : ControllerBase
{
    private readonly IUserManagementService _userService;

    public AdminUsersController(IUserManagementService userManagementService)
    {
        _userService = userManagementService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<CreateUserResponse>> Create([FromBody] CreateUserRequest createUserRequest)
    {
        var response = await _userService.CreateUserAsync(createUserRequest);
        return CreatedAtAction(nameof(Create), response);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDetailsResponse>>> GetAllUsers()
    {
        var response = await _userService.GetAllUsersAsync();
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDetailsResponse>> GetUserDetails(Guid id)
    {
        var response = await _userService.GetUserDetailsAsync(id);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateUser(Guid id, UpdateUserRequest updateUserRequest)
    {
        await _userService.UpdateUserAsync(id, updateUserRequest);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(Guid id)
    {
        await _userService.DeleteUserAsync(id);
        return NoContent();
    }
}
