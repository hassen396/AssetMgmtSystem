
using System;
using System.ComponentModel.DataAnnotations;

namespace AssetMgmtApi.Models
{
    public class Asset
    {
        public Guid Id { get; init; }
        
        
        [StringLength(50, MinimumLength = 1, ErrorMessage = "Name should not be empty or longer than 50 characters")] 
        public string Name { get; set; } = null!;
        
        
        [StringLength(50, MinimumLength = 1, ErrorMessage = "Category should not be empty or longer than 50 characters")]
        public string Category { get; set; } = null!;
        
        
        [StringLength(100, MinimumLength = 1, ErrorMessage = "SerialNumber should not be empty or longer than 100 characters")]
        public string SerialNumber { get; set; } = null!;
        
        
        public DateTimeOffset PurchaseDate { get; set; }
        
        public AssetStatus Status { get; set; } = AssetStatus.Available;
        
        [StringLength(200, ErrorMessage = "Description should not be empty or longer than 200 characters")]
        public string? ImageUrl { get; set; }
    }

    public enum AssetStatus
    {
        Available,
        Assigned
    }
}
