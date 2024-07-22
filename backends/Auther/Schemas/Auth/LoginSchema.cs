namespace Auther.Schemas.Auth
{
    public class LoginSchema
    {
        public LoginSchema()
        {
            Email = string.Empty;
            Password = string.Empty;
            Code = string.Empty; 
        }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Code { get; set; }
    }
}