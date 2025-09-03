using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Corta.Migrations
{
    /// <inheritdoc />
    public partial class SyncProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
        

            
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OldPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "PurchaseCount",
                table: "Products");

        }
    }
}
