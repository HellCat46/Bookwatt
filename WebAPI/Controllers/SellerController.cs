using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;
using WebAPI.dbContext;
using WebAPI.Models;
using WebAPI.Models.ControllerModels;

namespace WebAPI.Controllers;

[ApiController]
public class SellerController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly string _coverDir = "wwwroot/Assets/";

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
    public IActionResult AddBook(Book bookDetails)
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SessionID");
            if (bytes == null) return StatusCode(403);

            string fileName = bookDetails.Name + "." + bookDetails.Cover.FileName.Split(".").Last();
            using (FileStream coverFile =
                   System.IO.File.Create(_coverDir + fileName))
            {
                bookDetails.Cover.CopyTo(coverFile);
                coverFile.Close();
            }
            
            SellerModel account = SellerModel.Deserialize(bytes);
            
            _context.Book.Add(new BookModel()
            {
                Name = bookDetails.Name,
                Author = bookDetails.Author,
                Price = bookDetails.Price,
                BookTypeId = bookDetails.Type,
                Publisher = bookDetails.Publisher,
                PublishAt = bookDetails.PublishedAt,
                Cover = fileName,
                SellerId = account.Id
            });
            _context.SaveChanges();
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

    [HttpGet]
    [Route("/listBooks")]
    public IActionResult ListBooks()
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SessionID");
            if (bytes == null) return StatusCode(403);
            SellerModel account = SellerModel.Deserialize(bytes);
            
            IQueryable<BookModel> bookModels = _context.Book.Where(book => book.SellerId == account.Id);
            List<ServeBook> books = new List<ServeBook>();

            foreach (BookModel book in bookModels)
            {
                books.Add(new ServeBook()
                {
                    Author = book.Author,
                    Cover = HttpContext.Request.Headers.Host+"Assets/"+book.Cover,
                    Name = book.Name,
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
            return StatusCode(500);
        }
    }
}