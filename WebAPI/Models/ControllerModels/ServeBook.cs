namespace WebAPI.Models.ControllerModels;

public class ServeBook
{
        public string Name { get; set; }
        public string Author { get; set; }
        public int Price { get; set; }
        public int Type { get; set; }
        public string Publisher { get; set; }
        public DateTime PublishedAt { get; set; }
        public string Cover { get; set; }
        public List<string> Buyers { get; set; }
}