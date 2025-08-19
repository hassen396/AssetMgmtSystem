namespace AssetMgmtApi.DTOs.Asset
{
    public class AssetSummaryDto
    {
        public Guid Id { get; init; }
        public string Name { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string SerialNumber { get; set; } = null!;
        public DateTimeOffset PurchaseDate { get; set; }
        public int Status { get; set; }
        public string? ImageUrl { get; set; }
    }
}