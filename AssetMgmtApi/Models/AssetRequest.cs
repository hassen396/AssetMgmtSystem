using System;

namespace AssetMgmtApi.Models
{
    public class AssetRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; } // Identity user id
        public Guid AssetId { get; set; }
        public RequestStatus Status { get; set; } = RequestStatus.Pending;
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;

        public Asset? Asset { get; set; }
    }

    public enum RequestStatus
    {
        Pending,
        Approved,
        Rejected
    }
}
