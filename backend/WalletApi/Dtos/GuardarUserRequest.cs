using System.ComponentModel.DataAnnotations;

namespace WalletApi.Dtos
{
    public class GuardarUserRequest
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre debe tener menos de 100 caracteres.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        [StringLength(100, ErrorMessage = "El apellido debe tener menos de 100 caracteres.")]
        public string LastName { get; set; } = string.Empty;

        public int DocumentTypeId { get; set; }
        public string DocumentNumber { get; set; } = string.Empty;



    }
}
