using Business.Abstract;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PlayersController : ControllerBase
{
    private readonly IFootballDataService _footballService;

    public PlayersController(IFootballDataService footballService)
    {
        _footballService = footballService;
    }

    [HttpGet("{playerId}")]
    public async Task<IActionResult> GetPlayerById(int playerId)
    {
        var result = await _footballService.GetPlayerByIdAsync(playerId);
        return Content(result, "application/json");
    }

    /// <summary>
    /// Oyuncu detaylarını, istatistiklerini ve kupalarını detaylı şekilde döndürür.
    /// </summary>
    /// <param name="playerId">Oyuncu ID</param>
    /// <returns>Oyuncu detay JSON</returns>
    [HttpGet("details/{playerId}")]
    public async Task<IActionResult> GetPlayerDetails(int playerId)
    {
        // Sportmonks API'de include ile detaylı veri çekiyoruz
        string include = "trophies.league;trophies.season;trophies.trophy;trophies.team;teams.team;statistics.details.type;statistics.team;statistics.season.league;latest.fixture.participants;latest.fixture.league;latest.fixture.scores;latest.details.type;nationality;detailedPosition;metadata.type";
        var result = await _footballService.GetPlayerByIdWithIncludeAsync(playerId, include);
        return Content(result, "application/json");
    }
}
