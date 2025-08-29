using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AssetMgmtApi.DTOs.Auth;
using AssetMgmtApi.Interfaces;
using AssetMgmtApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace AssetMgmtApi.Services
{
    public class AuthService(IConfiguration configuration, IAuthRepo authRepo, UserManager<User> userManager)
        : IAuthService
    {
        public async Task<TokenRefreshResult> RefreshTokenAsync(string refreshTokenString)
        {
            var storedToken = await authRepo.GetRefreshTokenAsync(refreshTokenString);

            if (storedToken == null)
            {
                return new TokenRefreshResult { IsSuccess = false, ErrorMessage = "Invalid token." };
            }

            if (storedToken.Expires <= DateTime.UtcNow)
            {
                return new TokenRefreshResult { IsSuccess = false, ErrorMessage = "Token expired." };
            }

            if (storedToken.IsRevoked)
            {
                await authRepo.RevokeAllTokensForUserAsync(storedToken.UserId);
                return new TokenRefreshResult { IsSuccess = false, ErrorMessage = "Token compromised." };
            }

            var user = await userManager.FindByIdAsync(storedToken.UserId.ToString());
            if (user == null)
            {
                return new TokenRefreshResult { IsSuccess = false, ErrorMessage = "User not found." };
            }


            await authRepo.RevokeTokenAsync(refreshTokenString);

            var accessTokenObject = GenerateAccessToken(user); 
            var accessToken = new JwtSecurityTokenHandler().WriteToken(accessTokenObject);

            
            var newRefreshToken = await authRepo.AddRefreshTokenAsync(user.Id);

            return new TokenRefreshResult
            {
                IsSuccess = true,
                AccessToken = accessToken,
                NewRefreshToken = newRefreshToken
            };
        }


        
        public JwtSecurityToken GenerateAccessToken(User user)
        {
            var roles = userManager.GetRolesAsync(user).Result; 

            var claims = new List<Claim>
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email!),
        };

            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var accessToken = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );
            return accessToken;
        }
    }
}