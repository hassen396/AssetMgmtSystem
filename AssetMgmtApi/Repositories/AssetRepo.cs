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
            return await _context.Assets.AnyAsync(a => a.Id == id); ;
        }

        public async Task<Asset> CreatAssetAsync(Asset asset)
        {
            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
            return asset;
        }

        public async Task<Asset?> DeleteAssetAsync(Guid id)
        {
            var asset = await _context.Assets.FindAsync(id);
            _context.Assets.Remove(asset!);
            await _context.SaveChangesAsync();
            return asset;
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

        public async Task<Asset?> UpdateAssetAsync(Asset newAsset, Guid id)
        {
            var existingAsset = await _context.Assets.FirstOrDefaultAsync(a => a.Id == id);
            if (existingAsset == null)
            {
                return null;
            }

            existingAsset.Name = newAsset.Name;
            existingAsset.Category = newAsset.Category;
            existingAsset.PurchaseDate = newAsset.PurchaseDate;
            existingAsset.SerialNumber = newAsset.SerialNumber;
            existingAsset.Status = newAsset.Status;
            existingAsset.ImageUrl = newAsset.ImageUrl;

            await _context.SaveChangesAsync();
            return existingAsset;
        }
    }
}