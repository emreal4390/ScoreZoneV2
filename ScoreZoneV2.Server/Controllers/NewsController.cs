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
        private const string NEWS_API_KEY = "841d6946d3d349249d4790f2a9650fbb";

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
                   
                    continue;
                }
            }

           
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

        [HttpGet("sportsnews")]
        public async Task<IActionResult> GetSportsNews()
        {
            try
            {
                var apiUrl = $"https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey={NEWS_API_KEY}";
                
                var request = new HttpRequestMessage(HttpMethod.Get, apiUrl);
                request.Headers.Add("User-Agent", "ScoreZoneV2/1.0");
                
                var response = await _http.SendAsync(request);
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return StatusCode(500, new { 
                        status = "error", 
                        message = $"NewsAPI hatası: {response.StatusCode} - {errorContent}" 
                    });
                }
                
                var content = await response.Content.ReadAsStringAsync();
                var newsData = JsonSerializer.Deserialize<JsonElement>(content);
                
                
                if (newsData.TryGetProperty("articles", out var articles))
                {
                    var filteredArticles = new List<object>();
                    int count = 0;
                    
                    foreach (var article in articles.EnumerateArray())
                    {
                        if (count >= 5) break;
                        
                        if (article.TryGetProperty("urlToImage", out var imageUrl) && 
                            !string.IsNullOrEmpty(imageUrl.GetString()) &&
                            article.TryGetProperty("title", out var title) &&
                            !string.IsNullOrEmpty(title.GetString()) &&
                            article.TryGetProperty("description", out var description) &&
                            !string.IsNullOrEmpty(description.GetString()))
                        {
                            filteredArticles.Add(new
                            {
                                source = new
                                {
                                    name = article.TryGetProperty("source", out var source) && 
                                           source.TryGetProperty("name", out var sourceName) 
                                           ? sourceName.GetString() : "Bilinmeyen Kaynak"
                                },
                                author = article.TryGetProperty("author", out var author) 
                                        ? author.GetString() : null,
                                title = title.GetString(),
                                description = description.GetString(),
                                articleUrl = article.TryGetProperty("url", out var articleUrlProp) 
                                     ? articleUrlProp.GetString() : "",
                                urlToImage = imageUrl.GetString(),
                                publishedAt = article.TryGetProperty("publishedAt", out var publishedAt) 
                                             ? publishedAt.GetString() : ""
                            });
                            count++;
                        }
                    }
                    
                    return Ok(new { 
                        status = "ok", 
                        totalResults = filteredArticles.Count,
                        articles = filteredArticles 
                    });
                }
                
                return Ok(new { 
                    status = "ok", 
                    totalResults = 0,
                    articles = new List<object>() 
                });
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, new { 
                    status = "error", 
                    message = "NewsAPI'ye bağlanılamadı: " + ex.Message 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    status = "error", 
                    message = "Haberler alınırken hata oluştu: " + ex.Message 
                });
            }
        }
    }
}
