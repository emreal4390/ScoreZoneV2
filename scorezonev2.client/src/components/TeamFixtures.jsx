import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import backend from '../api/backend';
import './TeamFixtures.css';

const TeamFixtures = ({ teamId }) => {
    const [expandedMatch, setExpandedMatch] = useState(null);
    const [activeEventTab, setActiveEventTab] = useState('goals');
    const [activeDetailTab, setActiveDetailTab] = useState('events');

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

    const getLineups = (fixture) => {
        const homeTeam = fixture.participants?.find(p => p.meta?.location === 'home');
        const awayTeam = fixture.participants?.find(p => p.meta?.location === 'away');
        
        return {
            home: homeTeam?.lineups || [],
            away: awayTeam?.lineups || []
        };
    };

    const getStatistics = (fixture) => {
        if (!fixture.statistics) return [];
        
        // Tekrarlanan istatistikleri önlemek için Map kullanıyoruz
        const statsMap = new Map();
        
        fixture.statistics.forEach(stat => {
            if (stat.type && stat.type.name) {
                const statName = stat.type.name;
                const statValue = stat.data?.value || 0;
                const location = stat.location;

                // Eğer bu istatistik daha önce eklenmemişse ekle
                if (!statsMap.has(statName)) {
                    statsMap.set(statName, {
                        type: statName,
                        home: location === 'home' ? statValue : 0,
                        away: location === 'away' ? statValue : 0
                    });
                } else {
                    // Eğer istatistik zaten varsa, değeri güncelle
                    const existingStat = statsMap.get(statName);
                    if (location === 'home') {
                        existingStat.home = statValue;
                    } else if (location === 'away') {
                        existingStat.away = statValue;
                    }
                    statsMap.set(statName, existingStat);
                }
            }
        });

        // Map'i array'e çevir
        return Array.from(statsMap.values());
    };

    const getWeather = (fixture) => {
        if (!fixture.weatherReport) return null;
        return {
            temperature: fixture.weatherReport.temperature || 'N/A',
            windSpeed: fixture.weatherReport.wind_speed || 'N/A',
            description: fixture.weatherReport.description || 'N/A'
        };
    };

    const getEvents = (fixture) => {
        if (!fixture.events) return [];
        
        return fixture.events.map(event => ({
            id: event.id,
            minute: event.minute,
            type: event.type?.name || 'Bilinmiyor',
            player: event.player_name,
            result: event.result,
            info: event.info,
            addition: event.addition,
            playerImage: event.player?.image_path
        }));
    };

    const getEventIcon = (eventType) => {
        switch (eventType.toLowerCase()) {
            case 'goal':
                return '⚽';
            case 'penalty':
                return '🎯';
            case 'var':
                return '📺';
            case 'yellow card':
                return '🟨';
            case 'red card':
                return '🟥';
            case 'substitution':
                return '🔄';
            default:
                return '⚪';
        }
    };

    const formatEventText = (event) => {
        let text = event.player;
        
        if (event.type.toLowerCase().includes('goal')) {
            text += ' ⚽';
        } else if (event.type.toLowerCase().includes('card')) {
            text += event.type.toLowerCase().includes('red') ? ' 🟥' : ' 🟨';
        } else if (event.type.toLowerCase().includes('substitution')) {
            text += ' 🔄';
        }

        if (event.info) {
            text += ` (${event.info})`;
        }

        return text;
    };

    const filterEvents = (events, tab) => {
        return events.filter(event => {
            const type = event.type.toLowerCase();
            switch (tab) {
                case 'goals':
                    return type.includes('goal') || type.includes('penalty');
                case 'cards':
                    return type.includes('card');
                case 'substitutions':
                    return type.includes('substitution');
                default:
                    return true;
            }
        });
    };

    if (isLoading) return <div className="team-fixtures-container">Yükleniyor...</div>;
    if (error) return <div className="team-fixtures-container">Hata: {error.message}</div>;
    if (!fixtures || fixtures.length === 0) return <div className="team-fixtures-container">Bu tarih aralığında maç bulunamadı.</div>;

    return (
        <div className="team-fixtures-container">
            <h2 className="team-fixtures-title">Maçlar</h2>
            <div className="team-fixtures-list">
                {fixtures.map((fixture) => {
                    const homeTeam = fixture.participants?.find(p => p.meta?.location === 'home');
                    const awayTeam = fixture.participants?.find(p => p.meta?.location === 'away');
                    const score = getScore(fixture);
                    const resultColor = getResultColor(fixture, parseInt(teamId));
                    const isExpanded = expandedMatch === fixture.id;
                    const statistics = getStatistics(fixture);
                    const weather = getWeather(fixture);
                    const events = getEvents(fixture);
                    
                    return (
                        <div key={fixture.id} className={`team-fixture-row ${resultColor}`}>
                            <div className="team-fixture-date">
                                {new Date(fixture.starting_at).toLocaleDateString('tr-TR', {
                                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                })}
                            </div>
                            <div className="team-fixture-teams" onClick={() => setExpandedMatch(isExpanded ? null : fixture.id)}>
                                <div className="team-container">
                                    <img src={homeTeam?.image_path} alt={homeTeam?.name} className="team-logo" />
                                    <span className="team-fixture-team">{homeTeam?.name}</span>
                                </div>
                                <span className="team-fixture-vs">{score?.text || '-'}</span>
                                <div className="team-container">
                                    <span className="team-fixture-team">{awayTeam?.name}</span>
                                    <img src={awayTeam?.image_path} alt={awayTeam?.name} className="team-logo" />
                                </div>
                            </div>
                            <div className="team-fixture-venue">
                                <span className="venue-icon">🏟️</span>
                                {fixture.venue?.name}
                            </div>
                            
                            {isExpanded && (
                                <div className="match-details">
                                    <div className="match-details-tabs">
                                        <div 
                                            className={`match-details-tab ${activeDetailTab === 'events' ? 'active' : ''}`}
                                            onClick={() => setActiveDetailTab('events')}
                                        >
                                            Maç Olayları
                                        </div>
                                        <div 
                                            className={`match-details-tab ${activeDetailTab === 'stats' ? 'active' : ''}`}
                                            onClick={() => setActiveDetailTab('stats')}
                                        >
                                            İstatistikler
                                        </div>
                                    </div>

                                    {activeDetailTab === 'events' && events.length > 0 && (
                                        <div className="match-details-section">
                                            <div className="events-tabs">
                                                <div 
                                                    className={`event-tab ${activeEventTab === 'goals' ? 'active' : ''}`}
                                                    onClick={() => setActiveEventTab('goals')}
                                                >
                                                    Goller
                                                </div>
                                                <div 
                                                    className={`event-tab ${activeEventTab === 'cards' ? 'active' : ''}`}
                                                    onClick={() => setActiveEventTab('cards')}
                                                >
                                                    Kartlar
                                                </div>
                                                <div 
                                                    className={`event-tab ${activeEventTab === 'substitutions' ? 'active' : ''}`}
                                                    onClick={() => setActiveEventTab('substitutions')}
                                                >
                                                    Değişiklikler
                                                </div>
                                            </div>
                                            <div className="events-timeline">
                                                {filterEvents(events, activeEventTab).map((event) => (
                                                    <div key={event.id} className="event-item">
                                                        <div className="event-time">{event.minute}'</div>
                                                        <div className="event-details">
                                                            {event.playerImage && (
                                                                <img src={event.playerImage} alt={event.player} className="event-player-image" />
                                                            )}
                                                            <span>{formatEventText(event)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeDetailTab === 'stats' && statistics.length > 0 && (
                                        <div className="match-details-section">
                                            <div className="statistics">
                                                {statistics.map((stat, index) => (
                                                    <div key={index} className="stat-row">
                                                        <span className="stat-value">{stat.home}</span>
                                                        <span className="stat-name" title={stat.type}>{stat.type}</span>
                                                        <span className="stat-value">{stat.away}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {weather && (
                                        <div className="match-details-section">
                                            <h3>Hava Durumu</h3>
                                            <div className="weather-info">
                                                <span>🌡️ {weather.temperature}°C</span>
                                                <span>💨 {weather.windSpeed} km/s</span>
                                                <span>☁️ {weather.description}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamFixtures; 