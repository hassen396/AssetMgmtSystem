using System.ComponentModel.DataAnnotations;

namespace AssetMgmtApi.DTOs.Asset;

public class CreateUpdateAssetDto
{
    [Required]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "Name should not be empty or longer than 50 characters")]
    public string Name { get; set; } = null!;

    
    [Required]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "Category should not be empty or longer than 50 characters")]
    public string Category { get; set; } = null!;

    
    [StringLength(100, MinimumLength = 1,
        ErrorMessage = "SerialNumber should not be empty or longer than 100 characters")]
    public string SerialNumber { get; set; } = null!;

    public DateTimeOffset PurchaseDate { get; set; }
    [Range(0,1, ErrorMessage = "the Status should be Available or Assigned(0 or 1)")]
    public int Status { get; set; } = 0;
    public IFormFile? Image { get; set; }
}