using AssetMgmtApi.Models;
using AssetMgmtApi.Utils;

namespace AssetMgmtApi.Interfaces
{
    public interface IAssetRepo
    {
        Task<PagedList<Asset>?> GetAllAssetsAsync(AssetQueryObject assetQuery);
        Task<Asset?> GetAssetByIdAsync(Guid id);
        Task<Asset> CreatAssetAsync(Asset asset);
        Task<Asset?> UpdateAssetAsync(Asset newAsset, Guid id);
        Task<bool> AssetExistAsync(Guid id);
        Task<Asset?> DeleteAssetAsync(Guid id);
    }
}