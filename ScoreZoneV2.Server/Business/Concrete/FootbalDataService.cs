using Business.Abstract;

namespace Business.Concrete
{
    public class FootballDataService : IFootballDataService
    {
        private readonly HttpClient _httpClient;
        private const string ApiToken = "HhhIdylNERmhlawXrkYqh0U9he8vEEejIX62619qELoOJETnWfDzsR3ahTGF";
        private const string BaseUrl = "https://api.sportmonks.com/v3/football";

        public FootballDataService()
        {
            _httpClient = new HttpClient();
        }

        private string AddToken(string url)
        {
            return url.Contains('?') ? $"{url}&api_token={ApiToken}" : $"{url}?api_token={ApiToken}";
        }

        public async Task<string> GetFixturesAsync()
        {
            try
            {
                var startDate = "2025-05-29";
                var endDate = "2025-06-03";
                var url = AddToken($"{BaseUrl}/fixtures/between/{startDate}/{endDate}?include=scores");
                Console.WriteLine($"Fikstür API isteği: {url}");

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();
                
                var content = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"API yanıtı: {content}");
                
                return content;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Fikstür çekme hatası: {ex.Message}");
                return "{}";
            }
        }

        public async Task<string> GetStandingsAsync(string seasonId)
        {
            var url = AddToken($"{BaseUrl}/standings/seasons/{seasonId}");
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetPlayerByIdAsync(int playerId)
        {
            var url = AddToken($"{BaseUrl}/players/{playerId}");
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetTeamByIdAsync(int teamId)
        {
            try
            {
                var url = AddToken($"{BaseUrl}/teams/{teamId}");
                Console.WriteLine(">>> Takım verisi isteniyor: " + url);

                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Team API Hatası ({teamId}): {response.StatusCode}");
                    return "{}"; // boş json dön, null referans hatası önlenir
                }

                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Team çekme hatası (teamId={teamId}): " + ex.Message);
                return "{}";
            }
        }

        public async Task<string> GetTopScorersBySeasonAsync(long seasonId)
        {
            var url = AddToken($"{BaseUrl}/topscorers/seasons/{seasonId}?include=player.nationality;player.position;participant;type;season.league&filters=seasontopscorerTypes:208");
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetSquadBySeasonAndTeamAsync(long seasonId, long teamId)
        {
            var url = AddToken($"{BaseUrl}/squads/seasons/{seasonId}/teams/{teamId}?include=player.nationality");
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetTeamFixturesAsync(int teamId)
        {
            try
            {
                var startDate = "2025-04-01";
                var endDate = "2025-06-01";
                var url = AddToken($"{BaseUrl}/fixtures/between/{startDate}/{endDate}/{teamId}?include=participants;league;venue;state;scores;events.type;events.period;events.player;statistics.type;sidelined.sideline.player;sidelined.sideline.type;weatherReport;lineups.player;lineups.type;lineups.details.type;metadata.type;coaches");
                Console.WriteLine($"Takım Fikstür API isteği: {url}");

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();
                
                var content = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"API yanıtı: {content}");
                
                return content;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Takım Fikstür çekme hatası: {ex.Message}");
                return "{}";
            }
        }

        public async Task<string> GetPlayerByIdWithIncludeAsync(int playerId, string include)
        {
            var url = AddToken($"{BaseUrl}/players/{playerId}?include={include}");
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
    }
}