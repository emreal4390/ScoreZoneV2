import React, { useState, useEffect } from 'react';
import backend from '../api/backend';
import '../styles/PlayerComparison.css';

const PlayerComparison = () => {
    const [players, setPlayers] = useState([]);
    const [currentPlayers, setCurrentPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const teamIds = [34, 88, 3897, 688, 554, 2811];
    const seasonId = "23851"; // Sabit sezon ID'si

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const allPlayers = [];
            for (const teamId of teamIds) {
                const response = await backend.get(`/matches/squad/${seasonId}/${teamId}?include=player.nationality`);
                if (response.data && response.data.data) {
                    allPlayers.push(...response.data.data);
                }
            }
            setPlayers(allPlayers);
            selectRandomPlayers(allPlayers);
        } catch (error) {
            console.error('Oyuncular yüklenirken hata oluştu:', error);
        }
    };

    const selectRandomPlayers = (playerList) => {
        if (playerList.length < 2) return;
        
        const randomIndex1 = Math.floor(Math.random() * playerList.length);
        let randomIndex2;
        do {
            randomIndex2 = Math.floor(Math.random() * playerList.length);
        } while (randomIndex2 === randomIndex1);

        setCurrentPlayers([playerList[randomIndex1], playerList[randomIndex2]]);
    };

    const handlePlayerSelect = (selectedPlayer) => {
        setSelectedPlayer(selectedPlayer);
        const remainingPlayers = players.filter(p => p.id !== selectedPlayer.id);
        const randomIndex = Math.floor(Math.random() * remainingPlayers.length);
        setCurrentPlayers([selectedPlayer, remainingPlayers[randomIndex]]);
    };

    return (
        <div className="player-comparison-container">
            <h2>Hangi Oyuncuyu Daha Çok Seviyorsunuz?</h2>
            <div className="players-grid">
                {currentPlayers.map((player) => (
                    <div 
                        key={player.id} 
                        className={`player-card ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
                        onClick={() => handlePlayerSelect(player)}
                    >
                        <img 
                            src={player.player?.image_path || 'https://via.placeholder.com/150'} 
                            alt={player.player?.name} 
                            className="player-photo" 
                        />
                        <div className="player-info">
                            <h3>{player.player?.name}</h3>
                            <p>{player.player?.nationality?.name || 'Milliyet bilgisi yok'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerComparison; 