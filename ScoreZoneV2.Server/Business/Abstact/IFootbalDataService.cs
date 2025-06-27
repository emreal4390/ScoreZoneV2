namespace Business.Abstract
{
    public interface IFootballDataService
    {
        
        Task<string> GetStandingsAsync(string competitionCode);

        Task<string> GetTopScorersBySeasonAsync(long seasonId);

        Task<string> GetPlayerByIdAsync(int playerId);
        Task<string> GetPlayerByIdWithIncludeAsync(int playerId, string include);

        Task<string> GetTeamByIdAsync(int teamId);
  
        Task<string> GetFixturesAsync();

        Task<string> GetSquadBySeasonAndTeamAsync(long seasonId, long teamId);

        Task<string> GetTeamFixturesAsync(int teamId);
    }
}
