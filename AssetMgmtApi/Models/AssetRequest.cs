using System;

namespace AssetMgmtApi.Models
{
    public class AssetRequest
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = null!; // Identity user id
        public int AssetId { get; set; }
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
