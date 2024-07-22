using Auther.Models;
using Auther.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using Auther.Utilities;
using Auther.Interfaces.Auth;
using Auther.Data;

namespace Auther.Controllers.Auth
{
    [ApiController]
    [Route("api/auth/login")]
    public class LoginController : ControllerBase
    {
        private readonly UserAuthService _userService;
        private readonly TokenService _tokenService;
        private readonly IUserRepository _userRepository;
        private readonly IPasswordRepository _passwordRepository;
        private readonly IMailService _mailService;
        private readonly AppDbContext _context;

        public LoginController(
            UserAuthService userService,
            TokenService tokenService,
            IUserRepository userRepository,
            IPasswordRepository passwordRepository,
            IMailService mailService,
            AppDbContext context
        )
        {
            _userService = userService;
            _tokenService = tokenService;
            _userRepository = userRepository;
            _passwordRepository = passwordRepository;
            _mailService = mailService;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if (string.IsNullOrEmpty(loginRequest.Email))
                return ResponseFormatter.Error(StatusCodes.Status400BadRequest, "Invalid email");

            if (string.IsNullOrEmpty(loginRequest.Password))
                return ResponseFormatter.Error(StatusCodes.Status400BadRequest, "Invalid password");

            var existingUser = await _userRepository.GetByEmailAsync(loginRequest.Email);
            if (existingUser == null)
                return ResponseFormatter.Error(StatusCodes.Status404NotFound, "User does not exist");

            if (existingUser.Provider != "credentials")
                return ResponseFormatter.Error(StatusCodes.Status409Conflict, "Email is in use with another provider");

            var passwordMatch = await _passwordRepository.VerifyPasswordAsync(existingUser.Password!, loginRequest.Password);
            if (!passwordMatch)
                return ResponseFormatter.Error(StatusCodes.Status403Forbidden, "Incorrect password");

            if (existingUser.EmailVerified == null)
            {
                await _tokenService.GenerateVerificationTokenAsync(existingUser.Email!);
                return ResponseFormatter.Error(StatusCodes.Status201Created, "Verification code sent again");
            }

            if (existingUser.IsTwoFactorEnabled)
            {
                if (!string.IsNullOrEmpty(loginRequest.Code))
                {
                    var twoFactorToken = await _tokenService.GetTwoFactorTokenByTokenAsync(loginRequest.Code);

                    if (twoFactorToken == null || twoFactorToken.Token != loginRequest.Code)
                        return ResponseFormatter.Error(StatusCodes.Status403Forbidden, "Invalid token");

                    if (twoFactorToken.Expires < DateTime.UtcNow)
                        return ResponseFormatter.Error(StatusCodes.Status403Forbidden, "Token has expired.");

                    _context.TwoFactorTokens.Remove(twoFactorToken);
                    await _context.SaveChangesAsync();

                    var existingConfirmation = await _userService.GetTwoFactorConfirmationByUserIdAsync(existingUser.Id);
                    if (existingConfirmation != null)
                    {
                        _context.TwoFactorConfirmations.Remove(existingConfirmation);
                        await _context.SaveChangesAsync();
                    }

                    var twoFactorConfirmation = new TwoFactorConfirmation
                    {
                        UserId = existingUser.Id
                    };
                    
                    await _context.TwoFactorConfirmations.AddAsync(twoFactorConfirmation);
                }
                else
                {
                    var twoFactorToken = await _tokenService.GenerateTwoFactorTokenAsync(existingUser.Email!);
                    await _mailService.SendTwoFactorEmailAsync(existingUser.Email!, twoFactorToken.Token);

                    return ResponseFormatter.Success("Two-factor code sent!", new { twofactor = true });
                }
            }

            try
            {
                var resUser = await _userService.CredentialsLoginAsync(loginRequest.Email, loginRequest.Password);
                if (resUser == null)
                    return ResponseFormatter.Error(StatusCodes.Status403Forbidden, "Invalid credentials");

                return ResponseFormatter.Success("Logged in", resUser);
            }
            catch (ServiceException ex)
            {
                return ResponseFormatter.Error(ex.StatusCode, ex.Message);
            }
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Code { get; set; }
    }
}