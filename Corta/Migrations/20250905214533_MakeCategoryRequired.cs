using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Corta.Migrations
{
    /// <inheritdoc />
    public partial class MakeCategoryRequired : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
         
    migrationBuilder.Sql(@"
IF NOT EXISTS (SELECT 1 FROM Categories WHERE Slug = 'uncategorized')
BEGIN
    INSERT INTO Categories (Name, Slug) VALUES ('Uncategorized','uncategorized');
END;

DECLARE @uncat INT = (SELECT TOP 1 Id FROM Categories WHERE Slug='uncategorized');

UPDATE Products
SET CategoryId = @uncat
WHERE CategoryId IS NULL OR CategoryId = 0;
");

   
    migrationBuilder.Sql(@"
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Products_Categories_CategoryId')
    ALTER TABLE [Products] DROP CONSTRAINT [FK_Products_Categories_CategoryId];
");

   
    migrationBuilder.AlterColumn<int>(
        name: "CategoryId",
        table: "Products",
        type: "int",
        nullable: false,
        oldClrType: typeof(int),
        oldType: "int",
        oldNullable: true
    );

   
    migrationBuilder.AddForeignKey(
        name: "FK_Products_Categories_CategoryId",
        table: "Products",
        column: "CategoryId",
        principalTable: "Categories",
        principalColumn: "Id",
        onDelete: ReferentialAction.Restrict
    );
}
        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

             migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products"
            );

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "Products",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int"
            );

        }
    }
}
