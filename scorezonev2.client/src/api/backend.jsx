import axios from 'axios';

const backend = axios.create({
    baseURL: '/api', // ASP.NET Core backend'e gidecek
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getTopScorersBySeason = (seasonId) => backend.get(`/matches/topscorers-season/${seasonId}`);
export const getSquad = (seasonId, teamId) => backend.get(`/matches/squad/${seasonId}/${teamId}?include=player.nationality`);

export default backend;
