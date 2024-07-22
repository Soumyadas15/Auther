using System;

namespace Auther.Models
{
    public class VerificationToken
    {
        public VerificationToken()
        {
            Id = Guid.NewGuid().ToString();
            Token = string.Empty;
            Email = string.Empty;
        }
        public string Id { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public DateTime Expires { get; set; }
    }
}