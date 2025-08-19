using AssetMgmtApi.Models;

namespace AssetMgmtApi.DTOs.Auth
{
    public class TokenRefreshResult
{
    public bool IsSuccess { get; set; }
    public string? ErrorMessage { get; set; }
    public string? AccessToken { get; set; }
    public RefreshToken? NewRefreshToken { get; set; }
}
}