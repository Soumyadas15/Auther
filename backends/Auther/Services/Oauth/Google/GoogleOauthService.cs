using Auther.Controllers.OAuth;
using Auther.Data;
using Auther.Interfaces.Auth;
using Auther.Models;
using Auther.Utilities;

namespace Auther.Services.OAuth
{
    public class GoogleOAuthService
    {
        private readonly AppDbContext _context;
        private readonly IUserRepository _userRepository;
        private readonly IJwtRepository _jwtRepository;

        public GoogleOAuthService(AppDbContext context, IUserRepository userRepository, IJwtRepository jwtRepository)
        {
            _context = context;
            _userRepository = userRepository;
            _jwtRepository = jwtRepository;
        }

        public async Task<AuthResponse> AuthenticateAsync(GoogleUserInfo userData)
        {
            var providerUserId = userData.Sub!;
            var email = userData.Email!;
            var existingUser = await _userRepository.GetByEmailAsync(email);

            if (existingUser != null)
            {
                return await HandleExistingUserAsync(existingUser);
            }

            var newUser = await CreateNewUserAsync(userData, providerUserId);
            var token = _jwtRepository.GenerateToken(newUser.Id);

            return new AuthResponse
            {
                User = MapToUserDto(newUser),
                Token = token
            };
        }

        private async Task<AuthResponse> HandleExistingUserAsync(User existingUser)
        {
            if (existingUser.Provider != "google")
            {
                throw new ServiceException("Email already exists", StatusCodes.Status409Conflict);
            }

            var token = _jwtRepository.GenerateToken(existingUser.Id);

            return new AuthResponse
            {
                User = MapToUserDto(existingUser),
                Token = token
            };
        }

        private async Task<User> CreateNewUserAsync(GoogleUserInfo userData, string providerUserId)
        {
            var user = new User
            {
                Name = userData.Name!,
                Email = userData.Email!,
                Image = userData.PhotoUrl!,
                Provider = "google",
                EmailVerified = DateTime.UtcNow,
                Role = UserRole.GUEST
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            var account = new Account
            {
                Provider = "google",
                ProviderAccountId = providerUserId,
                Type = "User",
                User = user,
            };

            await _context.Accounts.AddAsync(account);
            await _context.SaveChangesAsync();

            return user;
        }

        private UserDto MapToUserDto(User user) => new UserDto
        {
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            Image = user.Image
        };

        public class AuthResponse
        {
            public UserDto? User { get; set; }
            public string? Token { get; set; }
        }

        public class UserDto
        {
            public string? Name { get; set; }
            public string? Email { get; set; }
            public UserRole? Role { get; set; }
            public string? Image { get; set; }
        }
    }
}
