using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Corta.Migrations
{
    /// <inheritdoc />
    public partial class EnsureWishlistsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF OBJECT_ID(N'[dbo].[Wishlists]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Wishlists](
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [UserId] INT NOT NULL,
        [ProductId] INT NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );

    ALTER TABLE [dbo].[Wishlists]
      ADD CONSTRAINT FK_Wishlists_Users
      FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE;

    ALTER TABLE [dbo].[Wishlists]
      ADD CONSTRAINT FK_Wishlists_Products
      FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Products]([Id]) ON DELETE CASCADE;

    IF NOT EXISTS (
        SELECT 1 FROM sys.indexes 
        WHERE name = 'UX_Wishlists_User_Product' 
          AND object_id = OBJECT_ID('[dbo].[Wishlists]')
    )
    BEGIN
        CREATE UNIQUE INDEX UX_Wishlists_User_Product
        ON [dbo].[Wishlists]([UserId], [ProductId]);
    END
END
");
}

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF OBJECT_ID(N'[dbo].[Wishlists]', N'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[Wishlists];
END
");

        }
    }
}
