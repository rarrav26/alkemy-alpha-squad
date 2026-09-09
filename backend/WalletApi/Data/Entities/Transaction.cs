using System;
using System.Collections.Generic;

namespace WalletApi.Models;

public partial class Transaction
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public virtual Account Account { get; set; } = null!;
}
