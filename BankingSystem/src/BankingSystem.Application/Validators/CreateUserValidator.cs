using System;
using FluentValidation;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;

namespace BankingSystem.src.BankingSystem.Application.Validators;

public class CreateUserValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.PhoneNumber)
                                .NotEmpty()
                                .Matches(@"^\+251[7, 9]?[1-9]\d{1,8}$")
                                .WithMessage("Invalid phone number");

        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
    }
}

