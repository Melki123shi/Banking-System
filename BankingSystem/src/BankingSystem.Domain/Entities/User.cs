using System.ComponentModel.DataAnnotations;

namespace BankingSystem.src.BankingSystem.Domain.Entities;

public class User
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = null!;
    [Phone][Required]
    public string PhoneNumber { get; private set; } = null!;
    [Required]
    public string HashedPassword { get; private set; } = null!; 
    public bool IsActive { get; private set; } = true;
    public UserRole Role { get; private set; } = UserRole.Customer;
    public ICollection<Account> Accounts { get; private set; } = new List<Account>();
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; }
    protected User() { } // Required by EF Core for entity materialization
    public User(string name, string phoneNumber, string hashedPassword, UserRole role = UserRole.Customer)
    {
        Name = name;
        PhoneNumber = phoneNumber;
        HashedPassword = hashedPassword;
    }

    public void UpdateDetails(string name, string phoneNumber, bool isActive, string? hashedPassword = null)
    {
        Name = name;
        IsActive = isActive;
        PhoneNumber = phoneNumber;
        HashedPassword = hashedPassword ?? HashedPassword;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

}