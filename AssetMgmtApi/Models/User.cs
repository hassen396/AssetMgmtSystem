using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace AssetMgmtApi.Models
{
    public class User : IdentityUser<Guid>
    {
        
        [StringLength(50,  MinimumLength = 1, ErrorMessage = "FirstName must be between 1 and 50 characters")]
        public string FirstName { get; set; } = string.Empty;

        [StringLength(50, MinimumLength = 1, ErrorMessage = "LastName must be between 1 and 50 characters")]
        public string LastName { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}