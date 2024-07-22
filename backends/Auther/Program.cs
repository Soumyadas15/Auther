using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using DotNetEnv;
using FluentValidation;
using Serilog;
using Auther.Data;
using Auther.Interfaces.Auth;
using Auther.Services.Auth;
using Auther.Validators;
using Auther.Models;
using Auther.Schemas.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using System.Security.Claims;
using Auther.Services.OAuth;
using AspNet.Security.OAuth.GitHub;


var builder = WebApplication.CreateBuilder(args);

Env.Load();


Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));






//JWT configuration

var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET");
if (string.IsNullOrEmpty(secretKey))
{
    throw new InvalidOperationException("JWT Secret Key is not configured.");
}

var expirationHoursString = Environment.GetEnvironmentVariable("JWT_EXPIRATION");
if (string.IsNullOrEmpty(expirationHoursString) || !int.TryParse(expirationHoursString, out var expirationHours))
{
    throw new InvalidOperationException("JWT Expiration Hours is not configured or is invalid.");
}


builder.Services.AddSingleton<IJwtRepository>(new JwtService(secretKey, expirationHours));


builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPasswordRepository, PasswordService>();
builder.Services.AddScoped<UserAuthService>();


builder.Services.AddScoped<IValidator<User>, RegisterValidator>();
builder.Services.AddScoped<IValidator<LoginSchema>, LoginValidator>();
builder.Services.AddScoped<IValidator<VerificationToken>, NewVerificationValidator>();


builder.Services.AddScoped<IMailService, MailService>();
builder.Services.AddScoped<ITokenRepository, TokenService>();
builder.Services.AddScoped<TokenService>();

builder.Services.AddScoped<GoogleOAuthService>();



var googleClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
var googleClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");
var googleCallbackUrl = Environment.GetEnvironmentVariable("GOOGLE_CALLBACK_URL");

var githubClientId = Environment.GetEnvironmentVariable("GITHUB_CLIENT_ID");
var githubClientSecret = Environment.GetEnvironmentVariable("GITHUB_CLIENT_SECRET");
var githubCallbackUrl = Environment.GetEnvironmentVariable("GITHUB_CALLBACK_URL");

var facebookClientId = Environment.GetEnvironmentVariable("FACEBOOK_CLIENT_ID");
var facebookClientSecret = Environment.GetEnvironmentVariable("FACEBOOK_CLIENT_SECRET");
var facebookCallbackUrl = Environment.GetEnvironmentVariable("FACEBOOK_CALLBACK_URL");

if (string.IsNullOrEmpty(googleClientId) || string.IsNullOrEmpty(googleClientSecret))
{
    throw new InvalidOperationException("Google Client ID or Secret is not configured.");
}

if (string.IsNullOrEmpty(githubClientId) || string.IsNullOrEmpty(githubClientSecret))
{
    throw new InvalidOperationException("GitHub Client ID or Secret is not configured.");
}

if (string.IsNullOrEmpty(facebookClientId) || string.IsNullOrEmpty(facebookClientSecret))
{
    throw new InvalidOperationException("Facebook Client ID or Secret is not configured.");
}





builder.Services.AddAuthentication(options => {
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie("Application")
.AddCookie("Cookies")
.AddGoogle(options =>
{
    options.ClientId = googleClientId;
    options.ClientSecret = googleClientSecret;
    options.CallbackPath = "/api/auth/callback/google";

    options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "sub");
    options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
    options.ClaimActions.MapJsonKey("urn:google:profile:picture", "picture");
})
.AddGitHub(options =>
{
    options.ClientId = githubClientId;
    options.ClientSecret = githubClientSecret;
    options.CallbackPath = "/api/auth/callback/github";

    options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
    options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
    options.ClaimActions.MapJsonKey("urn:github:avatar_url", "avatar_url");
});






// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Host.UseSerilog();

// Load environment variables from .env file



var app = builder.Build();




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// MyDatabasePassword123456


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();








app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();



record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}




