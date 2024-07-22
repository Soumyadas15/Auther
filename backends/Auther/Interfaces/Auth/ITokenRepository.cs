using System.Threading.Tasks;
using Auther.Models;

namespace Auther.Interfaces.Auth
{
    public interface ITokenRepository
    {
        Task<VerificationToken?> GetVerificationTokenByTokenAsync(string token);
        Task<VerificationToken?> GetVerificationTokenByEmailAsync(string email);
        Task<VerificationToken> GenerateVerificationTokenAsync(string email);

        Task<TwoFactorToken?> GetTwoFactorTokenByTokenAsync(string token);
        Task<TwoFactorToken?> GetTwoFactorTokenByEmailAsync(string email);
        Task<TwoFactorToken> GenerateTwoFactorTokenAsync(string email);

        Task<PasswordResetToken?> GetPasswordResetTokenByTokenAsync(string token);
        Task<PasswordResetToken?> GetPasswordResetTokenByEmailAsync(string email);
        Task<PasswordResetToken> GeneratePasswordResetTokenAsync(string email);
    }
}
