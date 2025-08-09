using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AssetMgmtApi.Data;
using AssetMgmtApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using AssetMgmtApi.Interfaces;
using AssetMgmtApi.DTOs;
using AssetMgmtApi.Mappers;

namespace AssetMgmtApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IRequestRepo _requestRepo;
        private readonly IAssetRepo _assetRepo;


        public RequestsController(ApplicationDbContext context, IRequestRepo requestRepo, IAssetRepo assetRepo)
        {
            _requestRepo = requestRepo;
            _context = context;
            _assetRepo = assetRepo;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var assetRequests = await _requestRepo.GetAllAsync();
            if (assetRequests == null) return NotFound(new { Message = "there is no request" });
            var assetrRequestsDto = assetRequests.Select(AssetRequestExportMapper.MapToDto).ToList();
            return Ok(assetrRequestsDto);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateRequestDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (userId == null) return Unauthorized();

            var asset = await _assetRepo.GetAssetByIdAsync(dto.AssetId);
            // await _db.Assets.FindAsync(dto.AssetId);
            if (asset == null || asset.Status == AssetStatus.Assigned) return BadRequest("Asset not available");

            var request = await _requestRepo.CreateAsync(dto, Guid.Parse(userId));
            return Ok(request);
        }

        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Approve(Guid id)
        {
            var req = await _context.AssetRequests.Include(r => r.Asset).FirstOrDefaultAsync(r => r.Id == id);
            if (req == null) return NotFound();
            if (req.Status != RequestStatus.Pending) return BadRequest("Already processed");

            // set request approved & asset assigned
            req.Status = RequestStatus.Approved;
            if (req.Asset != null) req.Asset.Status = AssetStatus.Assigned;
            await _context.SaveChangesAsync();
            return Ok(req);
        }

        [HttpPost("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Reject(Guid id)
        {
            var req = await _context.AssetRequests.FindAsync(id);
            if (req == null) return NotFound();
            if (req.Status != RequestStatus.Pending) return BadRequest("Already processed");
            req.Status = RequestStatus.Rejected;
            await _context.SaveChangesAsync();
            return Ok(req);
        }
    }


}
