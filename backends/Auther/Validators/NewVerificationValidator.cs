using Auther.Models;
using FluentValidation;

namespace Auther.Validators
{
    public class NewVerificationValidator : AbstractValidator<VerificationToken>
    {
        public NewVerificationValidator()
        {
            RuleFor(verificationToken => verificationToken.Token)
                .NotEmpty().WithMessage("Code is required")
                .MinimumLength(6).WithMessage("Code must be at 6 characters long.");
        }
    }
}