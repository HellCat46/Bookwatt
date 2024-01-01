using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            byte[]? bytes = HttpContext.Session.Get("UserData");
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

            HttpContext.Session.Set("UserData", UserModel.Serialize(account));
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
            byte[]? bytes = HttpContext.Session.Get("UserData");
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
            HttpContext.Session.Set("UserData", UserModel.Serialize(acc));
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
    public IActionResult ListBook()
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("UserData");
            if (bytes == null)
                return StatusCode(403, new { error = "AccessDenied", message = "You need to login/register first." });
            UserModel account = UserModel.Deserialize(bytes);

            IQueryable<BookModel> bookModels = _context.Book.Where(book => !book.Buyers.Contains(account));
            List<ServeBook> books = new List<ServeBook>();

            foreach (BookModel book in bookModels)
            {
                books.Add(new ServeBook()
                {
                    Id = book.Id,
                    Name = book.Name,
                    Author = book.Author,
                    Cover = HttpContext.Request.Headers.Host + "/Assets/" + book.Cover,
                    Price = book.Price,
                    Publisher = book.Publisher,
                    PublishedAt = book.PublishAt,
                    Type = book.BookTypeId,
                });
            }

            return Ok(books);
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
    [Route("/user/listPurchasedBooks")]
    public IActionResult ListBroughtBook()
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("UserData");
            if (bytes == null)
                return StatusCode(403, new { error = "AccessDenied", message = "You need to login/register first." });
            
            UserModel account = UserModel.Deserialize(bytes);

            IQueryable<BookModel> bookModels = _context.Book.Where(book => book.Buyers.Contains(account));
            List<ServeBook> books = new List<ServeBook>();

            foreach (BookModel book in bookModels)
            {
                books.Add(new ServeBook()
                {
                    Id = book.Id,
                    Name = book.Name,
                    Author = book.Author,
                    Cover = HttpContext.Request.Headers.Host + "/Assets/" + book.Cover,
                    Price = book.Price,
                    Publisher = book.Publisher,
                    PublishedAt = book.PublishAt,
                    Type = book.BookTypeId,
                });
            }

            return Ok(books);
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
    [Route("/user/searchBook")]
    public string SearchBook()
    {
        return "User SearchBook";
    }

    [HttpPost]
    [Route("/user/buyBook")]
    public IActionResult BuyBook(int bookId)
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("UserData");
            if (bytes == null)
                return StatusCode(403, new { error = "AccessDenied", message = "You need to login/register first." });
            
            UserModel account = UserModel.Deserialize(bytes);


            BookModel? book = _context.Book.Include(book => book.Buyers).FirstOrDefault(book => book.Id == bookId);
            if (book == null) return NotFound(new { error = "BookNotFound", message = "Book doesn't exist." });


            if (book.Buyers == null) book.Buyers = new List<UserModel>();

            foreach (var buyer in book.Buyers)
            {
                if (buyer.Id == account.Id)
                    return StatusCode(409, new
                    {
                        error = "AlreadyBrought",
                        message = "You have already brought this book."
                    });
            }

            book.Buyers.Add(account);

            _context.SaveChanges();
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
}