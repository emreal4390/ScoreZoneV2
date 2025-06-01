using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using System.Linq;

namespace ScoreZoneV2.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly HttpClient _http;

        public NewsController(IHttpClientFactory httpClientFactory)
        {
            _http = httpClientFactory.CreateClient();
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
    }
}
