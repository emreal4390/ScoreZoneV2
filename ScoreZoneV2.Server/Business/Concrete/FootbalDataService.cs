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

        public async Task<string> GetCompetitionsAsync()
        {
            var url = AddToken($"{BaseUrl}/leagues");
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetStandingsAsync(string seasonId)
        {
            var url = AddToken($"{BaseUrl}/standings/seasons/{seasonId}");
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }



        public async Task<string> GetTopScorersAsync(string seasonId)
        {
            var url = AddToken($"{BaseUrl}/topscorers/season/{seasonId}?include=player,team");
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


        public async Task<string> GetTeamMatchesAsync(int teamId)
        {
            var url = AddToken($"{BaseUrl}/teams/{teamId}/fixtures?include=fixture");
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetLeagueMatchesAsync(string seasonId)
        {
            var url = AddToken($"{BaseUrl}/fixtures/season/{seasonId}?include=participants,venue");
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetRecentMatchesAsync(string seasonId)
        {
            var url = AddToken($"{BaseUrl}/fixtures/season/{seasonId}?filters=finished&include=participants,venue");
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
    }
}