namespace WebAPI.Models.ControllerModels;

public class ServeBook
{
        public int Id { get; set; }
        public string Name { get; set; }
        public string Author { get; set; }
        public int Price { get; set; }
        public int Type { get; set; }
        public string Publisher { get; set; }
        public DateTime PublishedAt { get; set; }
        public string Cover { get; set; }
        public List<Buyer> Buyers { get; set; }
}

public class Buyer
{
        public string name { get; set; }
        
        public string email { get; set; }
}