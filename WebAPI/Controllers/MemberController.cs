using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[ApiController]
public class MemberController
{
    [Route("/")]
    [HttpGet]
    public string Login()
    {
        return "Hello";
    }
}