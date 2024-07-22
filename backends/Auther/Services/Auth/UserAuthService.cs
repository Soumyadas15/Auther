using Microsoft.EntityFrameworkCore;

using Auther.Interfaces.Auth;
using Auther.Models;
using System;
using Auther.Utilities;
using Auther.Data;


namespace Auther.Services.Auth
{
    public class UserAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordRepository _passwordRepository;
        private readonly ITokenRepository _tokenService;
        private readonly IJwtRepository _jwtService;
        private readonly AppDbContext _context;
        

        public UserAuthService(IUserRepository userRepository, 
                                IPasswordRepository passwordRepository, 
                                ITokenRepository tokenService,
                                IJwtRepository jwtService,
                                AppDbContext context
        )
        {
            _userRepository = userRepository;
            _passwordRepository = passwordRepository;
            _tokenService = tokenService;
            _jwtService = jwtService;
            _context = context;
        }

        public async Task RegisterUserAsync(User user)
        {
            var existingUser = await _userRepository.GetByEmailAsync(user.Email!);
            
            if (existingUser != null)
                throw new ServiceException("User already exists", StatusCodes.Status409Conflict);

            user.Password = await _passwordRepository.HashPasswordAsync(user.Password!);
            user.Role = UserRole.GUEST;
            user.Provider = "credentials";


            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();
        }


        public async Task VerifyUserAsync(string token)
        {
            var existingToken = await _tokenService.GetVerificationTokenByTokenAsync(token)
                ?? throw new ServiceException("Invalid token", StatusCodes.Status403Forbidden);


            bool hasExpired = existingToken.Expires < DateTime.UtcNow;
            if (hasExpired)
                throw new ServiceException("Token has expired", StatusCodes.Status403Forbidden);

            var existingUser = await _userRepository.GetByEmailAsync(existingToken.Email)
                ?? throw new ServiceException("User does not exist", StatusCodes.Status404NotFound);

            existingUser.EmailVerified = DateTime.UtcNow;

            _context.Users.Update(existingUser);
            _context.VerificationTokens.Remove(existingToken);

            await _context.SaveChangesAsync();
        }



        public async Task<TwoFactorConfirmation?> GetTwoFactorConfirmationByUserIdAsync(string userId){
            return await _context.TwoFactorConfirmations
                    .FirstOrDefaultAsync(t => t.UserId == userId);
        }



        public async Task ResetPasswordAsync(PasswordResetToken token, string password)
        {
            bool hasExpired = token.Expires < DateTime.UtcNow;
            if (hasExpired)
                throw new ServiceException("Token has expired", StatusCodes.Status403Forbidden);

            var existingUser = await _userRepository.GetByEmailAsync(token.Email)
                ?? throw new ServiceException("User does not exist", StatusCodes.Status404NotFound);

            if(existingUser.Provider != "credentials")
                throw new ServiceException("User is registered with a different provider", StatusCodes.Status409Conflict);
            
            var hashedPassword = await _passwordRepository.HashPasswordAsync(password);

            existingUser.Password = hashedPassword;

            _context.Users.Update(existingUser);
            _context.PasswordResetTokens.Remove(token);

            await _context.SaveChangesAsync();

        }



        public async Task<object> CredentialsLoginAsync(string email, string password)
        {
            var existingUser = await _userRepository.GetByEmailAsync(email)
                ?? throw new ServiceException("User does not exist", StatusCodes.Status404NotFound);
            
            var passwordMatch = await _passwordRepository.VerifyPasswordAsync(existingUser.Password!, password);
            if(!passwordMatch){
                throw new ServiceException("incorrect password", StatusCodes.Status403Forbidden);
            }

            var jwtToken = _jwtService.GenerateToken(existingUser.Id);

            return new
            {
                User = new
                {
                    existingUser.Name,
                    existingUser.Email,
                    existingUser.Role,
                    existingUser.Image
                },
                Token = jwtToken
            };
        }
    }
}
