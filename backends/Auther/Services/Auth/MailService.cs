using MailKit.Net.Smtp;
using MimeKit;
using Auther.Utilities;
using Auther.Interfaces.Auth;

namespace Auther.Services.Auth
{
    
    public class MailService : IMailService
    {
        private readonly string _smtpServer = "smtp.gmail.com";
        private readonly int _port = 587;
        private readonly string _email;
        private readonly string _password;
        private readonly string _frontendUrl;

        public MailService()
        {
            
            _email = Environment.GetEnvironmentVariable("MAIL_ADDRESS")
                      ?? throw new InvalidOperationException("MAIL_ADDRESS environment variable not set.");
            _password = Environment.GetEnvironmentVariable("MAIL_PASSWORD")
                         ?? throw new InvalidOperationException("MAIL_PASSWORD environment variable not set.");
            _frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL")
                           ?? throw new InvalidOperationException("FRONTEND_URL environment variable not set.");
        }


        public async Task SendEmailAsync(string to, string subject, string message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("Auther", _email));
            emailMessage.To.Add(new MailboxAddress("", to));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("html") { Text = message };

            

            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_smtpServer, _port, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(_email, _password);
                    await client.SendAsync(emailMessage);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending email: {ex.Message}");
                }
                finally
                {
                    await client.DisconnectAsync(true);
                }
            }
        }

        public async Task SendVerificationEmailAsync(string to, string token)
        {
            string subject = "User Verification";
            string message = $@"
                <h1>Verify Your Account</h1>
                <p>Your verification code is <strong>{token}</strong></p>
                <p>Please enter this code to verify your account.</p>";

            await SendEmailAsync(to, subject, message);
        }

        public async Task SendTwoFactorEmailAsync(string to, string token)
        {
            string subject = "Two factor code";
            string message = $@"
                <h1>Two Factor Authentication</h1>
                <p>Your two factor code is <strong>{token}</strong></p>";

            await SendEmailAsync(to, subject, message);
        }



        public async Task SendPasswordResetEmailAsync(string to, string token)
        {
            string resetLink = $"{_frontendUrl}/auth/new-password?token={token}";
            string subject = "Reset your password";
            string message = $@"
                <h1>Reset your password</h1>
                <p>Visit this <a href=""{resetLink}"">link</a> to reset your password</p>";

            await SendEmailAsync(to, subject, message);
        }
    }
}