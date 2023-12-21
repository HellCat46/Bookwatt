using Microsoft.AspNetCore.Mvc;
using WebAPI.dbContext;
using WebAPI.Models;
using WebAPI.Models.ControllerModels;

namespace WebAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class SellerController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SellerController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    
    [HttpPost]
    [Route("/sellerLogin")]
    public IActionResult Login(Login creds)
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SessionID");
            if (bytes != null) return BadRequest(new
            {
                error = "Already Authenticated",
            });

            SellerModel? account = _context.Seller.FirstOrDefault(acc => acc.Email == creds.email);
            if (account == null) return Unauthorized(new { error = "No Account Associated with this email" });
            if (account.Password != creds.password) return Unauthorized(new { error = "Invalid Credentials" });

            HttpContext.Session.Set("SessionID", SellerModel.Serialize(account));
            return Ok();
        }
        catch (Exception ex)
        {
            Console.Write(ex);
            return StatusCode(500);
        }
    }

    [HttpPost]
    [Route("/sellerRegister")]
    public IActionResult Register(Register data)
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SessionID");
            if (bytes != null) return BadRequest(new
            {
                error = "Already Authenticated",
            });
            
            SellerModel acc = new SellerModel()
            {
                Name = data.name,
                Email = data.email,
                Password = data.password
            };
            
            _context.Seller.Add(acc);
            _context.SaveChanges();
            HttpContext.Session.Set("SessionID", SellerModel.Serialize(acc));
        }
        catch (Exception ex)
        {
            Console.Write(ex);
            return StatusCode(500);
        }
        return Ok();
    }

    [HttpPost]
    [Route("/addBook")]
    public IActionResult AddBook()
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SessionID");
            if (bytes == null) return StatusCode(403);
            
            
            return Ok();
        }
        catch (Exception ex)
        {
            Console.Write(ex);
            return StatusCode(500);
        }
    }
    
    [HttpPatch]
    [Route("/updateBook")]
    public IActionResult UpdateBook()
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SessionID");
            if (bytes == null) return StatusCode(403);;


            return Ok();
        }
        catch (Exception ex)
        {
            Console.Write(ex);
            return StatusCode(500);
        }
    }
    
    [HttpDelete]
    [Route("/deleteBook")]
    public IActionResult DeleteBook()
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SessionID");
            if (bytes == null) return StatusCode(403);


            return Ok();
        }
        catch (Exception ex)
        {
            Console.Write(ex);
            return StatusCode(500);
        }
    }
}