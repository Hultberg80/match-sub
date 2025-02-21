namespace server;

public class PlayerMatch
{
    public int Id { get; set; }
    public int PlayerId { get; set; }
    public Player Player { get; set; }
    public int MatchId { get; set; }
    public Match Match { get; set; }
    public int PlayTimeFirstHalf { get; set; }  // Tid i sekunder
    public int PlayTimeSecondHalf { get; set; } // Tid i sekunder
    public List<Statistics> Statistics { get; set; }
}