using System;
using System.Collections.Generic;

namespace WalletApi.Models;

public partial class User
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Lastname { get; set; }

    public int DocumentTypeId { get; set; }

    public string DocumentNumber { get; set; } = null!;

    public string? Email { get; set; }

    public virtual DocumentType DocumentType { get; set; } = null!;
}
