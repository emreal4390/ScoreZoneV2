import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTopScorersBySeason } from '../api/backend';
import './TopScorers.css';

const SEASON_ID = 23851; // 2024/2025 sezonu

const TopScorers = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['topscorers-season', SEASON_ID],
        queryFn: async () => {
            const res = await getTopScorersBySeason(SEASON_ID);
            return (res.data.data || []).slice(0, 5); // İlk 5 oyuncuyu al
        }
    });

    if (isLoading) return <div>Yükleniyor...</div>;
    if (error) return <div>Hata: {error.message}</div>;

    return (
        <div className="topscorers-container topscorers-narrow">
            <h2 className="topscorers-title">Gol Krallığı</h2>
            <div className="topscorers-list">
                {data.map((item) => (
                    <div className="topscorer-row" key={item.id}>
                        <div className="topscorer-rank">{item.position}</div>
                        <img 
                            className="topscorer-img" 
                            src={item.player?.image_path} 
                            alt={item.player?.display_name}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40x40?text=Oyuncu';
                            }}
                        />
                        <div className="topscorer-info">
                            <div className="topscorer-name">{item.player?.display_name}</div>
                            <div className="topscorer-team">{item.participant?.name}</div>
                        </div>
                        <div className="topscorer-goals">{item.total} <span>gol</span></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopScorers; 