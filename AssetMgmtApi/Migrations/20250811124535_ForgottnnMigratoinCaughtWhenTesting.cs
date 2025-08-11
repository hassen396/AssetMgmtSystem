using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AssetMgmtApi.Migrations
{
    /// <inheritdoc />
    public partial class ForgottnnMigratoinCaughtWhenTesting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AssetRequests_UserId",
                table: "AssetRequests",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AssetRequests_AspNetUsers_UserId",
                table: "AssetRequests",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AssetRequests_AspNetUsers_UserId",
                table: "AssetRequests");

            migrationBuilder.DropIndex(
                name: "IX_AssetRequests_UserId",
                table: "AssetRequests");
        }
    }
}
