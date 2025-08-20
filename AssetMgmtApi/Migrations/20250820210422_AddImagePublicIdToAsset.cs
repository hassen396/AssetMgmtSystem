using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AssetMgmtApi.Migrations
{
    /// <inheritdoc />
    public partial class AddImagePublicIdToAsset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagePublicId",
                table: "Assets",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePublicId",
                table: "Assets");
        }
    }
}
