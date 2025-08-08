using System.IdentityModel.Tokens.Jwt;
using AssetMgmtApi.DTOs;
using AssetMgmtApi.Models;

namespace AssetMgmtApi.Interfaces
{
    public interface IAuthService
    {
        Task<TokenRefreshResult> RefreshTokenAsync(string refreshTokenString);
        public JwtSecurityToken GenerateAccessToken(User user);
    }
}