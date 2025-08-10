using AssetMgmtApi.DTOs;
using AssetMgmtApi.Models;

namespace AssetMgmtApi.Interfaces
{
    public interface IRequestRepo
    {
        Task<List<AssetRequest>?> GetAllAsync();
        Task<AssetRequest?> CreateAsync(CreateRequestDto dto, Guid userId);
        Task<AssetRequest?> GetAssetRequestAsync(Guid id);
    }
}