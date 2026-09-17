using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
namespace WalletApi.Data.Entities;

public partial class Transaction
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public decimal Amount { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int? RelatedTransactionId { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual Transaction? RelatedTransaction { get; set; }
}

