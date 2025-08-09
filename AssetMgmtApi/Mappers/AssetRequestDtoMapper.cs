using AssetMgmtApi.DTOs;
using AssetMgmtApi.Models;

namespace AssetMgmtApi.Mappers
{
    public class AssetRequestExportMapper
    {
        public static AssetRequestSummaryDto MapToDto(AssetRequest assetRequest)
        {
            return new AssetRequestSummaryDto
            {
                Id = assetRequest.Id,
                UserId = assetRequest.UserId,
                AssetId = assetRequest.AssetId,
                Status = assetRequest.Status,
                RequestDate = assetRequest.RequestDate
            };
        }
    }
}