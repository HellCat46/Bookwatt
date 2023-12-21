using Microsoft.AspNetCore.Mvc;
using WebAPI.Models.ControllerModels;

namespace WebAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    [HttpPost]
    [Route("/login")]
    public string Login()
    {
        return "User Login";
    }
    
    [HttpPost]
    [Route("/register")]
    public string Register()
    {
        return "User Register";
    }
    
    [HttpGet]
    [Route("/searchBook")]
    public string SearchBook()
    {
        return "User SearchBook";
    }

    [HttpPost]
    [Route("/buyBook")]
    public string BuyBook()
    {
        return "User BuyBook";
    }
}