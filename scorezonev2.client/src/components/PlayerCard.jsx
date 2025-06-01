import React, { useEffect, useState } from 'react';
import backend from '../api/backend';

const PlayerCard = ({ playerId }) => {
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        backend.get(`/players/${playerId}`)
            .then(res => {
                setPlayer(res.data.data);
            })
            .catch(err => {
                console.error("Oyuncu bilgisi alýnamadý:", err);
            });
    }, [playerId]);

    if (!player) return <p>Yükleniyor...</p>;

    return (
        <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
            <h3>{player.display_name}</h3>
            <img src={player.image_path} alt={player.display_name} width={100} />
            <p>Boy: {player.height} cm</p>
            <p>Kilo: {player.weight} kg</p>
        </div>
    );
};

export default PlayerCard;
