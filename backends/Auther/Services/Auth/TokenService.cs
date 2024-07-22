using Microsoft.EntityFrameworkCore;

using Auther.Data;
using Auther.Interfaces.Auth;
using Auther.Models;
using System.Security.Cryptography;

namespace Auther.Services.Auth
{

    public class TokenService : ITokenRepository
    {
        private readonly AppDbContext _context;
        private readonly IMailService _emailService;
        private readonly ILogger<TokenService> _logger;

        public TokenService(AppDbContext context, 
                            IMailService emailService, 
                            ILogger<TokenService> logger
        )
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }
        private static string GenerateRandomCode()
        {
            string Characters = "0123456789";
            int CodeLength = 6;
            byte[] randomBytes = new byte[1];
            string code = string.Empty;

            for (int i = 0; i < CodeLength; i++)
            {
                RandomNumberGenerator.Fill(randomBytes);
                int randomIndex = randomBytes[0] % Characters.Length;
                code += Characters[randomIndex];
            }

            return code;
        }


        public async Task<VerificationToken?> GetVerificationTokenByTokenAsync(string token)
        {
            var existingToken = await _context.VerificationTokens
                    .FirstOrDefaultAsync(t => t.Token == token);

            return existingToken;
        }

        public async Task<VerificationToken?> GetVerificationTokenByEmailAsync(string email)
        {
            var existingToken = await _context.VerificationTokens
                    .FirstOrDefaultAsync(t => t.Email == email);

            return existingToken;
        }


        public async Task<TwoFactorToken?> GetTwoFactorTokenByTokenAsync(string token)
        {
            var existingToken = await _context.TwoFactorTokens
                    .FirstOrDefaultAsync(t => t.Token == token);

            return existingToken;
        }

        public async Task<TwoFactorToken?> GetTwoFactorTokenByEmailAsync(string email)
        {
            var existingToken = await _context.TwoFactorTokens
                    .FirstOrDefaultAsync(t => t.Email == email);

            return existingToken;
        }




        public async Task<PasswordResetToken?> GetPasswordResetTokenByTokenAsync(string token)
        {
            var existingToken = await _context.PasswordResetTokens
                    .FirstOrDefaultAsync(t => t.Token == token);

            return existingToken;
        }

        public async Task<PasswordResetToken?> GetPasswordResetTokenByEmailAsync(string email)
        {
            var existingToken = await _context.PasswordResetTokens
                    .FirstOrDefaultAsync(t => t.Email == email);

            return existingToken;
        }




        //Deletes existing tokens

        private async Task DeleteExistingTokenAsync(string email, string tokenType)
        {
            if (tokenType == "verificationToken")
            {
                var existingToken = await _context.VerificationTokens
                    .FirstOrDefaultAsync(t => t.Email == email);

                if (existingToken != null)
                {
                    _context.VerificationTokens.Remove(existingToken);
                    await _context.SaveChangesAsync();
                }
            }

            if (tokenType == "twoFactor")
            {
                var existingToken = await _context.TwoFactorTokens
                    .FirstOrDefaultAsync(t => t.Email == email);

                if (existingToken != null)
                {
                    _context.TwoFactorTokens.Remove(existingToken);
                    await _context.SaveChangesAsync();
                }
            }

            if (tokenType == "passwordReset")
            {
                var existingToken = await _context.PasswordResetTokens
                    .FirstOrDefaultAsync(t => t.Email == email);

                if (existingToken != null)
                {
                    _context.PasswordResetTokens.Remove(existingToken);
                    await _context.SaveChangesAsync();
                }
            }
        }



        public async Task<VerificationToken> GenerateVerificationTokenAsync(string email)
        {
            string token = GenerateRandomCode();
            DateTime expires = DateTime.UtcNow.AddMinutes(10);

            try
            {
                await DeleteExistingTokenAsync(email, "verificationToken");

                var verificationToken = new VerificationToken
                {
                    Email = email,
                    Token = token,
                    Expires = expires
                };

                if (_context.VerificationTokens != null)
                {
                    await _context.VerificationTokens.AddAsync(verificationToken);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    throw new InvalidOperationException("VerificationTokens DbSet is not initialized.");
                }

                await _emailService.SendVerificationEmailAsync(email, token);
                return verificationToken;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating verification token for {Email}", email);
                throw new Exception("Failed to generate verification token", ex);
            }
        }


        public async Task<TwoFactorToken> GenerateTwoFactorTokenAsync(string email)
        {
            string token = GenerateRandomCode();
            DateTime expires = DateTime.UtcNow.AddMinutes(10);

            try
            {
                await DeleteExistingTokenAsync(email, "twoFactor");

                var twoFactorToken = new TwoFactorToken
                {
                    Email = email,
                    Token = token,
                    Expires = expires
                };

                if (_context.TwoFactorTokens != null)
                {
                    await _context.TwoFactorTokens.AddAsync(twoFactorToken);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    throw new InvalidOperationException("VerificationTokens DbSet is not initialized.");
                }
                return twoFactorToken;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating two factor token for {Email}", email);
                throw new Exception("Failed to generate two factor token", ex);
            }
        }




        public async Task<PasswordResetToken> GeneratePasswordResetTokenAsync(string email)
        {
            string token = Guid.NewGuid().ToString();
            DateTime expires = DateTime.UtcNow.AddMinutes(10);

            try
            {
                await DeleteExistingTokenAsync(email, "passwordReset");

                var passwordResetToken = new PasswordResetToken
                {
                    Email = email,
                    Token = token,
                    Expires = expires
                };

                if (_context.TwoFactorTokens != null)
                {
                    await _context.PasswordResetTokens.AddAsync(passwordResetToken);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    throw new InvalidOperationException("PasswordResetTokens DbSet is not initialized.");
                }
                return passwordResetToken;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating password reset token for {Email}", email);
                throw new Exception("Failed to generate password reset token", ex);
            }
        }

    }
}