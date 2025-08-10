using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AssetMgmtApi.Interfaces;
using AssetMgmtApi.Mappers;
using AssetMgmtApi.DTOs;
using Microsoft.AspNetCore.Http;
using System.IO;
using AssetMgmtApi.Models;

namespace AssetMgmtApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly IAssetRepo _assetRepo;
        public AssetsController(IAssetRepo assetRepo)
        {
            _assetRepo = assetRepo;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAssets()
        {
            var assets = await _assetRepo.GetAllAssetsAsync();
            if (assets == null)
                return NotFound("No asset is available");
            var assetsDto = assets.Select(AssetExportMapper.MapToDto).ToList();
            return Ok(assetsDto);
        }

        [HttpGet("available")]
        [Authorize]
        public async Task<IActionResult> GetAvailableAssets()
        {
            var assets = await _assetRepo.GetAllAssetsAsync();
            if (assets == null)
                return NotFound("No asset is available");
            
            var availableAssets = assets.Where(a => a.Status == AssetMgmtApi.Models.AssetStatus.Available);
            var assetsDto = availableAssets.Select(AssetExportMapper.MapToDto).ToList();
            return Ok(assetsDto);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(Guid id)
        {
            var asset = await _assetRepo.GetAssetByIdAsync(id);
            //map the domain asset to a respective dto
            if (asset == null) return NotFound("no asset was found with the specified id");
            var assetDto = AssetExportMapper.MapToDto(asset);
            return Ok(assetDto);
        }

        // [HttpPost]
        // [Authorize(Roles = "Admin")]
        // public async Task<IActionResult> Create([FromBody] CreateUpdateAssetDto createAssetDto)
        // {
        //     // if()
        //     //map from the dto to the domain
        //     var asset = DtoExportMapper.MapFromDto(createAssetDto);
        //     var savedAsset = await _assetRepo.CreatAssetAsync(asset);
        //     var assetDto = AssetExportMapper.MapToDto(asset);
        //     return CreatedAtAction(nameof(Get), new { id = assetDto.Id }, createAssetDto);
        // }

        // [HttpPut("{id}")]
        // [Authorize(Roles = "Admin")]
        // public async Task<IActionResult> Update(Guid id, CreateUpdateAssetDto createAssetDto)
        // {
        //     //check if it exists in the database
        //     var assetExists = await _assetRepo.AssetExistAsync(id);
        //     if (!assetExists)
        //     {
        //         return BadRequest("There is no asset with this id");
        //     }

        //     if (createAssetDto == null)
        //         return BadRequest("please fill the form");

        //         //map to Asset
        //     var asset = DtoExportMapper.MapFromDto(createAssetDto);
        //     var updatedAsset = await _assetRepo.UpdateAssetAsync(asset, id);
        //     var updatedAssetDto = AssetExportMapper.MapToDto(updatedAsset!);
        //     return Ok(updatedAssetDto);
        // }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromForm] CreateUpdateAssetDto requestDto)
        {
            
            var asset = DtoExportMapper.MapFromDto(requestDto);

            if (requestDto.Image != null && requestDto.Image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(requestDto.Image.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await requestDto.Image.CopyToAsync(stream);
                }

                asset.ImageUrl = $"/images/{fileName}";
            }

            await _assetRepo.CreatAssetAsync(asset);

            var createdAssetDto = AssetExportMapper.MapToDto(asset);

            return CreatedAtAction(nameof(Get), new { id = createdAssetDto.Id }, createdAssetDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var assetExists = await _assetRepo.AssetExistAsync(id);
            if (!assetExists) return NotFound(new { Message = "Asset not not exist!" });
            await _assetRepo.DeleteAssetAsync(id);
            return Ok(new { Message = "Deleted Succussfully" });
        }

        //     [HttpPost("upload-image")]
        //     [Authorize(Roles = "Admin")]
        //     public async Task<IActionResult> UploadImage([FromForm] UploadImageRequestDto request)
        //     {
        //         if (request.Image == null || request.Image.Length == 0)
        //             return BadRequest("No image file provided.");

        //         var asset = await _assetRepo.GetAssetByIdAsync(request.Id);
        //         if (asset == null)
        //             return NotFound("Asset not found.");

        //         var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
        //         if (!Directory.Exists(uploadsFolder))
        //             Directory.CreateDirectory(uploadsFolder);

        //         var fileName = $"{Guid.NewGuid()}{Path.GetExtension(request.Image.FileName)}";
        //         var filePath = Path.Combine(uploadsFolder, fileName);

        //         using (var stream = new FileStream(filePath, FileMode.Create))
        //         {
        //             await request.Image.CopyToAsync(stream);
        //         }

        //         var imageUrl = $"/images/{fileName}";
        //         asset.ImageUrl = imageUrl;

        //         await _assetRepo.UpdateAssetAsync(asset, request.Id);

        //         return Ok(new { ImageUrl = imageUrl });
        //     }
    }
}
