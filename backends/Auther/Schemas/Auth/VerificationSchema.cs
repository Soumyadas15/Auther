namespace Auther.Schemas.Auth;

public class VerificationSchema
{
    public VerificationSchema()
    {
        Code = string.Empty;
    }
    public string Code { get; set; }
}