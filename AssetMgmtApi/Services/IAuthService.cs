using System.IdentityModel.Tokens.Jwt;
using AssetMgmtApi.DTOs.Auth;
using AssetMgmtApi.Models;

namespace AssetMgmtApi.Services
{
    public interface IAuthService
    {
        Task<TokenRefreshResult> RefreshTokenAsync(string refreshTokenString);
        JwtSecurityToken GenerateAccessToken(User user);
    }
}