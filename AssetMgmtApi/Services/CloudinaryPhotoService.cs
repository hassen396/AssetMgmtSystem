using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using AssetMgmtApi.Services;

namespace AssetMgmtApi.Services;
public class CloudinaryPhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;

    // Use IOptions to inject the settings from appsettings.json
    public CloudinaryPhotoService(IOptions<CloudinarySettings> config)
    {
        var account = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );
        _cloudinary = new Cloudinary(account);
    }

    public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();

        if (file.Length > 0)
        {
            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                // Optional: Apply transformations, e.g., resize to a square
                Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("center") 
            };
            
            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }

        return uploadResult;
    }

    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
            DeletionResult result = await  _cloudinary.DestroyAsync(deleteParams);
            return result;
    }
}

// Helper class to map the settings
public class CloudinarySettings
{
    public string CloudName { get; set; }
    public string ApiKey { get; set; }
    public string ApiSecret { get; set; }
}