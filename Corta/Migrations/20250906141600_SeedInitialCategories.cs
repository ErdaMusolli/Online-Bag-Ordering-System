using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Corta.Migrations
{
    /// <inheritdoc />
    public partial class SeedInitialCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

        migrationBuilder.Sql(@"
         IF NOT EXISTS (SELECT 1 FROM Categories WHERE Slug = 'bags')
         INSERT INTO Categories (Name, Slug) VALUES ('Bags','bags');

         IF NOT EXISTS (SELECT 1 FROM Categories WHERE Slug = 'summer-collection')
         INSERT INTO Categories (Name, Slug) VALUES ('Summer Collection','summer-collection');
        ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
       
        migrationBuilder.Sql(@"
         DECLARE @uncat INT = (SELECT TOP 1 Id FROM Categories WHERE Slug = 'uncategorized');
         IF @uncat IS NOT NULL
         BEGIN
         UPDATE p
         SET p.CategoryId = @uncat
         FROM Products p
         WHERE p.CategoryId IN (
         SELECT c.Id FROM Categories c WHERE c.Slug IN ('bags','summer-collection')
         );
        END
        DELETE FROM Categories WHERE Slug IN ('bags','summer-collection');
        
        ");
        }
    }
}
