using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AssetMgmtApi.Models;

public class RefreshToken
{
    [Key]
    public Guid Id { get; init; }
    
    [StringLength(1000, ErrorMessage = "refresh token cannot exceed 1000 characters")]
    public string? Token { get; init; } 
    
    public DateTimeOffset Expires { get; init; }
    
    public bool IsRevoked { get; set; }
    
    public DateTimeOffset Created { get; init; } = DateTimeOffset.UtcNow;

    
    [ForeignKey("User")]
    public Guid UserId { get; init; }

    
    [JsonIgnore]
    public User User { get; init; } = null!;
}
