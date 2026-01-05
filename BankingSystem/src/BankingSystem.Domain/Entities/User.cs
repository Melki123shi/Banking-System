using System.ComponentModel.DataAnnotations;

namespace BankingSystem.src.BankingSystem.Domain.Entities;

public class User
{
    public Guid Id { get; private set; }
    public string FirstName { get; private set; } = null!;
    public string LastName { get; private set; } = null!;
    public string Email { get; private set; } = null!;
    [Phone][Required]
    public string PhoneNumber { get; private set; } = null!;
    public DateTime? DateOfBirth { get; private set; }
    [Required]
    public string HashedPassword { get; private set; } = null!; 
    public bool IsActive { get; private set; } = true;
    public UserRole Role { get; private set; } = UserRole.Customer;
    public ICollection<Account> Accounts { get; private set; } = new List<Account>();
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; }
    protected User() { } // Required by EF Core for entity materialization
    public User(string firstName, string lastName, string email, string phoneNumber, string hashedPassword, DateTime? dateOfBirth = null)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        PhoneNumber = phoneNumber;
        HashedPassword = hashedPassword;
        DateOfBirth = dateOfBirth;
    }

    public void UpdateDetails(string firstName, string lastName, string phoneNumber, string email, bool isActive, string? hashedPassword = null, DateTime? dateOfBirth = null)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        IsActive = isActive;
        PhoneNumber = phoneNumber;
        HashedPassword = hashedPassword ?? HashedPassword;
        DateOfBirth = dateOfBirth;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

}