using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.dbContext;
using WebAPI.Models;
using WebAPI.Models.ControllerModels;

namespace WebAPI.Controllers;

[ApiController]
public class SellerController(ApplicationDbContext context) : ControllerBase
{
    private readonly string _coverDir = "wwwroot/Assets/";

    [HttpGet]
    [Route("/getBookTypes")]
    public IEnumerable<BookType> GetBookTypes()
    {
        try
        {
            return context.BookType.ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return [];
        }
    }

    [HttpPost]
    [Route("/seller/login")]
    public IActionResult Login(Login creds)
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SellerData");
            
            if (bytes != null)
                return BadRequest(new
                {
                    error = "AlreadyAuthenticated",
                    message = "You are already logged in."
                });

            SellerModel? account = context.Seller.FirstOrDefault(acc => acc.Email == creds.email);
            if (account == null)
                return NotFound(new { error = "AccountNotFound", message = "No Account Associated with this email" });
            if (account.Password != creds.password)
                return Unauthorized(new { error = "InvalidCredentials", message = "Account Credentials are Invalid." });

            HttpContext.Session.Set("SellerData", SellerModel.Serialize(account));
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
    [Route("/seller/register")]
    public IActionResult Register(Register data)
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SellerData");

            if (bytes != null)
                return BadRequest(new
                {
                    error = "Already Authenticated",
                    message = "You are already logged in."
                });

            SellerModel acc = new SellerModel()
            {
                Name = data.name,
                Email = data.email,
                Password = data.password
            };

            context.Seller.Add(acc);
            context.SaveChanges();
            HttpContext.Session.Set("SellerData", SellerModel.Serialize(acc));
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
    [Route("/seller/logout")]
    public IActionResult Logout()
    {
        try
        {
            HttpContext.Session.Remove("SellerData");
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
    [Route("/seller/listBooks")]
    public IActionResult ListBooks()
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SellerData");
            
            if (bytes == null)
                return StatusCode(403, new { error = "AccessDenied", message = "You need to login/register first." });
            SellerModel account = SellerModel.Deserialize(bytes);

            IQueryable<BookModel> bookModels = context.Book.Include(book=>book.Buyers).Where(book => book.SellerId == account.Id);
            List<ServeBook> books = new List<ServeBook>();

            
            foreach (BookModel book in bookModels)
            {
                List<Buyer> buyer = new List<Buyer>();
                foreach (UserModel user in book.Buyers)
                {
                    buyer.Add(new Buyer()
                    {
                        name = user.Name,
                        email = user.Email
                    });
                }
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
                    Buyers = buyer
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

    [HttpPost]
    [Route("/seller/addBook")]
    public IActionResult AddBook(Book bookDetails)
    {
        try
        {
            if (bookDetails.Cover == null)
                return StatusCode(400, new { error = "RequiredAttributeMissing", message = "Cover Attribute is Missing." });

            byte[]? bytes = HttpContext.Session.Get("SellerData");
            if (bytes == null)
                return StatusCode(403, new { error = "AccessDenied", message = "You need to login/register first." });
            SellerModel account = SellerModel.Deserialize(bytes);
            
            // Saves Book Cover 
            string fileName = bookDetails.Name + "." + bookDetails.Cover.FileName.Split(".").Last();
            using (FileStream coverFile =
                   System.IO.File.Create(_coverDir + fileName))
            {
                bookDetails.Cover.CopyTo(coverFile);
                coverFile.Close();
            }

            BookModel book = new BookModel()
            {
                Name = bookDetails.Name,
                Author = bookDetails.Author,
                Price = bookDetails.Price,
                BookTypeId = bookDetails.Type,
                Publisher = bookDetails.Publisher,
                PublishAt = bookDetails.PublishedAt,
                Cover = fileName,
                SellerId = account.Id
            };
            context.Book.Add(book);
            context.SaveChanges();
            return Ok(new ServeBook()
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
    [Route("/seller/updateBook")]
    public IActionResult UpdateBook(Book newDetails)
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SellerData");
            if (bytes == null)
                return StatusCode(403, new { error = "AccessDenied", message = "You need to login/register first." });
            
            SellerModel account = SellerModel.Deserialize(bytes);

            BookModel? book = context.Book.FirstOrDefault(book => book.Id == newDetails.bookId);
            if (book == null) return NotFound(new { error = "BookNotFound", message = "Book doesn't exist." });
            if (book.SellerId != account.Id)
                return StatusCode(403,
                    new { error = "AccessDenied", message = "You don't permission to update this book." });


            

            // Replaces Existing Book Cover with new one 
            if (newDetails.Cover != null)
            {
                string fileName = book.Cover;
                if (System.IO.File.Exists(fileName)) System.IO.File.Delete(fileName);

                fileName = newDetails.Name + "." + newDetails.Cover.FileName.Split(".").Last();
                using (FileStream coverFile =
                       System.IO.File.Create(_coverDir + fileName))
                {
                    newDetails.Cover.CopyTo(coverFile);
                    coverFile.Close();
                }
                book.Cover = fileName;
            }

            book.Id = book.Id;
            book.Name = newDetails.Name;
            book.Author = newDetails.Author;
            book.BookTypeId = newDetails.Type;
            book.Price = newDetails.Price;
            book.PublishAt = newDetails.PublishedAt;
            book.SellerId = account.Id;
            book.Publisher = newDetails.Publisher;
            context.SaveChanges();
            return Ok(new ServeBook()
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
    [Route("/seller/deleteBook")]
    public IActionResult DeleteBook(int bookId)
    {
        try
        {
            byte[]? bytes = HttpContext.Session.Get("SellerData");
            if (bytes == null)
                return StatusCode(403, new { error = "AccessDenied", message = "You need to login/register first." });
            
            SellerModel account = SellerModel.Deserialize(bytes);

            BookModel? book = context.Book.FirstOrDefault(book => book.Id == bookId);
            if (book == null) return NotFound(new { error = "BookNotFound", message = "Book doesn't exist." });
            if (book.SellerId != account.Id)
                return StatusCode(403,
                    new { error = "AccessDenied", message = "You don't permission to delete this book." });

            context.Book.Remove(book);
            context.SaveChanges();

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