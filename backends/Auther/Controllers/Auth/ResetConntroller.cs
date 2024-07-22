using Auther.Models;
using Auther.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using Auther.Utilities;
using FluentValidation;
using Auther.Interfaces.Auth;
using Auther.Data;
using Microsoft.EntityFrameworkCore;

namespace Auth.Controllers.Auth
{
    [ApiController]
    [Route("api/auth/reset")]
    public class ResetController : ControllerBase
    {
        private readonly TokenService _tokenService;
        private readonly IUserRepository _userRepository;
        private readonly IMailService _mailService;

        public ResetController(
            TokenService tokenService,
            IUserRepository userRepository,
            IMailService mailService
        )
        {
            _tokenService = tokenService;
            _userRepository = userRepository;
            _mailService = mailService;
        }

        [HttpPost]
        public async Task<IActionResult> Reset([FromBody] ResetRequest resetRequest)
        {
            if (string.IsNullOrEmpty(resetRequest.Email))
                return ResponseFormatter.Error(StatusCodes.Status400BadRequest, "Invalid email");
            
            var existingUser = await _userRepository.GetByEmailAsync(resetRequest.Email);
            if(existingUser == null)
                return ResponseFormatter.Error(StatusCodes.Status404NotFound, "User does not exist");
            
            if(existingUser.Provider != "credentials")
                return ResponseFormatter.Error(StatusCodes.Status409Conflict, "User is registered with a different provider");

            var passwordResetToken = await _tokenService.GeneratePasswordResetTokenAsync(existingUser.Email!);
            if (passwordResetToken == null)
                return ResponseFormatter.Error(StatusCodes.Status400BadRequest, "Failed to generate token");

            await _mailService.SendPasswordResetEmailAsync(
                passwordResetToken.Email,
                passwordResetToken.Token
            );

            return ResponseFormatter.Success("Password reset email sent");
        }
    }
    public class ResetRequest
    {
        public string Email { get; set; } = string.Empty;
    }
}