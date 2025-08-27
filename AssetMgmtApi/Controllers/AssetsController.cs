using AssetMgmtApi.DTOs.Asset;
using AssetMgmtApi.Interfaces;
using AssetMgmtApi.Mappers;
using AssetMgmtApi.Models;
using AssetMgmtApi.Services;
using AssetMgmtApi.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetMgmtApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetsController(IAssetRepo assetRepo, IPhotoService photoService) : ControllerBase
    {
        [HttpGet("paginated-assets")]
        [Authorize]
        public async Task<IActionResult> GetAssets([FromQuery] AssetQueryObject assetQuery)
        {
            var assetsList = await assetRepo.GetAllAssetsAsync(assetQuery);
            if (assetsList == null)
                return NotFound("No asset is available");
            // var assetsDto = assets.Select(AssetExportMapper.MapToDto).ToList();
            return Ok(assetsList);
        }


        //TODO this method down below is added in the GetAssets method using filter,
        //update the frontend to use the filter instead

        [HttpGet("available-assets")]
        [Authorize]
        public async Task<IActionResult> GetAvailableAssets()
        {
            var query = new AssetQueryObject
            {
                Status = 0
            };
            var assetsList = await assetRepo.GetAllAssetsAsync(query);
            if (assetsList == null)
                return NotFound("No asset is available");

            // var availableAssets = assets.Where(a => a.Status == AssetStatus.Available);
            // var assetsDto = assets.Select(AssetExportMapper.MapToDto).ToList();
            return Ok(assetsList);
        }

        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> Get(Guid id)
        {
            var asset = await assetRepo.GetAssetByIdAsync(id);
            //map the domain asset to a respective dto
            if (asset == null) return NotFound("no asset was found with the specified id");
            var assetDto = AssetExportMapper.MapToDto(asset);
            return Ok(assetDto);
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromForm] CreateUpdateAssetDto requestDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var asset = DtoExportMapper.MapFromDto(requestDto);

            if (requestDto.Image is { Length: > 0 })
            {
                var uploadResult = await photoService.AddPhotoAsync(requestDto.Image);

                if (uploadResult.Error != null)
                    return BadRequest(uploadResult.Error.Message);

                asset.ImageUrl = uploadResult.SecureUrl.AbsoluteUri;

                asset.ImagePublicId = uploadResult.PublicId;
            }

            await assetRepo.CreatAssetAsync(asset);

            var createdAssetDto = AssetExportMapper.MapToDto(asset);

            return CreatedAtAction(nameof(Get), new { id = createdAssetDto.Id }, createdAssetDto);
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromForm] CreateUpdateAssetDto requestDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var asset = await assetRepo.GetAssetByIdAsync(id);
            if (asset == null)
                return NotFound("Asset not found.");

            // Update asset properties from DTO (except image)
            asset.Name = requestDto.Name;
            asset.Category = requestDto.Category;
            asset.SerialNumber = requestDto.SerialNumber;
            asset.PurchaseDate = requestDto.PurchaseDate.ToUniversalTime();
            asset.Status = (AssetStatus)requestDto.Status;
            // Add other fields as needed

            // Handle image upload if provided
            if (requestDto.Image is { Length: > 0 })
            {
                var uploadResult = await photoService.AddPhotoAsync(requestDto.Image);
                if (uploadResult.Error != null)
                    return BadRequest(uploadResult.Error.Message);
                if (asset.ImagePublicId != null)
                {
                    var deleteResult = await photoService.DeletePhotoAsync(asset.ImagePublicId);
                    if(deleteResult.Error != null)  return BadRequest(new { Message = deleteResult.Error }) ;
                }

                asset.ImageUrl = uploadResult.SecureUrl.AbsoluteUri;
                asset.ImagePublicId = uploadResult.PublicId;
            }

            var updatedAsset = await assetRepo.UpdateAssetAsync(asset, id);
            var updatedAssetDto = AssetExportMapper.MapToDto(updatedAsset!);
            return Ok(updatedAssetDto);
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var asset = await assetRepo.GetAssetByIdAsync(id);
            if (asset == null) return NotFound(new { Message = "Asset not not exist!" });
            if (asset.ImagePublicId != null)
            {
                await photoService.DeletePhotoAsync(asset.ImagePublicId);
            }
            
            await assetRepo.DeleteAssetAsync(id);
            
            return Ok(new { Message = "Deleted Successfully" });
        }
    }
}