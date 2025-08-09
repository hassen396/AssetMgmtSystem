using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AssetMgmtApi.Interfaces;
using AssetMgmtApi.Mappers;
using AssetMgmtApi.DTOs;

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

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(Guid id)
        {
            var asset = await _assetRepo.GetAssetByIdAsync(id);
            //map the dommai asset to a respective dto
            if (asset == null) return NotFound("no asset was found with the specified id");
            var assetDto = AssetExportMapper.MapToDto(asset);
            return Ok(assetDto);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateUpdateAssetDto createAssetDto)
        {
            // if()
            //map from the dto to the domain
            var asset = DtoExportMapper.MapFromDto(createAssetDto);
            var savedAsset = await _assetRepo.CreatAssetAsync(asset);
            var assetDto = AssetExportMapper.MapToDto(asset);
            return CreatedAtAction(nameof(Get), new { id = assetDto.Id }, createAssetDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, CreateUpdateAssetDto createAssetDto)
        {
            //check if it exists in the database
            var assetExists = await _assetRepo.AssetExistAsync(id);
            if (!assetExists)
            {
                return BadRequest("There is no asset with this id");
            }

            if (createAssetDto == null)
                return BadRequest("please fill the form");

                //map to Asset
            var asset = DtoExportMapper.MapFromDto(createAssetDto);
            var updatedAsset = await _assetRepo.UpdateAssetAsync(asset, id);
            var updatedAssetDto = AssetExportMapper.MapToDto(updatedAsset!);
            return Ok(updatedAssetDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var assetExists = await _assetRepo.AssetExistAsync(id);
            if (!assetExists) return NotFound(new { Message = "Asset not not exist!" });
            await _assetRepo.DeleteAssetAsync(id);
            return NotFound(new { Message = "Deleted Succussfully" });
        }
    }
}
