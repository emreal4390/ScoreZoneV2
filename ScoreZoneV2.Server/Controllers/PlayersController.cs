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

    [HttpGet("topscorers/{seasonId}")]
    public async Task<IActionResult> GetTopScorers(string seasonId)
    {
        var result = await _footballService.GetTopScorersAsync(seasonId);
        return Content(result, "application/json");
    }
}
