using System.ComponentModel.DataAnnotations;

namespace WalletApi.Dtos
{
    public class GuardarUserRequest
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre debe tener menos de 100 caracteres.")]
        public string Nombre { get; set; } = string.Empty;

        [Range(1888, 2100, ErrorMessage = "El año debe ser entre 1888 y 2100.")]
        public string Lastname { get; set; } = string.Empty;

        public int DocumentTypeId { get; set; }
        public string DocumentNumber { get; set; } = string.Empty;



    }
}
