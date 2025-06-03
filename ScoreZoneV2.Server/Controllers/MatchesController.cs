using Business.Abstract;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class MatchesController : ControllerBase
{
    private readonly IFootballDataService _footballService;

    public MatchesController(IFootballDataService footballService)
    {
        _footballService = footballService;
    }

    [HttpGet("fixtures")]
    public async Task<IActionResult> GetFixtures()
    {
        var result = await _footballService.GetFixturesAsync();
        return Content(result, "application/json");
    }

    [HttpGet("league/{seasonId}")]
    public async Task<IActionResult> GetLeagueMatches(string seasonId)
    {
        var result = await _footballService.GetLeagueMatchesAsync(seasonId);
        return Content(result, "application/json");
    }

    [HttpGet("recent/{seasonId}")]
    public async Task<IActionResult> GetRecentMatches(string seasonId)
    {
        var result = await _footballService.GetRecentMatchesAsync(seasonId);
        return Content(result, "application/json");
    }

    [HttpGet("team/{teamId}")]
    public async Task<IActionResult> GetTeamMatches(int teamId)
    {
        var result = await _footballService.GetTeamMatchesAsync(teamId);
        return Content(result, "application/json");
    }

    [HttpGet("topscorers/{stageId}")]
    public async Task<IActionResult> GetTopScorers(long stageId)
    {
        var result = await _footballService.GetTopScorersByStageAsync(stageId);
        return Content(result, "application/json");
    }

    [HttpGet("squad/{seasonId}/{teamId}")]
    public async Task<IActionResult> GetSquad(long seasonId, long teamId)
    {
        var result = await _footballService.GetSquadBySeasonAndTeamAsync(seasonId, teamId);
        return Content(result, "application/json");
    }
}
