namespace server;

public class Match
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Opponent { get; set; }
    public List<PlayerMatch> PlayerMatches { get; set; }
}