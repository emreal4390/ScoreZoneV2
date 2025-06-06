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

    [HttpGet("team/{teamId}/fixtures")]
    public async Task<IActionResult> GetTeamFixtures(int teamId)
    {
        var result = await _footballService.GetTeamFixturesAsync(teamId);
        return Content(result, "application/json");
    }
}
