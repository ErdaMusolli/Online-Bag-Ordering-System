using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Corta.Migrations
{
    /// <inheritdoc />
    public partial class CreatePurchasesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {  migrationBuilder.CreateTable(
    name: "Purchases",
    columns: table => new
    {
        Id = table.Column<int>(nullable: false)
            .Annotation("SqlServer:Identity", "1, 1"),
        TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
        UserId = table.Column<int>(nullable: false),
        CreatedAt = table.Column<DateTime>(nullable: false)
        // shto kolona të tjera nëse ke
    },
    constraints: table =>
    {
        table.PrimaryKey("PK_Purchases", x => x.Id);
        table.ForeignKey(
            name: "FK_Purchases_Users_UserId",
            column: x => x.UserId,
            principalTable: "Users",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);
    });

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {  migrationBuilder.CreateTable(
    name: "Purchases",
    columns: table => new
    {
        Id = table.Column<int>(nullable: false)
            .Annotation("SqlServer:Identity", "1, 1"),
        TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
        UserId = table.Column<int>(nullable: false),
        CreatedAt = table.Column<DateTime>(nullable: false)
        // shto kolona të tjera nëse ke
    },
    constraints: table =>
    {
        table.PrimaryKey("PK_Purchases", x => x.Id);
        table.ForeignKey(
            name: "FK_Purchases_Users_UserId",
            column: x => x.UserId,
            principalTable: "Users",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);
    });

        }
    }
}
