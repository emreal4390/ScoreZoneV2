using Business.Abstract;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

[ApiController]
[Route("api/leagues")]
public class LeaguesController : ControllerBase
{
    private readonly IFootballDataService _footballService;

    public LeaguesController(IFootballDataService footballService)
    {
        _footballService = footballService;
    }

    [HttpGet("standings/{seasonId}")]
    public async Task<IActionResult> GetStandings(string seasonId)
    {
        try
        {
            var rawJson = await _footballService.GetStandingsAsync(seasonId);
            var jsonDoc = JsonDocument.Parse(rawJson);
            var standings = jsonDoc.RootElement.GetProperty("data");

            var resultList = new List<object>();

            foreach (var item in standings.EnumerateArray())
            {
                if (!item.TryGetProperty("participant_id", out var participantProp))
                    continue;

                int participantId = participantProp.GetInt32();

                string teamJson;
                try
                {
                    teamJson = await _footballService.GetTeamByIdAsync(participantId);
                }
                catch
                {
                    continue; // takım çekilemezse atla
                }

                var teamData = JsonDocument.Parse(teamJson).RootElement.GetProperty("data");

                resultList.Add(new
                {
                    id = participantId,
                    position = item.GetProperty("position").GetInt32(),
                    points = item.GetProperty("points").GetInt32(),
                    team = new
                    {
                        name = teamData.GetProperty("name").GetString(),
                        logo = teamData.GetProperty("image_path").GetString()
                    }
                });
            }

            return Ok(new { data = resultList });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Sunucu hatası: " + ex.Message);
        }
    }

}
