using AssetMgmtApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AssetMgmtApi.Data;
public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Asset> Assets { get; set; }
    public DbSet<AssetRequest> AssetRequests { get; set; }
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        var adminRoleId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var userRoleId = Guid.Parse("22222222-2222-2222-2222-222222222222");

        builder.Entity<IdentityRole<Guid>>().HasData(
            new IdentityRole<Guid>
            {
                Id = adminRoleId,
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole<Guid>
            {
                Id = userRoleId,
                Name = "User",
                NormalizedName = "USER"
            }
        );
    }

}