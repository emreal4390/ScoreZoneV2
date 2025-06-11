using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using System.Linq;
using System.Xml.Linq;

namespace ScoreZoneV2.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly HttpClient _http;
        private readonly IHttpClientFactory _httpClientFactory;

        public NewsController(IHttpClientFactory httpClientFactory)
        {
            _http = httpClientFactory.CreateClient();
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var leagues = new[] { "eng.1", "ger.1", "esp.1", "ita.1", "fra.1" };
            var allArticles = new List<object>();

            foreach (var league in leagues)
            {
                try
                {
                    var apiUrl = $"https://site.api.espn.com/apis/site/v2/sports/soccer/{league}/news";
                    var response = await _http.GetAsync(apiUrl);
                    var content = await response.Content.ReadAsStringAsync();
                    var jsonDoc = JsonDocument.Parse(content);
                    
                    if (jsonDoc.RootElement.TryGetProperty("articles", out var articles))
                    {
                        foreach (var article in articles.EnumerateArray())
                        {
                            allArticles.Add(new
                            {
                                headline = article.GetProperty("headline").GetString(),
                                description = article.GetProperty("description").GetString(),
                                links = article.GetProperty("links").GetProperty("web").GetProperty("href").GetString(),
                                images = article.GetProperty("images").EnumerateArray()
                                    .Select(img => new { url = img.GetProperty("url").GetString() })
                                    .ToList(),
                                league = league
                            });
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Hata durumunda diğer liglere devam et
                    continue;
                }
            }

            // Haberleri karıştır ve en son 20 haberini döndür
            var random = new Random();
            var shuffledArticles = allArticles.OrderBy(x => random.Next()).Take(20).ToList();

            return Ok(new { articles = shuffledArticles });
        }

        [HttpGet("transfermarkt")]
        public async Task<IActionResult> GetTransfermarktNews()
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var response = await client.GetStringAsync("https://www.transfermarkt.com.tr/rss/news");
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Haberler alınırken bir hata oluştu: {ex.Message}");
            }
        }

        [HttpGet("foxsports")]
        public async Task<IActionResult> GetFoxSportsNews()
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var response = await client.GetStringAsync("https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPU244mlTDK1i&size=30&tags=fs/soccer,soccer/epl/league/1,soccer/mls/league/5,soccer/ucl/league/7,soccer/europa/league/8,soccer/wc/league/12,soccer/euro/league/13,soccer/wwc/league/14,soccer/nwsl/league/20,soccer/cwc/league/26,soccer/gold_cup/league/32,soccer/unl/league/67");
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Haberler alınırken bir hata oluştu: {ex.Message}");
            }
        }
    }
}
