using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AssetMgmtApi.DTOs;
using AssetMgmtApi.Interfaces;
using AssetMgmtApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace AssetMgmtApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthRepo _authRepo;
        private readonly UserManager<User> _userManager;
        public AuthService(IConfiguration configuration, IAuthRepo authRepo, UserManager<User> userManager)
        {
            _configuration = configuration;
            _authRepo = authRepo;
             _userManager = userManager;
        }


        public async Task<TokenRefreshResult> RefreshTokenAsync(string refreshTokenString)
        {
            var storedToken = await _authRepo.GetRefreshTokenAsync(refreshTokenString);

            // Case 1: Token does not exist.
            if (storedToken == null)
            {
                return new TokenRefreshResult { IsSuccess = false, ErrorMessage = "Invalid token." };
            }

            // Case 2: Token has expired.
            if (storedToken.Expires <= DateTime.UtcNow)
            {
                return new TokenRefreshResult { IsSuccess = false, ErrorMessage = "Token expired." };
            }

            // Case 3 (SECURITY): Token has already been used/revoked.
            // This indicates a potential token theft. Invalidate all of the user's tokens.
            if (storedToken.IsRevoked)
            {
                await _authRepo.RevokeAllTokensForUserAsync(storedToken.UserId);
                return new TokenRefreshResult { IsSuccess = false, ErrorMessage = "Token compromised." };
            }

            var user = await _userManager.FindByIdAsync(storedToken.UserId.ToString());
            if (user == null)
            {
                return new TokenRefreshResult { IsSuccess = false, ErrorMessage = "User not found." };
            }

            // --- If all checks pass, proceed with token rotation ---

            // 1. Revoke the OLD token. MUST be awaited to prevent race conditions.
            await _authRepo.RevokeTokenAsync(refreshTokenString);

            // 2. Issue a NEW access token.
            var accessTokenObject = GenerateAccessToken(user); // Your existing generation logic
            var accessToken = new JwtSecurityTokenHandler().WriteToken(accessTokenObject);

            // 3. Issue and store a NEW refresh token.
            var newRefreshToken = await _authRepo.AddRefreshTokenAsync(user.Id);

            return new TokenRefreshResult
            {
                IsSuccess = true,
                AccessToken = accessToken,
                NewRefreshToken = newRefreshToken
            };
        }


        //generate a access token
        public JwtSecurityToken GenerateAccessToken(User user)
        {

            var claims = new[]
            {
            // new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email!),
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var accessToken = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );
            return accessToken;
            // return Ok(new { accessToken = new JwtSecurityTokenHandler().WriteToken(accessToken) });

        }
    }
}