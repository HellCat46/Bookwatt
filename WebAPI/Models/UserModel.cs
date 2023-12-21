using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace WebAPI.Models;

public class UserModel
{
    [Key] 
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; }
    
    [Required]
    [StringLength(256)]
    public string Email { get; set; }

    [Required]
    [StringLength(20)]
    public string Password { get; set; }

    public ICollection<BookModel> Books { get; set; } 
    
    
    public static byte[] Serialize(UserModel account)
    {
        return JsonSerializer.SerializeToUtf8Bytes(account);
    }
    public static UserModel Deserialize(byte[] bytes)
    {
        return JsonSerializer.Deserialize<UserModel>(bytes);
    }
}
