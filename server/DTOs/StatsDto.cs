namespace server.DTOs;

public class StatsDto
{
    public int PlayerId { get; set; }
    public int MatchId { get; set; }
    public int Goals { get; set; }
    public int Shots { get; set; }
    public int MissedShots { get; set; }
    public int Penalties { get; set; }
    public int Penalty_miss { get; set; }
    public int Assists { get; set; }
    public TimeSpan TimePlayed { get; set; }
    public int TechnicalFouls { get; set; }
    public int Saves { get; set; }
    public int MatchesPlayed { get; set; }
}