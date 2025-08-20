using AssetMgmtApi.Data;
using AssetMgmtApi.Interfaces;
using AssetMgmtApi.Models;
using AssetMgmtApi.Utils;
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

        public async Task<PagedList<Asset>?> GetAllAssetsAsync(AssetQueryObject  assetQuery)
        {
            var assetsQuery = context.Assets.AsQueryable();
            if (!string.IsNullOrWhiteSpace(assetQuery.Name))
            {
                var lowerCaseAssetName = assetQuery.Name.ToLower();
                assetsQuery = assetsQuery.Where(a => a.Name.ToLower().Contains(lowerCaseAssetName));
            }

            if (!string.IsNullOrWhiteSpace(assetQuery.Category))
            {
                var lowerCaseAssetCategory = assetQuery.Category.ToLower();
                assetsQuery = assetsQuery.Where(a => a.Category.ToLower().Contains(lowerCaseAssetCategory));
            }

            if (assetQuery.Status.HasValue )
            {
                assetsQuery = assetsQuery.Where(a => a.Status == assetQuery.Status.Value);
            }
            
            //pagination goes here
            var totalCount = await assetsQuery.CountAsync();
            var pagedAssets = await assetsQuery
                .Skip((assetQuery.PageNumber - 1) * assetQuery.PageSize)
                .Take(assetQuery.PageSize)
                .ToListAsync();
            return  new PagedList<Asset>(pagedAssets, totalCount, assetQuery.PageNumber, assetQuery.PageSize);
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