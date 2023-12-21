using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models;

public class SellerModel
{
    [Key] 
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    [Required]
    [StringLength(256)]
    public string Name { get; set; }
    
    [Required]
    [StringLength(256)]
    public string Email { get; set; }

    [Required]
    [StringLength(20)]
    public string Password { get; set; }

    public ICollection<BookModel> Books { get; set; }
}