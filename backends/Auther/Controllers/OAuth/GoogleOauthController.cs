using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using Auther.Services.Auth;
using System.Text.Json;
using Auther.Services.OAuth;

namespace Auther.Controllers.OAuth
{
    [Route("api/auth")]
    [ApiController]
    public class GoogleOAuthController : ControllerBase
    {
        private readonly UserAuthService _userService;
        private readonly ILogger<GoogleOAuthController> _logger;
        private readonly IJwtRepository _jwtRepository;
        private readonly GoogleOAuthService _googleOAuthService;

        public GoogleOAuthController(UserAuthService userService,
                                    ILogger<GoogleOAuthController> logger,
                                    IJwtRepository jwtRepository,
                                    GoogleOAuthService googleOAuthService)
        {
            _userService = userService;
            _logger = logger;
            _jwtRepository = jwtRepository;
            _googleOAuthService = googleOAuthService;
        }

        [HttpGet("login/google")]
        public IActionResult Login(string returnUrl = null)
        {
            if (string.IsNullOrEmpty(returnUrl))
            {
                returnUrl = "http://localhost:3000/home";
            }

            return new ChallengeResult(
                GoogleDefaults.AuthenticationScheme,
                new AuthenticationProperties
                {
                    RedirectUri = Url.Action(nameof(LoginCallback), new { returnUrl })
                });
        }

        public async Task<IActionResult> LoginCallback(string returnUrl)
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded)
            {
                return Redirect($"{returnUrl}/auth/login?error=OAuthAccountNotLinked");
            }

            var claims = authenticateResult.Principal.Claims.Select(claim => new
            {
                claim.Type,
                claim.Value
            });

            var claimsIdentity = new ClaimsIdentity("Application");
            claimsIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, authenticateResult.Principal.FindFirst(ClaimTypes.NameIdentifier)?.Value));
            claimsIdentity.AddClaim(new Claim(ClaimTypes.Email, authenticateResult.Principal.FindFirst(ClaimTypes.Email)?.Value));


            var userInfo = new GoogleUserInfo
            {
                Sub = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value,
                Name = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value,
                Email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value,
                PhotoUrl = claims.FirstOrDefault(c => c.Type == "picture")?.Value
            };

            await HttpContext.SignInAsync("Application", new ClaimsPrincipal(claimsIdentity));

            var authResponse = await _googleOAuthService.AuthenticateAsync(userInfo);
            var user = JsonSerializer.Serialize(authResponse.User);

            HttpContext.Response.Cookies.Append("currentUserToken", user, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            });

            HttpContext.Response.Cookies.Append("jwtToken", authResponse.Token!, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            });
            return Redirect(returnUrl);
        }
    }
    public class GoogleUserInfo
    {
        public string? Sub { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? PhotoUrl { get; set; }
    }
}