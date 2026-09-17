using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WalletApi.Migrations
{
    /// <inheritdoc />
    public partial class AddRelatedTransactionIdToTransactions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RelatedTransactionId",
                table: "Transactions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_RelatedTransactionId",
                table: "Transactions",
                column: "RelatedTransactionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_RelatedTransaction",
                table: "Transactions",
                column: "RelatedTransactionId",
                principalTable: "Transactions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_RelatedTransaction",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_RelatedTransactionId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "RelatedTransactionId",
                table: "Transactions");
        }
    }
}
