using AssetMgmtApi.Models;

namespace AssetMgmtApi.DTOs.AssetRequest
{
    public class AssetRequestDto
    {
          public Guid Id { get; set; }
        public Guid UserId { get; set; } // Identity user id
        public Guid AssetId { get; set; }
        public RequestStatus Status { get; set; } = RequestStatus.Pending;
        public DateTimeOffset RequestDate { get; set; } = DateTimeOffset.UtcNow;
    }
}