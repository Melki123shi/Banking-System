using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;
using BankingSystem.src.BankingSystem.Application.Exceptions;
using BankingSystem.src.BankingSystem.Domain.Entities;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services.Auth;

namespace BankingSystem.src.BankingSystem.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IRefreshTokenGenerator _refreshTokenGenerator;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator,
        IRefreshTokenRepository refreshTokenRepository,
        IRefreshTokenGenerator refreshTokenGenerator
        )
    {
        _jwtTokenGenerator = jwtTokenGenerator;
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _refreshTokenRepository = refreshTokenRepository;
        _refreshTokenGenerator = refreshTokenGenerator;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetUserByPhoneNumberAsync(request.PhoneNumber)
            ?? throw new AuthenticationException("Invalid phone number or password");

        if (!_passwordHasher.Verify(request.Password, user.HashedPassword))
            throw new AuthenticationException("Invalid phone number or password");

        if (!user.IsActive)
            throw new AuthenticationException("User is inactive");

        // 🔐 Access token (short-lived)
        var (accessToken, accessTokenExpiresAt) =
            _jwtTokenGenerator.Generate(user);

        // 🔁 Refresh token (long-lived)
        var refreshTokenValue = _refreshTokenGenerator.Generate();
        var refreshToken = new RefreshToken(
            user.Id,
            refreshTokenValue,
            DateTime.UtcNow.AddDays(7)
        );

        await _refreshTokenRepository.AddAsync(refreshToken);
        await _refreshTokenRepository.SaveAsync();

        return new LoginResponse(
            accessToken,
            accessTokenExpiresAt,
            refreshTokenValue
        );
    }

    public async Task<RefreshTokenResponseDto> RefreshAsync(RefreshRequestDto refreshRequestDto)
    {
        var token = await _refreshTokenRepository.GetByTokenAsync(refreshRequestDto.RefreshToken)
        ?? throw new UnauthorizedAccessException("Invalid refresh token");

        if (token.ExpiresAt < DateTime.UtcNow || token.IsRevoked)
            throw new UnauthorizedAccessException("Refresh token expired or revoked");

        var user = await _userRepository.GetUserByIdAsync(token.UserId)
            ?? throw new UnauthorizedAccessException("User not found");

        var (newAccessToken, expiresAt) =
            _jwtTokenGenerator.Generate(user);

        return new RefreshTokenResponseDto(
            refreshRequestDto.RefreshToken,
            token.ExpiresAt
        );
    }


    public async Task LogoutAsync(string refreshToken)
    {
        var token = await _refreshTokenRepository.GetByTokenAsync(refreshToken);
        if (token == null) return;

        token.Revoke();
        await _refreshTokenRepository.SaveAsync();
    }


}
