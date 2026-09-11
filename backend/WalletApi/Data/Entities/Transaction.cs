using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
namespace WalletApi.Data.Entities;

public partial class Transaction
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public virtual Account Account { get; set; } = null!;
}
