using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
namespace WalletApi.Data.Entities;

public partial class Transaction
{
    public int Id { get; set; }

    public int SenderAccountId { get; set; }
    public required Account SenderAccount { get; set; }

    public int ReceiverAccountId { get; set; }
    public required Account ReceiverAccount { get; set; }

    public decimal Amount { get; set; }
    public DateTime Date { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual Account Account { get; set; } = null!;
}

