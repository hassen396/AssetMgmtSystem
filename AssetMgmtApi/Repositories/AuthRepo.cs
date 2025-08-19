using AssetMgmtApi.Data;
using AssetMgmtApi.Models;
using AssetMgmtApi.Interfaces;
using Microsoft.EntityFrameworkCore;
using AssetMgmtApi.Utils;

namespace AssetMgmtApi.Repositories
{
    public class AuthRepo : IAuthRepo
    {
        private readonly ApplicationDbContext _context;

        public AuthRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RefreshToken> AddRefreshTokenAsync(Guid userId)
        {
            var refreshToken = new RefreshToken
            {
                Token = SecurityUtils.GenerateSecureTokenString(), // or a more secure method
                Expires = DateTime.UtcNow.AddDays(7),
                UserId = userId
            };
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();
            return refreshToken;
        }

        public async Task GetExpiredRefreshTokensAsync(Guid userId)
        {
            var expiredTokens = await _context.RefreshTokens.Where(rt => rt.UserId == userId && rt.Expires <= DateTime.UtcNow).ToListAsync();
            if (expiredTokens.Any())
            {
                _context.RefreshTokens.RemoveRange(expiredTokens);
            }
            await _context.SaveChangesAsync();
        }

        public async Task<RefreshToken?> GetRefreshTokenAsync(string refreshTokenString)
        {
            var storedToken = await _context.RefreshTokens
            .SingleOrDefaultAsync(rt => rt.Token == refreshTokenString);

            if (storedToken == null)
                return null;
            return storedToken;
        }

        public async Task RevokeAllTokensForUserAsync(Guid userId)
        {
            await _context.RefreshTokens
                        .Where(rt => rt.UserId == userId && !rt.IsRevoked)
                        .ExecuteUpdateAsync(updates => updates.SetProperty(rt => rt.IsRevoked, true));
        }

        public async Task RevokeTokenAsync(string refreshTokenString)
        {
            var storedToken = await _context.RefreshTokens
            .SingleOrDefaultAsync(rt => rt.Token == refreshTokenString);

            if (storedToken == null || storedToken.IsRevoked)
                return;
            storedToken.IsRevoked = true;
            await _context.SaveChangesAsync();
        }
    }
}