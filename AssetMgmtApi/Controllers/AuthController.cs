using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AssetMgmtApi.DTOs;
using AssetMgmtApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AssetMgmtApi.Interfaces;

namespace AssetMgmtApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        // private readonly IConfiguration _configuration;
        private readonly IAuthRepo _authRepo;
        private readonly IAuthService _authService;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;

        public AuthController(
            UserManager<User> userManager,
            IAuthRepo authRepo,
            IAuthService authService,
            RoleManager<IdentityRole<Guid>> roleManager)
        {
            _userManager = userManager;
            _authRepo = authRepo;
            _authService = authService;
            _roleManager = roleManager;

        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var user = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                UserName = registerDto.Email,
            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            if (!await _userManager.IsInRoleAsync(user, registerDto.Role))
            {
                var roleExists = await _roleManager.RoleExistsAsync(registerDto.Role);
                if (!roleExists)
                    return BadRequest(new { message = $"Role '{registerDto.Role}' does not exist." });
            }

            await _userManager.AddToRoleAsync(user, registerDto.Role);

            return Ok("user created successfully");
        }
        [Authorize(Roles = "User")]
        [HttpGet("test-with-User-role")]
        public IActionResult TestUerRole()
        {
            return Ok("User role able to access User tole protected end point");
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                return Unauthorized();
            }

            var accessToken = _authService.GenerateAccessToken(user);
            var refreshToken = await CreateAndStoreRefreshToken(user.Id);

            SetRefreshTokenCookie(refreshToken);

            return Ok(new { accessToken = new JwtSecurityTokenHandler().WriteToken(accessToken) });
        }


        private async Task<RefreshToken> CreateAndStoreRefreshToken(Guid userId)
        {
            await _authRepo.GetExpiredRefreshTokensAsync(userId);

            var refreshToken = await _authRepo.AddRefreshTokenAsync(userId);
            SetRefreshTokenCookie(refreshToken);
            return refreshToken;
        }


        private void SetRefreshTokenCookie(RefreshToken refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = refreshToken.Expires,
                Path = "/"
            };
            Response.Cookies.Append("X-Refresh-Token", refreshToken.Token, cookieOptions);
        }




        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var roles = await _userManager.GetRolesAsync(user);
            // Ensure role is returned with correct case
            var role = roles.FirstOrDefault() ?? "";
            // Log the role for debugging
            Console.WriteLine($"User role: {role}");

            // Create a proper anonymous object with both Role and role properties
            var responseObj = new
            {
                user.FirstName,
                user.LastName,
                user.Email,
                Role = role
            };
            
            return Ok(responseObj);
        }


        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshTokenString = Request.Cookies["X-Refresh-Token"];

            if (string.IsNullOrEmpty(refreshTokenString))
                return Unauthorized(new { Message = "Missing refresh token." });

            var result = await _authService.RefreshTokenAsync(refreshTokenString);

            if (!result.IsSuccess)
            {
                return Unauthorized(new { message = result.ErrorMessage });
            }
            SetRefreshTokenCookie(result.NewRefreshToken!);
            return Ok(new { accessToken = result.AccessToken });
        }




        [Authorize]
        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok("This is a test endpoint for authenticated users.");
        }




        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var refreshTokenString = Request.Cookies["X-Refresh-Token"];
            if (string.IsNullOrEmpty(refreshTokenString))
                return BadRequest("no refresh token to invalidate");

            var storedToken = await _authRepo.GetRefreshTokenAsync(refreshTokenString);
            if (storedToken != null)
            {
                await _authRepo.RevokeTokenAsync(refreshTokenString);
            }

            Response.Cookies.Delete("X-Refresh-Token");

            return Ok(new { message = "Logout successfully" });
        }

    }
}
