namespace Auther.Interfaces.Auth
{
    public interface IMailService
    {
        Task SendVerificationEmailAsync(string to, string verificationCode);
        Task SendTwoFactorEmailAsync(string to, string twoFactorCode);
        Task SendPasswordResetEmailAsync(string to, string passwordResetToken);
    }
}
