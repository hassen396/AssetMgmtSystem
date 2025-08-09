using AssetMgmtApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace AssetMgmtApi.Data
{
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

            // Fixed IDs for seeding
            var adminRoleId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var userRoleId = Guid.Parse("22222222-2222-2222-2222-222222222222");
            var adminUserId = Guid.Parse("33333333-3333-3333-3333-333333333333");
            var normalUserId = Guid.Parse("44444444-4444-4444-4444-444444444444");

            // Seed roles
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

            // // Password hasher
            // var hasher = new PasswordHasher<User>();

            // // Seed admin user
            // var adminUser = new User
            // {
            //     Id = adminUserId,
            //     FirstName = "System",
            //     LastName = "Admin",
            //     Email = "admin@company.test",
            //     NormalizedEmail = "ADMIN@COMPANY.TEST",
            //     UserName = "admin@company.test",
            //     NormalizedUserName = "ADMIN@COMPANY.TEST",
            //     EmailConfirmed = true,
            //     SecurityStamp = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb").ToString("D"),
            //     ConcurrencyStamp = "cccccccc-cccc-cccc-cccc-cccccccccccc"
            // };
            // adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin123!");

            // // Seed normal user
            // var normalUser = new User
            // {
            //     Id = normalUserId,
            //     FirstName = "John",
            //     LastName = "Doe",
            //     Email = "user@company.test",
            //     NormalizedEmail = "USER@COMPANY.TEST",
            //     UserName = "user@company.test",
            //     NormalizedUserName = "USER@COMPANY.TEST",
            //     EmailConfirmed = true,
            //     SecurityStamp = Guid.Parse("aaaaaaaa-bbbb-bbbb-bbbb-bbbbbbbbbbbb").ToString("D"),
            //     ConcurrencyStamp = "dddddddd-dddd-dddd-dddd-dddddddddddd"
            // };
            // normalUser.PasswordHash = hasher.HashPassword(normalUser, "User123!");

            // builder.Entity<User>().HasData(adminUser, normalUser);

            // // Assign roles to users
            // builder.Entity<IdentityUserRole<Guid>>().HasData(
            //     new IdentityUserRole<Guid>
            //     {
            //         RoleId = adminRoleId,
            //         UserId = adminUserId
            //     },
            //     new IdentityUserRole<Guid>
            //     {
            //         RoleId = userRoleId,
            //         UserId = normalUserId
            //     }
            // );

        //     builder.Entity<Asset>().HasData(
        //        new Asset { Id = 1, Name = "Dell XPS 13", Category = "Laptop", SerialNumber = "DX13-001", PurchaseDate = new DateTime(2022, 1, 10), Status = AssetStatus.Available },
        //        new Asset { Id = 2, Name = "MacBook Pro 14", Category = "Laptop", SerialNumber = "MBP14-002", PurchaseDate = new DateTime(2023, 3, 1), Status = AssetStatus.Available },
        //        new Asset { Id = 3, Name = "iPhone 13", Category = "Phone", SerialNumber = "IPH13-003", PurchaseDate = new DateTime(2022, 6, 21), Status = AssetStatus.Available },
        //        new Asset { Id = 4, Name = "Dell Monitor 24\"", Category = "Monitor", SerialNumber = "DM24-004", PurchaseDate = new DateTime(2021, 11, 30), Status = AssetStatus.Available },
        //        new Asset { Id = 5, Name = "Logitech Mouse", Category = "Accessory", SerialNumber = "LM-005", PurchaseDate = new DateTime(2020, 5, 5), Status = AssetStatus.Available }
        //    );
        }

    }
}