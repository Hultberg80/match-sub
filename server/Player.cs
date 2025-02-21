namespace server;

public class Player
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public List<PlayerMatch> PlayerMatches { get; set; }
    public List<Statistics> Statistics { get; set; }
}