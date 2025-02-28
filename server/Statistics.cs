namespace server;

public class Statistics
{
    public int Id { get; set; }
    public int PlayerMatchId { get; set; }
    public PlayerMatch? PlayerMatch { get; set; }  // Make nullable
    public StatisticType Type { get; set; }
    public int Period { get; set; } // 1 eller 2 för första/andra halvlek
    public DateTime TimeStamp { get; set; }
}