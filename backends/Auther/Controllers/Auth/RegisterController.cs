using Auther.Models;
using Auther.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using Auther.Utilities;

using FluentValidation;

namespace Auther.Controllers.Auth
{
    [ApiController]
    [Route("api/auth/register")]
    public class RegisterController : ControllerBase
    {
        private readonly UserAuthService _userService;
        private readonly IValidator<User> _registerValidator;
        private readonly TokenService _tokenService;

        public RegisterController(UserAuthService userService, TokenService tokenService, IValidator<User> registerValidator)
        {
            _userService = userService;
            _registerValidator = registerValidator;
            _tokenService = tokenService;
        }

        [HttpPost]
        public async Task<IActionResult> Register(User user)
        {
            var validatedFields = await _registerValidator.ValidateAsync(user);

            if (!validatedFields.IsValid)
            {
                return ResponseFormatter.Error(StatusCodes.Status400BadRequest, validatedFields.Errors[0].ErrorMessage);
            }

            try
            {
                user.Role = UserRole.GUEST;
                await _userService.RegisterUserAsync(user);
                string email = user.Email!;
                await _tokenService.GenerateVerificationTokenAsync(email);

                return ResponseFormatter.Success("Verification mail sent");
            }
            catch (ServiceException ex)
            {
                return ResponseFormatter.Error(ex.StatusCode, ex.Message);
            }
            catch (Exception)
            {
                return ResponseFormatter.Error(StatusCodes.Status500InternalServerError, "An unexpected error occurred");
            }
        }
    }
}
