using Auther.Models;
using Auther.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using Auther.Utilities;
using Auther.Schemas.Auth;

using FluentValidation;

namespace Auther.Controllers.Auth
{
    [ApiController]
    [Route("api/auth/new-verification")]
    public class NewVerificationController : ControllerBase
    {
        private readonly UserAuthService _userService;
        private readonly IValidator<VerificationToken> _newVerificationValidator;

        public NewVerificationController(UserAuthService userService, IValidator<VerificationToken> newVerificationValidator)
        {
            _userService = userService;
            _newVerificationValidator = newVerificationValidator;
        }

        [HttpPost]
        public async Task<IActionResult> NewVerification([FromBody] VerificationSchema request)
        {
            var verificationToken = new VerificationToken();
            {
                verificationToken.Token = request.Code;
            };

            var validatedFields = await _newVerificationValidator.ValidateAsync(verificationToken);
            if (!validatedFields.IsValid)
                return ResponseFormatter.Error(StatusCodes.Status400BadRequest, validatedFields.Errors[0].ErrorMessage);

            try
            {
                await _userService.VerifyUserAsync(verificationToken.Token);
                return ResponseFormatter.Success("Email verified");
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
