import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import backend from '../api/backend';
import './TeamFixtures.css';

const TeamFixtures = ({ teamId }) => {
    const [expandedMatch, setExpandedMatch] = useState(null);
    const [activeEventTab, setActiveEventTab] = useState('goals');
    const [activeDetailTab, setActiveDetailTab] = useState('lineups');
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const { data: fixtures = [], isLoading, error } = useQuery({
        queryKey: ['teamFixtures', teamId],
        queryFn: async () => {
            const res = await backend.get(`/matches/team/${teamId}/fixtures`);
            return res.data.data || [];
        }
    });

    useEffect(() => {
        setSelectedPlayer(null);
    }, [expandedMatch]);

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

    const getLineups = (fixture) => {
        const allLineups = fixture.lineups || [];
        const homeTeam = fixture.participants?.find(p => p.meta?.location === 'home');
        const awayTeam = fixture.participants?.find(p => p.meta?.location === 'away');
        const homeLineups = allLineups.filter(lu => lu.team_id === homeTeam?.id && lu.type?.code?.toLowerCase() === 'lineup');
        const awayLineups = allLineups.filter(lu => lu.team_id === awayTeam?.id && lu.type?.code?.toLowerCase() === 'lineup');
        return {
            home: {
                team: homeTeam,
                lineups: homeLineups,
                coach: homeTeam?.coaches?.[0]?.name || 'Bilinmiyor'
            },
            away: {
                team: awayTeam,
                lineups: awayLineups,
                coach: awayTeam?.coaches?.[0]?.name || 'Bilinmiyor'
            }
        };
    };

    const getPlayerStats = (player) => {
        if (!player.details) return [];
        
        return player.details.map(detail => ({
            name: detail.type.name,
            value: detail.data.value
        }));
    };

    const getPlayerRating = (player) => {
        if (player.rating) return player.rating;
        if (player.details && Array.isArray(player.details)) {
            const found = player.details.find(d => d.type && d.type.name && d.type.name.toLowerCase() === 'rating');
            if (found && found.data && found.data.value) return found.data.value;
        }
        return null;
    };

    const getRatingClass = (rating) => {
        if (rating < 6) return 'rating-red';
        if (rating < 7) return 'rating-yellow';
        if (rating < 8) return 'rating-green';
        return 'rating-blue';
    };

    const PlayerStatsPopup = ({ player, onClose }) => {
        if (!player) return null;

        const stats = getPlayerStats(player);
        const isCaptain = stats.some(stat => stat.name === 'Captain' && stat.value === true);

        return (
            <>
                <div className="popup-overlay" onClick={onClose} />
                <div className="player-stats-popup">
                    <button className="close-stats-button" onClick={onClose}>×</button>
                    <div className="player-stats-header">
                        <img 
                            src={player.player?.image_path} 
                            alt={player.player?.name} 
                            className="player-stats-image"
                        />
                        <div className="player-stats-info">
                            <h3 className="player-stats-name">
                                {player.player?.name}
                                {isCaptain && ' (C)'}
                            </h3>
                            <div className="player-stats-position">
                                {player.details?.find(d => d.type.name === 'Position')?.type.name || 'Pozisyon Bilgisi Yok'}
                            </div>
                        </div>
                    </div>
                    <div className="player-stats-content">
                        {stats.map((stat, index) => (
                            stat.name !== 'Captain' && (
                                <div key={index} className="stat-item">
                                    <span className="stat-label">{stat.name}</span>
                                    <span className="stat-value">{stat.value}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </>
        );
    };

    const FORMATION_MAP = {
        // row: {col: [x, y]}
        1: {1: [0.5, 0.93]}, // Kaleci
        2: {1: [0.15, 0.78], 2: [0.32, 0.82], 3: [0.68, 0.82], 4: [0.85, 0.78]}, // Bekler ve stoperler
        3: {1: [0.32, 0.65], 2: [0.68, 0.65]}, // Defansif ortasaha
        4: {1: [0.18, 0.45], 2: [0.5, 0.38], 3: [0.82, 0.45]}, // Kanatlar ve 10 numara
        5: {1: [0.5, 0.18]}, // Forvet
    };

    const PitchPlayers = ({ lineups }) => {
        // Satır ve pozisyonları bul
        const parsed = lineups.map(player => {
            const [row, col] = (player.formation_field || '').split(':').map(Number);
            return { ...player, _row: row, _col: col };
        });
        // Satır numaralarına göre grupla
        const rowMap = {};
        parsed.forEach(player => {
            if (!rowMap[player._row]) rowMap[player._row] = [];
            rowMap[player._row].push(player);
        });
        const sortedRows = Object.keys(rowMap).map(Number).sort((a, b) => a - b);
        // Y ekseni: 0.10-0.90 arası, satır numarasına göre yukarıdan aşağıya
        const yStart = 0.10;
        const yEnd = 0.90;
        // X ekseni: 0.12-0.88 arası, satır içi pozisyona göre (daha geniş aralık)
        const xStart = 0.12;
        const xEnd = 0.88;
        // Her satır için X pozisyonlarını hesapla
        let prevRowXs = null;
        const rowXs = {};
        sortedRows.forEach((rowIdx, rowIndex) => {
            const players = rowMap[rowIdx].sort((a, b) => a._col - b._col);
            if (rowIndex === 1) {
                rowXs[rowIdx] = players.map((_, idx) => xStart + ((xEnd - xStart) / (players.length - 1 || 1)) * idx);
            } else if (rowIndex === 0 && players.length === 1 && sortedRows.length > 1) {
                const stoperXs = rowXs[sortedRows[1]];
                if (stoperXs && stoperXs.length) {
                    rowXs[rowIdx] = [stoperXs.reduce((a, b) => a + b, 0) / stoperXs.length];
                } else {
                    rowXs[rowIdx] = [0.5];
                }
            } else if (players.length === 1) {
                if (rowXs[sortedRows[0]] && rowXs[sortedRows[0]].length) {
                    rowXs[rowIdx] = [rowXs[sortedRows[0]][0]];
                } else {
                    rowXs[rowIdx] = [0.5];
                }
            } else if (players.length === 2 && prevRowXs && prevRowXs.length === 2) {
                rowXs[rowIdx] = [prevRowXs[0], prevRowXs[1]];
            } else if (players.length === 3 && prevRowXs && prevRowXs.length === 3) {
                rowXs[rowIdx] = [prevRowXs[0], prevRowXs[1], prevRowXs[2]];
            } else {
                rowXs[rowIdx] = players.map((_, idx) => xStart + ((xEnd - xStart) / (players.length - 1 || 1)) * idx);
            }
            prevRowXs = rowXs[rowIdx];
        });
        return (
            <>
                {sortedRows.map((rowIdx, rowIndex) => {
                    const players = rowMap[rowIdx].sort((a, b) => a._col - b._col);
                    const y = yStart + ((yEnd - yStart) / (sortedRows.length - 1 || 1)) * rowIndex;
                    return players.map((player, idx) => {
                        const x = rowXs[rowIdx][idx];
                        const rating = getPlayerRating(player);
                        const ratingClass = rating ? getRatingClass(Number(rating)) : '';
                        return (
                            <div
                                key={player.id}
                                className="player-bubble"
                                style={{
                                    left: `${x * 100}%`,
                                    top: `${y * 100}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                                onClick={() => setSelectedPlayer(player)}
                            >
                                {player.player?.image_path && (
                                    <img src={player.player.image_path} alt={player.player?.display_name || player.player?.name || player.player_name} />
                                )}
                                <div className="player-row">
                                    <span className="player-number">{player.jersey_number}</span>
                                    <span className="player-name">{player.player?.display_name || player.player?.name || player.player_name}</span>
                                </div>
                                {rating && (
                                    <span className={`player-rating ${ratingClass}`}>{rating}</span>
                                )}
                            </div>
                        );
                    });
                })}
            </>
        );
    };

    const FormationView = ({ lineups, team }) => {
        const formationRows = getFormationMap(lineups.home.lineups);

        return (
            <div className="formation-container">
                {Object.entries(formationRows).map(([row, players]) => (
                    <div key={row} className="formation-row">
                        {players.map((player) => (
                            <div 
                                key={player.id} 
                                className="formation-player"
                                onClick={() => setSelectedPlayer(player)}
                            >
                                <span className="player-number">{player.jersey_number}</span>
                                <span className="player-name">{player.player?.name}</span>
                                {player.details?.find(d => d.type.name === 'Position')?.type.name && (
                                    <span className="player-position">
                                        {player.details.find(d => d.type.name === 'Position').type.name}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
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
                    const lineups = getLineups(fixture);
                    
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
                                            className={`match-details-tab ${activeDetailTab === 'lineups' ? 'active' : ''}`}
                                            onClick={() => setActiveDetailTab('lineups')}
                                        >
                                            Kadrolar
                                        </div>
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

                                    {activeDetailTab === 'lineups' && (
                                        <div className="match-details-section">
                                            <div className="football-pitch-wrapper">
                                                <div className="football-pitch">
                                                    <PitchPlayers lineups={getLineups(fixture).home.lineups} />
                                                </div>
                                                <div className="football-pitch">
                                                    <PitchPlayers lineups={getLineups(fixture).away.lineups} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
            {selectedPlayer && (
                <PlayerStatsPopup 
                    player={selectedPlayer} 
                    onClose={() => setSelectedPlayer(null)} 
                />
            )}
        </div>
    );
};

export default TeamFixtures; 