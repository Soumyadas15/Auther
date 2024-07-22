using FluentValidation;
using Auther.Schemas.Auth;

namespace Auther.Validators
{
    public class LoginValidator : AbstractValidator<LoginSchema>
    {
        public LoginValidator()
        {
            RuleFor(user => user.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");

            RuleFor(user => user.Password)
                .NotEmpty().WithMessage("Password is required.");

        }
    }
}