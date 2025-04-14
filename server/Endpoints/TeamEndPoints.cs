using server.DTOs;
using Npgsql;

namespace server.Endpoints;

public static class TeamEndPoints
{
    public static void MapTeamsEndpoints(this WebApplication app)
    {
        app.MapPost("/api/teams", async (TeamsDto team, NpgsqlDataSource db) =>
        {
            try
            {
                await using var cmd = db.CreateCommand(@"
                    INSERT INTO teams (team_name, club_name, country)
                    VALUES (@team_name, @club_name, @country)
                    RETURNING id, team_name, club_name, country;");

                cmd.Parameters.AddWithValue("team_name", team.teamName);
                cmd.Parameters.AddWithValue("club_name", team.clubName);
                cmd.Parameters.AddWithValue("country", team.country);

                await using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return Results.Ok(new
                    {
                        Id = reader.GetInt32(0),
                        TeamName = reader.GetString(1),
                        ClubName = reader.GetString(2),
                        Country = reader.GetString(3)
                    });
                }

                return Results.BadRequest("Could not create team.");
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });

        app.MapGet("/api/teams", async (NpgsqlDataSource db) =>
        {
            try
            {
                await using var cmd = db.CreateCommand("SELECT id, team_name, club_name FROM teams;");
                await using var reader = await cmd.ExecuteReaderAsync();

                var teams = new List<TeamsDto>();

                while (await reader.ReadAsync())
                {
                    teams.Add(new TeamsDto
                    {
                        teamName = reader.GetString(1),
                        clubName = reader.GetString(2)
                    });
                }

                return Results.Ok(teams);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        });
        
    }
}