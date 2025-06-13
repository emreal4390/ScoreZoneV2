import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerVote.css';

const PlayerVote = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    // Sabit takım ID'leri
    const teamIds = [88, 2811, 34, 554, 3702, 688, 3897];

    useEffect(() => {
        const fetchPlayers = async () => {
            setLoading(true);
            setError(null);
            try {
                const promises = teamIds.map(async (teamId) => {
                    const response = await axios.get(`/api/teams/${teamId}/squad`);
                    return response.data.data;
                });
                const results = await Promise.all(promises);
                const allPlayers = results.flat();
                setPlayers(allPlayers);
            } catch (err) {
                setError('Oyuncular yüklenirken bir hata oluştu.');
                console.error('Oyuncu yükleme hatası:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    const handleVote = (player) => {
        setSelectedPlayer(player);
        // Burada oylama işlemi yapılabilir
    };

    if (loading) return <div className="player-vote-loading">Yükleniyor...</div>;
    if (error) return <div className="player-vote-error">{error}</div>;
    if (players.length < 2) return <div className="player-vote-error">Yeterli oyuncu bulunamadı.</div>;

    const randomPlayers = players.sort(() => 0.5 - Math.random()).slice(0, 2);

    return (
        <div className="player-vote">
            <h2>Kimi daha çok seviyorsun?</h2>
            <div className="player-vote-container">
                {randomPlayers.map((player) => (
                    <div key={player.id} className="player-card" onClick={() => handleVote(player)}>
                        <img src={player.image_path} alt={player.name} className="player-image" />
                        <h3>{player.name}</h3>
                    </div>
                ))}
            </div>
            {selectedPlayer && <p>Seçilen oyuncu: {selectedPlayer.name}</p>}
        </div>
    );
};

export default PlayerVote; 