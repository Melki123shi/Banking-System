using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;
using BankingSystem.src.BankingSystem.Application.Exceptions;

namespace BankingSystem.src.BankingSystem.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator
        )
    {
        _jwtTokenGenerator = jwtTokenGenerator;
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

     public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetUserByPhoneNumberAsync(request.PhoneNumber)
            ?? throw new AuthenticationException("Invalid Phone number or password");

        if (!_passwordHasher.Verify(request.Password, user.HashedPassword))
            throw new AuthenticationException("Invalid Phone number or password");

        if (!user.IsActive)
            throw new AuthenticationException("User is inactive");

        var (token, expiresAt) = _jwtTokenGenerator.Generate(user);

        return new LoginResponse(token, expiresAt);
    }

}
