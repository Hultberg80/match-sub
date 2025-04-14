using server.DTOs;
using Npgsql;

namespace server.Endpoints;

public static class StatsEndpoints
{
    public static void MapStatsEndpoints(this WebApplication app)
    {
        app.MapPost("/api/stats", async (StatsDto stats, NpgsqlDataSource db) =>
        {
            try
            {
                await using var cmd = db.CreateCommand(@"
                    UPDATE stats
                    SET goals = @goals,
                        shots = @shots,
                        missed_shots = @missed_shots,
                        penalties = @penalties,
                        penalty_miss = @penalty_miss,
                        assist = @assists,
                        time_played = @time_played,
                        technical = @technical_fouls,
                        saves = @saves,
                        matches_played = @matches_played
                    
                        WHERE match_id = @match_id AND player_id = @player_id
                        RETURNING id, player_id, match_id, goals, shots, missed_shots, penalties, 
                                  penalty_miss, assist, time_played, technical, saves, matches_played;");

                cmd.Parameters.AddWithValue("player_id", stats.PlayerId);
                cmd.Parameters.AddWithValue("match_id", stats.MatchId);
                cmd.Parameters.AddWithValue("goals", stats.Goals);
                cmd.Parameters.AddWithValue("shots", stats.Shots);
                cmd.Parameters.AddWithValue("missed_shots", stats.MissedShots);
                cmd.Parameters.AddWithValue("penalties", stats.Penalties);
                cmd.Parameters.AddWithValue("penalty_miss", stats.Penalty_miss);
                cmd.Parameters.AddWithValue("assists", stats.Assists);
                cmd.Parameters.AddWithValue("time_played", stats.TimePlayed);
                cmd.Parameters.AddWithValue("technical_fouls", stats.TechnicalFouls);
                cmd.Parameters.AddWithValue("saves", stats.Saves);
                cmd.Parameters.AddWithValue("matches_played", stats.MatchesPlayed);

                await using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return Results.Ok(new
                    {
                        Id = reader.GetInt32(0),
                        PlayerId = reader.GetInt32(1),
                        MatchId = reader.GetInt32(2),
                        Goals = reader.GetInt32(3),
                        Shots = reader.GetInt32(4),
                        MissedShots = reader.GetInt32(5),
                        Penalties = reader.GetInt32(6),
                        Penalty_miss = reader.GetInt32(7),
                        Assists = reader.GetInt32(8),
                        TimePlayed = reader.GetTimeSpan(9),
                        TechnicalFouls = reader.GetInt32(10),
                        Saves = reader.GetInt32(11),
                        MatchesPlayed = reader.GetInt32(12)
                    });
                }

                return Results.BadRequest("Could not update stats.");
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });
        
        app.MapPut("/api/stats/time-played", async (int matchId, int playerId, int timePlayed, NpgsqlDataSource db) =>
        {
            try
            {
                await using var cmd = db.CreateCommand(@"
                UPDATE stats
                SET time_played = @time_played
                WHERE match_id = @match_id AND player_id = @player_id
                RETURNING id, player_id, match_id, time_played;");

                cmd.Parameters.AddWithValue("match_id", matchId);
                cmd.Parameters.AddWithValue("player_id", playerId);
                cmd.Parameters.AddWithValue("time_played", timePlayed);

                await using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return Results.Ok(new
                    {
                        Id = reader.GetInt32(0),
                        PlayerId = reader.GetInt32(1),
                        MatchId = reader.GetInt32(2),
                        TimePlayed = reader.GetInt32(3)
                    });
                }

                return Results.BadRequest("Could not update time played.");
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });
    }
}