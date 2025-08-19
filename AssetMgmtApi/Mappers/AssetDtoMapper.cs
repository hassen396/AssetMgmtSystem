using AssetMgmtApi.DTOs;
using AssetMgmtApi.DTOs.Asset;
using AssetMgmtApi.Models;

namespace AssetMgmtApi.Mappers
{
    public abstract class AssetExportMapper
    {

        public static AssetSummaryDto MapToDto(Asset asset)
        {
            return new AssetSummaryDto
            {
                Id = asset.Id,
                Name = asset.Name,
                Category = asset.Category,
                SerialNumber = asset.SerialNumber,
                PurchaseDate = asset.PurchaseDate,
                Status = (int)asset.Status,
                ImageUrl = asset.ImageUrl
            };
        }
    }
    public class DtoExportMapper
    {
        public static Asset MapFromDto(CreateUpdateAssetDto createUpdateDto)
        {
            return new Asset
            {
                Name = createUpdateDto.Name,
                Category = createUpdateDto.Category,
                SerialNumber = createUpdateDto.SerialNumber,
                PurchaseDate = createUpdateDto.PurchaseDate.ToUniversalTime(),
                Status = (AssetStatus)createUpdateDto.Status,
                // ImageUrl = createUpdateDto.ImageUrl
            };
        }
        
    }
}