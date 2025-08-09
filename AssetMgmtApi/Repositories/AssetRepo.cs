using AssetMgmtApi.Data;
using AssetMgmtApi.Interfaces;
using AssetMgmtApi.Mappers;
using AssetMgmtApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetMgmtApi.Repositories
{
    public class AssetRepo : IAssetRepo
    {
        private readonly ApplicationDbContext _context;

        public AssetRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AssetExistAsync(Guid id)
        {
            var asset = await _context.Assets.FindAsync(id);
            return asset != null;
        }

        public async Task<Asset> CreatAssetAsync(Asset asset)
        {
            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
            return asset;
        }

        public async Task DeleteAssetAsync(Guid id)
        {
             var asset = await _context.Assets.FindAsync(id);
            if (asset == null) return NotFound();
            _db.Assets.Remove(asset);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Asset>?> GetAllAssetsAsync()
        {
            return await _context.Assets.ToListAsync();
        }

        public async Task<Asset?> GetAssetByIdAsync(Guid id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null) return null;
            return asset; 
        }

        public async Task<Asset?> UpdateAssetAsync(Asset newAsset)
        {
            _context.Update(newAsset);
            await _context.SaveChangesAsync();
            return newAsset;

        }
    }
}