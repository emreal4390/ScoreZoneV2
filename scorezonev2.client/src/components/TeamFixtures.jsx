import React from 'react';
import { useQuery } from '@tanstack/react-query';
import backend from '../api/backend';
import './TeamFixtures.css';

const TeamFixtures = ({ teamId }) => {
    const { data: fixtures = [], isLoading, error } = useQuery({
        queryKey: ['teamFixtures', teamId],
        queryFn: async () => {
            const res = await backend.get(`/matches/team/${teamId}/fixtures`);
            return res.data.data || [];
        }
    });

    const getScore = (fixture) => {
        if (!fixture.scores || fixture.scores.length === 0) return null;
        
        const currentScores = fixture.scores.filter(score => score.description === 'CURRENT');
        if (currentScores.length === 0) return null;

        const homeScore = currentScores.find(score => score.score.participant === 'home')?.score.goals || 0;
        const awayScore = currentScores.find(score => score.score.participant === 'away')?.score.goals || 0;
        
        return {
            home: homeScore,
            away: awayScore,
            text: `${homeScore}-${awayScore}`
        };
    };

    const getResultColor = (fixture, teamId) => {
        const score = getScore(fixture);
        if (!score) return 'neutral';

        const isHomeTeam = fixture.participants?.find(p => p.meta?.location === 'home')?.id === teamId;
        const teamScore = isHomeTeam ? score.home : score.away;
        const opponentScore = isHomeTeam ? score.away : score.home;

        if (teamScore > opponentScore) return 'win';
        if (teamScore === opponentScore) return 'draw';
        return 'loss';
    };

    if (isLoading) return <div className="team-fixtures-container">Yükleniyor...</div>;
    if (error) return <div className="team-fixtures-container">Hata: {error.message}</div>;
    if (!fixtures || fixtures.length === 0) return <div className="team-fixtures-container">Bu tarih aralığında maç bulunamadı.</div>;

    return (
        <div className="team-fixtures-container">
            <h2 className="team-fixtures-title">Maçlar</h2>
            <div className="team-fixtures-list">
                {fixtures.map((fixture) => {
                    const homeTeam = fixture.participants?.find(p => p.meta?.location === 'home')?.name;
                    const awayTeam = fixture.participants?.find(p => p.meta?.location === 'away')?.name;
                    const score = getScore(fixture);
                    const resultColor = getResultColor(fixture, parseInt(teamId));
                    
                    return (
                        <div key={fixture.id} className={`team-fixture-row ${resultColor}`}>
                            <div className="team-fixture-date">
                                {new Date(fixture.starting_at).toLocaleDateString('tr-TR', {
                                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                })}
                            </div>
                            <div className="team-fixture-teams">
                                <div className="team-container">
                                    <span className="team-fixture-team">{homeTeam}</span>
                                </div>
                                <span className="team-fixture-vs">{score?.text || '-'}</span>
                                <div className="team-container">
                                    <span className="team-fixture-team">{awayTeam}</span>
                                </div>
                            </div>
                            <div className="team-fixture-venue">
                                <span className="venue-icon">🏟️</span>
                                {fixture.venue?.name}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamFixtures; 