using Microsoft.EntityFrameworkCore;
using server;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .WithOrigins("http://localhost:3000")); // Adjust for your React app's URL

// Player endpoints
app.MapGet("/api/players", async (ApplicationDbContext db) =>
{
    var players = await db.Players
        .Include(p => p.PlayerMatches)
        .Include(p => p.Statistics)
        .ToListAsync();
    return Results.Ok(players);
});

app.MapPost("/api/players", async (ApplicationDbContext db, Player player) =>
{
    db.Players.Add(player);
    await db.SaveChangesAsync();
    return Results.Created($"/api/players/{player.Id}", player);
});

// Match endpoints
app.MapPost("/api/matches", async (ApplicationDbContext db, MatchStartDto dto) =>
{
    var match = new Match
    {
        Date = DateTime.Now,
        Opponent = dto.Opponent,
        PlayerMatches = dto.PlayerIds.Select(pid => new PlayerMatch
        {
            PlayerId = pid,
            PlayTimeFirstHalf = 0,
            PlayTimeSecondHalf = 0
        }).ToList()
    };

    db.Matches.Add(match);
    await db.SaveChangesAsync();
    return Results.Created($"/api/matches/{match.Id}", match);
});

// Statistics endpoints
app.MapPost("/api/statistics", async (ApplicationDbContext db, StatisticDto dto) =>
{
    var statistic = new Statistics
    {
        PlayerMatchId = dto.PlayerMatchId,
        Type = Enum.Parse<StatisticType>(dto.StatisticType),
        Period = dto.Period,
        TimeStamp = DateTime.Now
    };

    db.Statistics.Add(statistic);
    await db.SaveChangesAsync();
    return Results.Ok();
});

// Player time update endpoint
app.MapPut("/api/playertime/{id}", async (ApplicationDbContext db, int id, PlayerTimeUpdateDto dto) =>
{
    var playerMatch = await db.PlayerMatches.FindAsync(id);
    if (playerMatch == null) return Results.NotFound();

    if (dto.Period == 1)
        playerMatch.PlayTimeFirstHalf = dto.Time;
    else
        playerMatch.PlayTimeSecondHalf = dto.Time;

    await db.SaveChangesAsync();
    return Results.Ok();
});

app.Run();