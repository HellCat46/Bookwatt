using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models;

public class BookModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; }
    
    [Required]
    public int Price { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Author { get; set; }
    
    [Required]
    public int BookTypeId { get; set; }
    public BookType BookType { get; set; }
    
    [Required]
    public string Cover { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Publisher { get; set; }
    
    [Required]
    public DateTime PublishAt { get; set; } 
    
    [Required]
    public int SellerId { get; set; }
    public SellerModel Seller { get; set; }
    
    [Required]
    public ICollection<UserModel> Buyers { get; set; } 
}