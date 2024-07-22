using System;

namespace Auther.Models
{
    public class Account
    {
        public Account()
        {
            Id = Guid.NewGuid().ToString();
            Provider = string.Empty;
            ProviderAccountId = string.Empty;
            UserId = string.Empty;
            User = new User();
        }
        public string Id { get; set; }
        public string? Type { get; set; }
        public string Provider { get; set; }
        public string ProviderAccountId { get; set; }
        public string? RefreshToken { get; set; }
        public string? AccessToken { get; set; }
        public int? ExpiresAt { get; set; }
        public string? TokenType { get; set; }
        public string? Scope { get; set; }
        public string? IdToken { get; set; }
        public string? SessionState { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
    }
}