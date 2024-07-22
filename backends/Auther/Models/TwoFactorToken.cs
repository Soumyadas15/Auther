using System;

namespace Auther.Models
{
    public class TwoFactorToken
    {
        public TwoFactorToken()
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
