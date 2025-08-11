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
                UserName = assetRequest.User?.FirstName + " " + assetRequest.User?.LastName, // Or assetRequest.User?.UserName depending on your property
                AssetName = assetRequest.Asset?.Name,
                AssetStatus = assetRequest.Asset != null ? (int)assetRequest.Asset.Status : 0,
            };
        }
    }
}