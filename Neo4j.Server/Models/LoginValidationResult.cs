namespace Neo4j.Server.Models
{
    public class LoginValidationResult
    {
        public bool Exists { get; set; }
        public bool IsVerified { get; set; }
        public bool PasswordMatch { get; set; }
    }

}
