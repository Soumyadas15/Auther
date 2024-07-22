namespace Auther.Interfaces.Auth
{
    public interface IPasswordRepository
    {
        Task<string> HashPasswordAsync(string password);
        Task<bool> VerifyPasswordAsync(string hashedPassword, string password);
    }
}