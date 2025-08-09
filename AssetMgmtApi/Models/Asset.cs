
using System;

namespace AssetMgmtApi.Models
{
    public class Asset
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string SerialNumber { get; set; } = null!;
        public DateTime PurchaseDate { get; set; }
        public AssetStatus Status { get; set; } = AssetStatus.Available;
        public string? ImageUrl { get; set; } // optional
    }

    public enum AssetStatus
    {
        Available,
        Assigned
    }
}
