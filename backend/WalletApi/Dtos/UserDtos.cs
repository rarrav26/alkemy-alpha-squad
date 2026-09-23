using System;
using System.Collections.Generic;

namespace WalletApi.Dtos;

public class UserListItemDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string DocumentNumber { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Role { get; set; } = "Usuario";
}

public class PagedUsersResponseDto
{
    public int TotalRegistros { get; set; }
    public int PaginaActual { get; set; }
    public int PorPagina { get; set; }
    public int TotalPaginas { get; set; }
    public IReadOnlyList<UserListItemDto> Usuarios { get; set; } = new List<UserListItemDto>();
}

public class UserDetailResponseDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string DocumentNumber { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Role { get; set; } = "Usuario";
    public AccountResponseDto? Account { get; set; }
}

