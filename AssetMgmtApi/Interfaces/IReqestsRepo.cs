using AssetMgmtApi.DTOs;
using AssetMgmtApi.DTOs.AssetRequest;
using AssetMgmtApi.Models;
using AssetMgmtApi.Utils;

namespace AssetMgmtApi.Interfaces
{
    public interface IRequestRepo
    {
        Task<PagedList<AssetRequest>?> GetAllRequestsAsync(RequestQueryObject query);
        Task<AssetRequest?> CreateAsync(CreateRequestDto dto, Guid userId);
        Task<AssetRequest?> GetAssetRequestAsync(Guid id);
    }
}