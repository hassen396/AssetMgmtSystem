using AssetMgmtApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AssetMgmtApi.Data
{
    public static class DataSeeder
    {
        // Predefined GUIDs for consistency
        private static readonly Guid AdminRoleId =Guid.NewGuid();
        private static readonly Guid UserRoleId = Guid.NewGuid();
        private static readonly Guid AdminUserId = Guid.NewGuid();
        private static readonly Guid NormalUserId = Guid.NewGuid();

        public static async Task SeedAsync(ApplicationDbContext context, RoleManager<IdentityRole<Guid>> roleManager, UserManager<User> userManager)
        {
            await SeedRolesAsync(roleManager);
            await SeedUsersAsync(userManager);
            await SeedAssetsAsync(context);
        }

        private static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
        {
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>("Admin") { Id = AdminRoleId });
            }

            if (!await roleManager.RoleExistsAsync("User"))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>("User") { Id = UserRoleId });
            }
        }

        private static async Task SeedUsersAsync(UserManager<User> userManager)
        {
            if (await userManager.FindByEmailAsync("admin@company.test") == null)
            {
                var adminUser = new User
                {
                    Id = AdminUserId,
                    FirstName = "System",
                    LastName = "Admin",
                    Email = "admin@company.test",
                    NormalizedEmail = "ADMIN@COMPANY.TEST",
                    UserName = "admin@company.test",
                    NormalizedUserName = "ADMIN@COMPANY.TEST",
                    EmailConfirmed = true,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                };

                var result = await userManager.CreateAsync(adminUser, "Admin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            if (await userManager.FindByEmailAsync("user@company.test") == null)
            {
                var normalUser = new User
                {
                    Id = NormalUserId,
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "user@company.test",
                    NormalizedEmail = "USER@COMPANY.TEST",
                    UserName = "user@company.test",
                    NormalizedUserName = "USER@COMPANY.TEST",
                    EmailConfirmed = true,
                    SecurityStamp = Guid.NewGuid().ToString("D"),
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                };

                var result = await userManager.CreateAsync(normalUser, "User123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(normalUser, "User");
                }
            }
        }

        private static async Task SeedAssetsAsync(ApplicationDbContext context)
        {
            if (!await context.Assets.AnyAsync())
            {
                var assets = new List<Asset>
                {
                    new Asset { Id = Guid.NewGuid(), Name = "Dell XPS 13", Category = "Laptop", SerialNumber = "DX13-001", PurchaseDate = new DateTime(2022, 1, 10), Status = AssetStatus.Available },
                    new Asset { Id = Guid.NewGuid(), Name = "MacBook Pro 14", Category = "Laptop", SerialNumber = "MBP14-002", PurchaseDate = new DateTime(2023, 3, 1), Status = AssetStatus.Available },
                    new Asset { Id = Guid.NewGuid(), Name = "iPhone 13", Category = "Phone", SerialNumber = "IPH13-003", PurchaseDate = new DateTime(2022, 6, 21), Status = AssetStatus.Available },
                    new Asset { Id = Guid.NewGuid(), Name = "Dell Monitor 24\"", Category = "Monitor", SerialNumber = "DM24-004", PurchaseDate = new DateTime(2021, 11, 30), Status = AssetStatus.Available },
                    new Asset { Id = Guid.NewGuid(), Name = "Logitech Mouse", Category = "Accessory", SerialNumber = "LM-005", PurchaseDate = new DateTime(2020, 5, 5), Status = AssetStatus.Available }
                };

                await context.Assets.AddRangeAsync(assets);
                await context.SaveChangesAsync();
            }
        }
    }
}