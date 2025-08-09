using AssetMgmtApi.DTOs;
using AssetMgmtApi.Models;

namespace AssetMgmtApi.Mappers
{
    public class AssetExportMapper
    {
        // Methods for Asset <-> DTO conversions
        public static AssetSummaryDto MapToDto(Asset asset)
        {
            return new AssetSummaryDto
            {
                Id = asset.Id,
                Name = asset.Name,
                Category = asset.Category,
                SerialNumber = asset.SerialNumber,
                PurchaseDate = asset.PurchaseDate,
                Status = asset.Status,
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
                PurchaseDate = createUpdateDto.PurchaseDate,
                Status = createUpdateDto.Status,
                ImageUrl = createUpdateDto.ImageUrl
            };
        }
        
    }
}