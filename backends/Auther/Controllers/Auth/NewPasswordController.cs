using Auther.Models;
using Auther.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using Auther.Utilities;
using Auther.Interfaces.Auth;
using Auther.Data;

namespace Auther.Controllers.Auth
{
    [ApiController]
    [Route("api/auth/new-password")]
    public class NewPasswordController : ControllerBase
    {
        private readonly UserAuthService _userService;
        private readonly TokenService _tokenService;
        private readonly IUserRepository _userRepository;
        private readonly IPasswordRepository _passwordRepository;
        private readonly IMailService _mailService;
        private readonly AppDbContext _context;

        public NewPasswordController(
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
        public async Task<IActionResult> NewPassword([FromQuery] string token, [FromBody] NewPasswordRequest newPasswordRequest)
        {
            if (string.IsNullOrEmpty(token))
            {
                return ResponseFormatter.Error(StatusCodes.Status400BadRequest, "Token is missing");
            }
                
            if (string.IsNullOrEmpty(newPasswordRequest.Password))
            {
                return ResponseFormatter.Error(StatusCodes.Status400BadRequest, "Invalid password");
            }
                
            if(newPasswordRequest.Password.Length < 6)
            {
                return ResponseFormatter.Error(StatusCodes.Status400BadRequest, "Password should be at least 6 characters long");
            }
                
            var existingToken = await _tokenService.GetPasswordResetTokenByTokenAsync(token);
            if (existingToken == null)
            {
                return ResponseFormatter.Error(StatusCodes.Status404NotFound, "Invalid token");
            }
                
            var hasExpired = existingToken.Expires < DateTime.UtcNow;
            if (hasExpired)
            {
                return ResponseFormatter.Error(StatusCodes.Status403Forbidden, "Token has expired");
            }

            await _userService.ResetPasswordAsync(existingToken, newPasswordRequest.Password);
            return ResponseFormatter.Success("Password changed successfully");
        }
    }
    public class NewPasswordRequest
    {
        public string Password { get; set; } = string.Empty;
    }
}