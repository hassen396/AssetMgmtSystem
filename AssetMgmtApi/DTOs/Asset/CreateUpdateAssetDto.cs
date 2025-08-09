using AssetMgmtApi.Models;

namespace AssetMgmtApi.DTOs
{
    public class CreateUpdateAssetDto
    {
        public string Name { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string SerialNumber { get; set; } = null!;
        public DateTime PurchaseDate { get; set; }
        public AssetStatus Status { get; set; } = AssetStatus.Available;
        public string? ImageUrl { get; set; }
    }
}