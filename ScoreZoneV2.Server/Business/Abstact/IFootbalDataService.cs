

namespace Business.Abstract
{
    public interface IFootballDataService
    {
        Task<string> GetCompetitionsAsync();
        Task<string> GetStandingsAsync(string competitionCode);

        Task<string> GetTopScorersAsync(string competitionCode);

        Task<string> GetPlayerByIdAsync(int playerId);

        Task<string> GetTeamByIdAsync(int teamId);
        Task<string> GetTeamMatchesAsync(int teamId);

        Task<string> GetLeagueMatchesAsync(string competitionCode);

        Task<string> GetRecentMatchesAsync(string competitionCode);



    }
}
