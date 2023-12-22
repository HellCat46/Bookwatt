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
            SellerModel account = SellerModel.Deserialize(bytes);
            
            // Saves Book Cover 
            string fileName = bookDetails.Name + "." + bookDetails.Cover.FileName.Split(".").Last();
            using (FileStream coverFile =
                   System.IO.File.Create(_coverDir + fileName))
            {
                bookDetails.Cover.CopyTo(coverFile);
                coverFile.Close();
            }
            
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
    
    [HttpPost]
    [Route("/updateBook")]
    public IActionResult UpdateBook(Book newDetails)
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SessionID");
            if (bytes == null) return StatusCode(403);
            SellerModel account = SellerModel.Deserialize(bytes);

            BookModel? book = _context.Book.FirstOrDefault(book => book.Id == newDetails.bookId);
            if (book == null) return NotFound();
            if (book.SellerId != account.Id) return StatusCode(403);


            string fileName = book.Cover;

            // Replaces Existing Book Cover with new one 
            if (fileName != newDetails.Cover.FileName)
            {
                if (System.IO.File.Exists(fileName)) System.IO.File.Delete(fileName);
                
                fileName = newDetails.Name + "." + newDetails.Cover.FileName.Split(".").Last();;
                using (FileStream coverFile =
                       System.IO.File.Create(_coverDir + fileName))
                {
                    newDetails.Cover.CopyTo(coverFile);
                    coverFile.Close();
                }

            }
            
            book.Id = book.Id;
            book.Name = newDetails.Name;
            book.Author = newDetails.Author;
            book.Cover = fileName;
            book.BookTypeId = newDetails.Type;
            book.Price = newDetails.Price;
            book.PublishAt = newDetails.PublishedAt;
            book.SellerId = account.Id;
            book.Publisher = newDetails.Publisher;
            _context.SaveChanges();
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
    public IActionResult DeleteBook(int bookId)
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SessionID");
            if (bytes == null) return StatusCode(403);
            SellerModel account = SellerModel.Deserialize(bytes);

            BookModel? book = _context.Book.FirstOrDefault(book => book.Id == bookId);
            if (book == null) return NotFound();
            if (book.SellerId != account.Id) return StatusCode(403);

            _context.Book.Remove(book);
            _context.SaveChanges();

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
                    Id = book.Id,
                    Name = book.Name,
                    Author = book.Author,
                    Cover = HttpContext.Request.Headers.Host+"/Assets/"+book.Cover,
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