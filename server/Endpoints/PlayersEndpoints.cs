using Npgsql;
using server.DTOs;

namespace server.Endpoints;

public static class PlayersEndpoints
{
    public static void MapPlayersEndpoints(this WebApplication app)
    {
        app.MapPost("/api/players", async (PlayersDto player, NpgsqlDataSource db) =>
        {
            try
            {
                await using var cmd = db.CreateCommand(@"
                    INSERT INTO players (first_name, last_name, birth_date)
                    VALUES (@first_name, @last_name, @birth_date)
                    RETURNING id, first_name, last_name, birth_date;");

                cmd.Parameters.AddWithValue("first_name", player.FirstName);
                cmd.Parameters.AddWithValue("last_name", player.LastName);
                cmd.Parameters.AddWithValue("birth_date", player.BirthDate);

                await using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return Results.Ok(new
                    {
                        Id = reader.GetInt32(0),
                        FirstName = reader.GetString(1),
                        LastName = reader.GetString(2),
                        BirthDate = reader.GetDateTime(3)
                    });
                }

                return Results.BadRequest("Could not create player.");
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });
        
        app.MapGet("/api/players", async (NpgsqlDataSource db) =>
        {
            try
            {
                await using var cmd = db.CreateCommand("SELECT id, first_name, last_name, birth_date FROM players;");
                await using var reader = await cmd.ExecuteReaderAsync();

                var players = new List<PlayersDto>();

                while (await reader.ReadAsync())
                {
                    players.Add(new PlayersDto
                    {
                        FirstName = reader.GetString(1),
                        LastName = reader.GetString(2),
                        BirthDate = reader.GetDateTime(3)
                    });
                }

                return Results.Ok(players);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });
    }
}