using server.DTOs;
using Npgsql;

namespace server.Endpoints;

public static class MatchEndpoints
{
    public static void MapMatchEndpoints(this WebApplication app)
    {
        app.MapPost("/api/match", async (MatchDto match, NpgsqlDataSource db) =>
        {
            try
            {
                await using var cmd = db.CreateCommand(@"
                    INSERT INTO match (match_date, match_type)
                    VALUES (@match_date, @match_type)
                    RETURNING id, match_date, match_type;");

                cmd.Parameters.AddWithValue("match_date", match.matchDate);
                cmd.Parameters.AddWithValue("match_type", match.matchType);

                await using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return Results.Ok(new
                    {
                        Id = reader.GetInt32(0),
                        MatchDate = reader.GetDateTime(1),
                        MatchType = reader.GetString(2)
                    });
                }

                return Results.BadRequest("Could not create match.");
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });
        
        
        
        app.MapGet("/api/match", async (NpgsqlDataSource db) =>
        {
            try
            {
                await using var cmd = db.CreateCommand("SELECT id, match_date, match_type FROM match;");
                await using var reader = await cmd.ExecuteReaderAsync();

                var matches = new List<MatchDto>();

                while (await reader.ReadAsync())
                {
                    matches.Add(new MatchDto
                    {
                        matchDate = reader.GetDateTime(1),
                        matchType = (MatchType)reader.GetInt32(2)
                    });
                }

                return Results.Ok(matches);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });
    }
}