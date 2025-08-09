using AssetMgmtApi.Models;

namespace AssetMgmtApi.Interfaces
{
    public interface IAuthRepo
    {
        public Task GetExpiredRefreshTokensAsync(Guid userId);
        
        public Task<RefreshToken> AddRefreshTokenAsync(Guid userId);

        public Task<RefreshToken?> GetRefreshTokenAsync(string refreshTokenString);

        public Task RevokeTokenAsync(string refreshTokenString);

        Task RevokeAllTokensForUserAsync(Guid userId);
    }
}