using System.Security.Cryptography;

namespace AssetMgmtApi.Utils
{
    public class SecurityUtils
    {
        public static string GenerateSecureTokenString()
        {
            var randomNumber = new byte[32];

            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber)
                    .Replace("/", "_")  // Replace URL unsafe characters
                    .Replace("+", "-")
                    .TrimEnd('=');      // Remove padding for cleaner URLs
            }
        }
    }
}