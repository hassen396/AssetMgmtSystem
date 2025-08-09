using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AssetMgmtApi.Data;
using AssetMgmtApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace AssetMgmtApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public RequestsController(ApplicationDbContext db) => _db = db;

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll() => Ok(await _db.AssetRequests.Include(r => r.Asset).ToListAsync());

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateRequestDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (userId == null) return Unauthorized();

            var asset = await _db.Assets.FindAsync(dto.AssetId);
            if (asset == null || asset.Status != AssetStatus.Available) return BadRequest("Asset not available");

            var request = new AssetRequest
            {
                UserId = userId,
                AssetId = dto.AssetId,
                Status = RequestStatus.Pending
            };

            _db.AssetRequests.Add(request);
            await _db.SaveChangesAsync();
            return Ok(request);
        }

        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Approve(Guid id)
        {
            var req = await _db.AssetRequests.Include(r => r.Asset).FirstOrDefaultAsync(r => r.Id == id);
            if (req == null) return NotFound();
            if (req.Status != RequestStatus.Pending) return BadRequest("Already processed");

            // set request approved & asset assigned
            req.Status = RequestStatus.Approved;
            if (req.Asset != null) req.Asset.Status = AssetStatus.Assigned;
            await _db.SaveChangesAsync();
            return Ok(req);
        }

        [HttpPost("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Reject(int id)
        {
            var req = await _db.AssetRequests.FindAsync(id);
            if (req == null) return NotFound();
            if (req.Status != RequestStatus.Pending) return BadRequest("Already processed");
            req.Status = RequestStatus.Rejected;
            await _db.SaveChangesAsync();
            return Ok(req);
        }
    }

    public class CreateRequestDto
    {
        public int AssetId { get; set; }
    }
}
