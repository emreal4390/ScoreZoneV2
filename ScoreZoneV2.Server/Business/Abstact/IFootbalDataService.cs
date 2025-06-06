namespace Business.Abstract
{
    public interface IFootballDataService
    {
        
        Task<string> GetStandingsAsync(string competitionCode);

        Task<string> GetTopScorersAsync(string competitionCode);
        Task<string> GetTopScorersByStageAsync(long stageId);

        Task<string> GetPlayerByIdAsync(int playerId);

        Task<string> GetTeamByIdAsync(int teamId);
  
        Task<string> GetFixturesAsync();

        Task<string> GetSquadBySeasonAndTeamAsync(long seasonId, long teamId);

        Task<string> GetTeamFixturesAsync(int teamId);
    }
}
