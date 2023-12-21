using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddsMoreTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Book",
                newName: "Typeid");

            migrationBuilder.RenameColumn(
                name: "Publish",
                table: "Book",
                newName: "Publisher");

            migrationBuilder.AddColumn<int>(
                name: "BookTypeId",
                table: "Book",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SellerId",
                table: "Book",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "BookModelUserModel",
                columns: table => new
                {
                    BooksId = table.Column<int>(type: "int", nullable: false),
                    BuyersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookModelUserModel", x => new { x.BooksId, x.BuyersId });
                    table.ForeignKey(
                        name: "FK_BookModelUserModel_Book_BooksId",
                        column: x => x.BooksId,
                        principalTable: "Book",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookModelUserModel_User_BuyersId",
                        column: x => x.BuyersId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookTypeModel",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookTypeModel", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SellerModel",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SellerModel", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Book_BookTypeId",
                table: "Book",
                column: "BookTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Book_SellerId",
                table: "Book",
                column: "SellerId");

            migrationBuilder.CreateIndex(
                name: "IX_BookModelUserModel_BuyersId",
                table: "BookModelUserModel",
                column: "BuyersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Book_BookTypeModel_BookTypeId",
                table: "Book",
                column: "BookTypeId",
                principalTable: "BookTypeModel",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Book_SellerModel_SellerId",
                table: "Book",
                column: "SellerId",
                principalTable: "SellerModel",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Book_BookTypeModel_BookTypeId",
                table: "Book");

            migrationBuilder.DropForeignKey(
                name: "FK_Book_SellerModel_SellerId",
                table: "Book");

            migrationBuilder.DropTable(
                name: "BookModelUserModel");

            migrationBuilder.DropTable(
                name: "BookTypeModel");

            migrationBuilder.DropTable(
                name: "SellerModel");

            migrationBuilder.DropIndex(
                name: "IX_Book_BookTypeId",
                table: "Book");

            migrationBuilder.DropIndex(
                name: "IX_Book_SellerId",
                table: "Book");

            migrationBuilder.DropColumn(
                name: "BookTypeId",
                table: "Book");

            migrationBuilder.DropColumn(
                name: "SellerId",
                table: "Book");

            migrationBuilder.RenameColumn(
                name: "Typeid",
                table: "Book",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "Publisher",
                table: "Book",
                newName: "Publish");
        }
    }
}
