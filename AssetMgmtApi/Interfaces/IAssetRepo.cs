using AssetMgmtApi.Models;

namespace AssetMgmtApi.Interfaces
{
    public interface IAssetRepo
    {
        Task<List<Asset>?> GetAllAssetsAsync();
        Task<Asset?> GetAssetByIdAsync(Guid id);
        Task<Asset> CreatAssetAsync(Asset asset);
        Task<Asset?> UpdateAssetAsync(Asset asset);
        Task<bool> AssetExistAsync(Guid id);
        Task DeleteAssetAsync(Guid id);
    }
}