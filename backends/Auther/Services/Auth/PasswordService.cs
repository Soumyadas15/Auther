using Auther.Interfaces.Auth;
using BCrypt.Net;

namespace Auther.Services.Auth
{
    public class PasswordService : IPasswordRepository
    {
        public async Task<string> HashPasswordAsync(string password)
        {
            return await Task.Run(() => BCrypt.Net.BCrypt.HashPassword(password));
        }

        public async Task<bool> VerifyPasswordAsync(string hashedPassword, string password)
        {
            return await Task.Run(() => BCrypt.Net.BCrypt.Verify(password, hashedPassword));
        }
    }
}