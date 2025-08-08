using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AssetMgmtApi.Models;

public class RefreshToken
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Token { get; set; } = null!;
    public DateTime Expires { get; set; }
    public bool IsRevoked { get; set; } = false;
    public DateTime Created { get; set; } = DateTime.UtcNow;

    [ForeignKey("User")]
    public Guid UserId { get; set; }

    [JsonIgnore]
    public User User { get; set; } = null!;
}
