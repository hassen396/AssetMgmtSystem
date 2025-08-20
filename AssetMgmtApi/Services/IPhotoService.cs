using CloudinaryDotNet.Actions;

namespace AssetMgmtApi.Services;
public interface IPhotoService
{
    // This will return the details of the uploaded image from Cloudinary
    Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
    
    // You might also want a deletion method later
    Task<DeletionResult> DeletePhotoAsync(string publicId);
}