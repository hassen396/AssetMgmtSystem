using System;
using System.Text.Json.Serialization;

namespace AssetMgmtApi.Models
{
    public class AssetRequest
    {
        public Guid Id { get; init; }
        public Guid UserId { get; init; } 
        public Guid AssetId { get; init; }
        public RequestStatus Status { get; set; } = RequestStatus.Pending;
        public DateTimeOffset RequestDate { get; set; } = DateTimeOffset.UtcNow;

        [JsonIgnore]
        public Asset? Asset { get; init; }
        [JsonIgnore]
        public User? User { get; init; }
    }

    public enum RequestStatus
    {
        Pending,
        Approved,
        Rejected
    }
}
