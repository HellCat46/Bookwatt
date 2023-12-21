using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models;

public class BookType
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int Name { get; set; }
}