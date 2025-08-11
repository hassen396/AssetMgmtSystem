using AssetMgmtApi.Data;
using AssetMgmtApi.DTOs;
using AssetMgmtApi.Interfaces;
using AssetMgmtApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetMgmtApi.Repositories
{
    public class RequestRepo : IRequestRepo
    {
        private readonly ApplicationDbContext _context;

        public RequestRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AssetRequest?> CreateAsync(CreateRequestDto dto, Guid userId)
        {
            var request = new AssetRequest
            {
                UserId = userId,
                AssetId = dto.AssetId,
                Status = RequestStatus.Pending
            };

            _context.AssetRequests.Add(request);
            await _context.SaveChangesAsync();
            return await _context.AssetRequests.FindAsync(request.Id);// i gotta make sure id here!
        }

        public async Task<List<AssetRequest>?> GetAllAsync()
        {
            return await _context.AssetRequests
                .Include(r => r.Asset)
                .Include(r => r.User)
                .OrderByDescending(r => r.RequestDate)
                .ToListAsync();
        }

        public async Task<AssetRequest?> GetAssetRequestAsync(Guid id)
        {
            return await _context.AssetRequests
                .Include(r => r.Asset)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);
        }
    }
}