using System;
using System.Text.Json.Serialization;

namespace AssetMgmtApi.Models
{
    public class AssetRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; } // Identity user id
        public Guid AssetId { get; set; }
        public RequestStatus Status { get; set; } = RequestStatus.Pending;
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public Asset? Asset { get; set; }
        [JsonIgnore]
        public User? User { get; set; }
    }

    public enum RequestStatus
    {
        Pending,
        Approved,
        Rejected
    }
}
