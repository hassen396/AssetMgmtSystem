using AssetMgmtApi.Models;

namespace AssetMgmtApi.DTOs
{
    public class AssetRequestSummaryDto
    {
         public Guid Id { get; set; }
        public Guid UserId { get; set; } // Identity user id
        public Guid AssetId { get; set; }
        public RequestStatus Status { get; set; } = RequestStatus.Pending;
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;

    }
}