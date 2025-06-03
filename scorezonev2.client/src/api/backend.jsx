import axios from 'axios';

const backend = axios.create({
    baseURL: '/api', // ASP.NET Core backend'e gidecek
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getTopScorers = (stageId) => backend.get(`/matches/topscorers/${stageId}`);
export const getSquad = (seasonId, teamId) => backend.get(`/matches/squad/${seasonId}/${teamId}?include=player;position`);

export default backend;
