import React from 'react';
import { useQuery } from '@tanstack/react-query';
import backend from '../api/backend';
import './Fixtures.css';

const Fixtures = ({ limit = 9 }) => {
    const { data: fixtures = [], isLoading, error } = useQuery({
        queryKey: ['fixtures', limit],
        queryFn: async () => {
            const res = await backend.get('/matches/fixtures');
            console.log('API yanıtı:', res.data);
            
            if (!res.data || !res.data.data) {
                console.error('API yanıtında data bulunamadı:', res.data);
                return [];
            }
            
            const fixtures = res.data.data;
            console.log('Fikstür sayısı:', fixtures.length);
            return fixtures.slice(0, limit);
        }
    });

    const getScore = (fixture) => {
        if (!fixture.scores || fixture.scores.length === 0) return null;
        
        const currentScores = fixture.scores.filter(score => score.description === 'CURRENT');
        if (currentScores.length === 0) return null;

        const homeScore = currentScores.find(score => score.score.participant === 'home')?.score.goals || 0;
        const awayScore = currentScores.find(score => score.score.participant === 'away')?.score.goals || 0;
        
        return `${homeScore}-${awayScore}`;
    };

    if (isLoading) return <div>Yükleniyor...</div>;
    if (error) return <div>Hata: {error.message}</div>;
    if (!fixtures || fixtures.length === 0) return <div>Bu tarih aralığında maç bulunamadı.</div>;

    return (
        <div className="fixtures-list-modern">
            <h2 className="fixtures-title">Son Maçlar</h2>
            {fixtures.map((fixture) => {
                const [homeTeam, awayTeam] = fixture.name.split(' vs ');
                const score = getScore(fixture);
                
                return (
                    <div key={fixture.id} className="fixture-row">
                        <div className="fixture-row-date">
                            {new Date(fixture.starting_at).toLocaleDateString('tr-TR', {
                                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                            })}
                        </div>
                        <div className="fixture-row-teams">
                            <div className="team-container">
                                <span className="fixture-row-team">{homeTeam}</span>
                            </div>
                            <span className="fixture-row-vs">{score || '-'}</span>
                            <div className="team-container">
                                <span className="fixture-row-team">{awayTeam}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Fixtures; 