using AssetMgmtApi.Data;
using AssetMgmtApi.Interfaces;
using AssetMgmtApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetMgmtApi.Repositories
{
    public class AssetRepo(ApplicationDbContext context): IAssetRepo
    {
        public async Task<bool> AssetExistAsync(Guid id)
        {
            return await context.Assets.AnyAsync(a => a.Id == id);
        }

        public async Task<Asset> CreatAssetAsync(Asset asset)
        {
            context.Assets.Add(asset);
            await context.SaveChangesAsync();
            return asset;
        }

        public async Task<Asset?> DeleteAssetAsync(Guid id)
        {
            var asset = await context.Assets.FindAsync(id);
            context.Assets.Remove(asset!);
            await context.SaveChangesAsync();
            return asset;
        }

        public async Task<List<Asset>?> GetAllAssetsAsync()
        {
            return await context.Assets.ToListAsync();
        }

        public async Task<Asset?> GetAssetByIdAsync(Guid id)
        {
            var asset = await context.Assets.FindAsync(id);
            if (asset == null) return null;
            return asset;
        }

        public async Task<Asset?> UpdateAssetAsync(Asset newAsset, Guid id)
        {
            var existingAsset = await context.Assets.FirstOrDefaultAsync(a => a.Id == id);
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

            await context.SaveChangesAsync();
            return existingAsset;
        }
    }
}