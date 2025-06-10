using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Net.Http.Json;

namespace ScoreZoneV2.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayerRatingController : ControllerBase
    {
        private readonly ILogger<PlayerRatingController> _logger;
        private readonly HttpClient _httpClient;
        private readonly string _pythonApiUrl = "http://localhost:8000/predict";

        public PlayerRatingController(ILogger<PlayerRatingController> logger, IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient();
            _httpClient.Timeout = TimeSpan.FromSeconds(30); // Timeout süresini artır
        }

        [HttpPost("predict")]
        public async Task<IActionResult> PredictRating([FromBody] PlayerStats stats)
        {
            try
            {
                _logger.LogInformation($"Python API'ye istek gönderiliyor: {JsonSerializer.Serialize(stats)}");

                var response = await _httpClient.PostAsJsonAsync(_pythonApiUrl, stats);
                
                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Python API hatası: {error}");
                    return StatusCode((int)response.StatusCode, error);
                }

                var result = await response.Content.ReadFromJsonAsync<PredictionResult>();
                _logger.LogInformation($"Python API'den gelen sonuç: {JsonSerializer.Serialize(result)}");
                return Ok(result);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Python API'ye bağlanılamadı");
                return StatusCode(500, "Python API'ye bağlanılamadı. Lütfen Python API'nin çalıştığından emin olun.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Rating hesaplama hatası");
                return StatusCode(500, $"Bir hata oluştu: {ex.Message}");
            }
        }
    }

    public class PlayerStats
    {
        public int minutesPlayed { get; set; }
        public int goals { get; set; }
        public int assists { get; set; }
        public int shotsTotal { get; set; }
        public int shotsOnTarget { get; set; }
        public int passes { get; set; }
        public int accuratePasses { get; set; }
        public int keyPasses { get; set; }
        public int dribbleAttempts { get; set; }
        public int successfulDribbles { get; set; }
        public int tackles { get; set; }
        public int tacklesWon { get; set; }
        public int interceptions { get; set; }
        public int clearances { get; set; }
        public int duelsWon { get; set; }
        public int totalDuels { get; set; }
        public int aerialsWon { get; set; }
        public int aerials { get; set; }
        public int possessionLost { get; set; }
        public int bigChancesCreated { get; set; }
        public int bigChancesMissed { get; set; }
        public int throughBallsWon { get; set; }
        public int redcards { get; set; }
        public int yellowcards { get; set; }
        public int yellowredCards { get; set; }
        public int errorLeadToGoal { get; set; }
        public int errorLeadToShot { get; set; }
        public int lastManTackle { get; set; }
        public int saves { get; set; }
        public int goalsConceded { get; set; }
    }

    public class PredictionResult
    {
        public float rating { get; set; }
    }
} 