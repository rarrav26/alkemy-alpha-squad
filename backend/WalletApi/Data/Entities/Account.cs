using System;
using System.Collections.Generic;

namespace WalletApi.Models;

public partial class Account
{
    public int Id { get; set; }

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
