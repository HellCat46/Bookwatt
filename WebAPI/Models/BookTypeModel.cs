using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class BookTypeModel
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int Name { get; set; }
}