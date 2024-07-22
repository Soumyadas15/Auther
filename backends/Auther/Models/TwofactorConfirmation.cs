namespace Auther.Models
{
    public class TwoFactorConfirmation
    {
        public TwoFactorConfirmation()
        {
            Id = Guid.NewGuid().ToString();
            UserId = string.Empty;
            User = new User();
        }
        public string Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
    }
}