using AssetMgmtApi.Models;

namespace AssetMgmtApi.DTOs
{
    public class AssetSummaryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string SerialNumber { get; set; } = null!;
        public DateTime PurchaseDate { get; set; }
        public int Status { get; set; } = 0; // i should use 0 = Available, 1 = Assigned
        public string? ImageUrl { get; set; }
    }
}