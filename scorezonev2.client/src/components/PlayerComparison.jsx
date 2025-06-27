import React, { useState, useEffect } from 'react';
import backend from '../api/backend';
import '../styles/PlayerComparison.css';

const PlayerComparison = () => {
    const [players, setPlayers] = useState([]);
    const [currentPlayers, setCurrentPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [consecutiveSelections, setConsecutiveSelections] = useState({});
    const [favoritePlayer, setFavoritePlayer] = useState(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationPlayer, setCelebrationPlayer] = useState(null);
    
    const teamIds = [34, 88, 3897, 688, 554, 2811];
    const seasonId = "23851"; // Sabit sezon ID'si

    useEffect(() => {
        fetchPlayers();
        // Local storage'dan favori oyuncuyu yükle
        const savedFavorite = localStorage.getItem('favoritePlayer');
        if (savedFavorite) {
            setFavoritePlayer(JSON.parse(savedFavorite));
        }
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
        
        // Ard arda seçim sayısını güncelle
        const playerId = selectedPlayer.id;
        const currentCount = consecutiveSelections[playerId] || 0;
        const newCount = currentCount + 1;
        
        const updatedSelections = {
            ...consecutiveSelections,
            [playerId]: newCount
        };
        
        setConsecutiveSelections(updatedSelections);
        
        // 5 kez ard arda seçildi mi kontrol et
        if (newCount >= 5) {
            // Favori oyuncu olarak kaydet
            setFavoritePlayer(selectedPlayer);
            localStorage.setItem('favoritePlayer', JSON.stringify(selectedPlayer));
            
            // Kutlama animasyonunu göster
            setCelebrationPlayer(selectedPlayer);
            setShowCelebration(true);
            
            // 3 saniye sonra kutlama animasyonunu kapat
            setTimeout(() => {
                setShowCelebration(false);
                setCelebrationPlayer(null);
            }, 3000);
            
            // Ard arda seçim sayısını sıfırla
            setConsecutiveSelections({});
        }
        
        // Yeni oyuncu çifti seç
        const remainingPlayers = players.filter(p => p.id !== selectedPlayer.id);
        const randomIndex = Math.floor(Math.random() * remainingPlayers.length);
        setCurrentPlayers([selectedPlayer, remainingPlayers[randomIndex]]);
    };

    const resetFavoritePlayer = () => {
        setFavoritePlayer(null);
        setConsecutiveSelections({});
        localStorage.removeItem('favoritePlayer');
    };

    return (
        <div className="player-comparison-container">
            <h2>Hangi Oyuncuyu Daha Çok Seviyorsunuz?</h2>
            
            {favoritePlayer && (
                <div className="favorite-player-display">
                    <div className="favorite-player-card">
                        <div className="favorite-badge">⭐ En Sevdiğiniz Oyuncu</div>
                        <img 
                            src={favoritePlayer.player?.image_path || 'https://via.placeholder.com/150'} 
                            alt={favoritePlayer.player?.name} 
                            className="favorite-player-photo" 
                        />
                        <div className="favorite-player-info">
                            <h3>{favoritePlayer.player?.name}</h3>
                            <p>{favoritePlayer.player?.nationality?.name || 'Milliyet bilgisi yok'}</p>
                        </div>
                        <button onClick={resetFavoritePlayer} className="reset-favorite-btn">
                            Sıfırla
                        </button>
                    </div>
                </div>
            )}
            
            <div className="players-grid">
                {currentPlayers.map((player) => {
                    const selectionCount = consecutiveSelections[player.id] || 0;
                    return (
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
                                {selectionCount > 0 && (
                                    <div className="selection-counter">
                                        {selectionCount}/5 kez seçildi
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Kutlama Animasyonu */}
            {showCelebration && celebrationPlayer && (
                <div className="celebration-overlay">
                    <div className="celebration-modal">
                        <div className="celebration-content">
                            <div className="celebration-icon">🎉</div>
                            <h2>Tebrikler!</h2>
                            <p>En sevdiğiniz oyuncu belirlendi:</p>
                            <div className="celebration-player">
                                <img 
                                    src={celebrationPlayer.player?.image_path || 'https://via.placeholder.com/150'} 
                                    alt={celebrationPlayer.player?.name} 
                                    className="celebration-player-photo" 
                                />
                                <h3>{celebrationPlayer.player?.name}</h3>
                            </div>
                            <div className="celebration-message">
                                Bu oyuncuyu 5 kez ard arda seçtiniz! ⭐
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerComparison; 