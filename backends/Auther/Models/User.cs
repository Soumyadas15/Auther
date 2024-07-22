using System;
using System.Collections.Generic;

namespace Auther.Models
{
    public enum UserRole
    {
        ADMIN,
        GUEST
    }

    public class User
    {
        public User()
        {
            Id = Guid.NewGuid().ToString();
            Accounts = new List<Account>();
        }
        public string Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public DateTime? EmailVerified { get; set; }
        public string? Image { get; set; }
        public string? Password { get; set; }
        public UserRole Role { get; set; } = UserRole.GUEST;
        public string? Provider { get; set; }
        public bool IsTwoFactorEnabled { get; set; } = false;
        public TwoFactorConfirmation? TwoFactorConfirmation { get; set; }
        public ICollection<Account> Accounts { get; set; }
    }
}