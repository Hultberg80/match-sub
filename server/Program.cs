using server.DTOs;
using System.Text.Json;
using System.Text.Json.Serialization;
using Npgsql;
using Microsoft.AspNetCore.Http.Json;
using server.Endpoints;

namespace server;


    public class Program // Deklarerar huvudklassen Program
    {
        public static void Main(string[] args) // Deklarerar huvudmetoden Main
        {
            var builder = WebApplication.CreateBuilder(args); // Skapar en WebApplicationBuilder
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            // Om anslutningssträngen inte finns i appsettings.json, använd miljövariabeln
            if (string.IsNullOrEmpty(connectionString))
            {
                connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
            }

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Connection string is not set.");
            }

            NpgsqlDataSource postgresdb = NpgsqlDataSource.Create(connectionString);

            builder.Services.AddSingleton<NpgsqlDataSource>(postgresdb);

            builder.Services.AddDistributedMemoryCache(); // Required for session state
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30); // Set session timeout
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            // "DefaultConnection": "Host=45.10.162.204;Port=5438;Database=test_db;Username=postgres;Password=_FrozenPresidentSmacks!;"



            var app = builder.Build();
            
            app.UseSession(); 
            
            app.MapPlayersEndpoints(); // Registrerar spelare-endpoints
            app.MapTeamsEndpoints(); // Registrerar lag-endpoints
            app.MapMatchEndpoints(); // Registrerar match-endpoints
            app.MapStatsEndpoints(); // Registrerar statistik-endpoints
            
            app.Run(); // Startar webbservern
        }
    }
