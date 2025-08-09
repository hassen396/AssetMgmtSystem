using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AssetMgmtApi.Data;
using AssetMgmtApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetMgmtApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public AssetsController(ApplicationDbContext db) => _db = db;

        [HttpGet]
        // [Authorize]
        public async Task<IActionResult> GetAssets() => Ok(await _db.Assets.ToListAsync());

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(int id)
        {
            var asset = await _db.Assets.FindAsync(id);
            if (asset == null) return NotFound();
            return Ok(asset);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Asset asset)
        {
            _db.Assets.Add(asset);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = asset.Id }, asset);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, Asset model)
        {
            var asset = await _db.Assets.FindAsync(id);
            if (asset == null) return NotFound();
            asset.Name = model.Name;
            asset.Category = model.Category;
            asset.SerialNumber = model.SerialNumber;
            asset.PurchaseDate = model.PurchaseDate;
            asset.Status = model.Status;
            asset.ImageUrl = model.ImageUrl;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var asset = await _db.Assets.FindAsync(id);
            if (asset == null) return NotFound();
            _db.Assets.Remove(asset);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
