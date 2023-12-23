using Microsoft.AspNetCore.Mvc;
using WebAPI.dbContext;
using WebAPI.Models;
using WebAPI.Models.ControllerModels;

namespace WebAPI.Controllers;

[ApiController]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpPost]
    [Route("/user/login")]
    public IActionResult Login(Login creds)
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SessionID");
            int? sessionType = HttpContext.Session.GetInt32("SessionType");


            if (sessionType != 1 && sessionType != null)
                return StatusCode(403,
                    new { error = "AccessDenied", message = "Logout from the Seller Account First!!!" });
            if (bytes != null)
                return BadRequest(new
                {
                    error = "AlreadyAuthenticated",
                    message = "You are already logged in."
                });

            UserModel? account = _context.User.FirstOrDefault(acc => acc.Email == creds.email);
            if (account == null)
                return NotFound(new { error = "AccountNotFound", message = "No Account Associated with this email" });
            if (account.Password != creds.password)
                return Unauthorized(new { error = "InvalidCredentials", message = "Account Credentials are Invalid." });

            HttpContext.Session.Set("SessionID", UserModel.Serialize(account));
            HttpContext.Session.SetInt32("SessionType", 1);
            return Ok();
        }
        catch (Exception ex)
        {
            Console.Write(ex);
            return StatusCode(500, new
            {
                error = "UnexpectedError",
                message = "Something Unexpected Happened while processing the request."
            });
        }
    }
    
    [HttpPost]
    [Route("/user/register")]
    public IActionResult Register(Register data)
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SessionID");
            int? sessionType = HttpContext.Session.GetInt32("SessionType");


            if (sessionType != 1 && sessionType != null)
                return StatusCode(403,
                    new { error = "AccessDenied", message = "Logout from the Seller Account First!!!" });
            if (bytes != null)
                return BadRequest(new
                {
                    error = "Already Authenticated",
                    message = "You are already logged in."
                });

            UserModel acc = new UserModel()
            {
                Name = data.name,
                Email = data.email,
                Password = data.password
            };

            _context.User.Add(acc);
            _context.SaveChanges();
            HttpContext.Session.Set("SessionID", UserModel.Serialize(acc));
            HttpContext.Session.SetInt32("SessionType", 1);
            return Ok();
        }
        catch (Exception ex)
        {
            Console.Write(ex);
            return StatusCode(500, new
            {
                error = "UnexpectedError",
                message = "Something Unexpected Happened while processing the request."
            });
        }
    }
    
    [HttpDelete]
    [Route("/user/logout")]
    public IActionResult Logout()
    {
        try
        {
            HttpContext.Session.Clear();
            return Ok();
        }
        catch (Exception ex)
        {
            Console.Write(ex);
            return StatusCode(500, new
            {
                error = "UnexpectedError",
                message = "Something Unexpected Happened while processing the request."
            });
        } 
    }

    [HttpGet]
    [Route("/user/listBooks")]
    public string ListBook()
    {
        return "User ListBook";
    }
    
    [HttpGet]
    [Route("/user/listPurchasedBooks")]
    public string ListBroughtBook()
    {
        return "User List Purchased Book";
    }
    
    [HttpGet]
    [Route("/user/searchBook")]
    public string SearchBook()
    {
        return "User SearchBook";
    }
    [HttpPost]
    [Route("/user/buyBook")]
    public string BuyBook()
    {
        return "User BuyBook";
    }
}