namespace server;

public class StatisticDto
{
    public int PlayerMatchId { get; set; }
    public string StatisticType { get; set; }  // Keep as string for parsing
    public int Period { get; set; }
}