using System.ComponentModel.DataAnnotations;

namespace AssetMgmtApi.DTOs.Auth;

public class LoginDto
{
    [EmailAddress]
    public required string Email { get; set; }

    [DataType(DataType.Password)]
    public required string Password { get; set; }
    
}