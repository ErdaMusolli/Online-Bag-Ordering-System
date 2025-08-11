using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Corta.Migrations
{
    /// <inheritdoc />
    public partial class AddProductImageUrlToPurchaseItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProductImageUrl",
                table: "PurchaseItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductImageUrl",
                table: "PurchaseItems");
        }
    }
}
