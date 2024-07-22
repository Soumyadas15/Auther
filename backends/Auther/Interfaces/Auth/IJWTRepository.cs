public interface IJwtRepository
{
    string GenerateToken(string userId);
    bool ValidateToken(string token);
    string GetUserIdFromToken(string token);
}