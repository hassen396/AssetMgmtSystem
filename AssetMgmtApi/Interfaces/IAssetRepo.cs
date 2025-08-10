using AssetMgmtApi.Models;

namespace AssetMgmtApi.Interfaces
{
    public interface IAssetRepo
    {
        Task<List<Asset>?> GetAllAssetsAsync();
        Task<Asset?> GetAssetByIdAsync(Guid id);
        Task<Asset> CreatAssetAsync(Asset asset);
        Task<Asset?> UpdateAssetAsync(Asset newAsset, Guid id);
        Task<bool> AssetExistAsync(Guid id);
        Task<Asset?> DeleteAssetAsync(Guid id);
    }
}