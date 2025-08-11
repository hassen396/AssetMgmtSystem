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
                RequestDate = assetRequest.RequestDate,
                // Include asset and user details for UI display
                AssetName = assetRequest.Asset?.Name,
                AssetCategory = assetRequest.Asset?.Category,
                AssetStatus = assetRequest.Asset != null ? (int)assetRequest.Asset.Status : 0,
                UserName = assetRequest.User != null ? $"{assetRequest.User.FirstName} {assetRequest.User.LastName}" : null
            };
        }
    }
}