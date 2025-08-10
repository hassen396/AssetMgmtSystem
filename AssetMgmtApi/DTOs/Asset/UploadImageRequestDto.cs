public class UploadImageRequestDto
{
    // The asset ID will be sent as a form field
    public Guid Id { get; set; }

    // The image file
    public IFormFile? Image { get; set; }
}