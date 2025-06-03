import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTopScorers } from '../api/backend';
import './TopScorers.css';

const STAGE_ID = 77465302;

const TopScorers = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['topscorers', STAGE_ID],
        queryFn: async () => {
            const res = await getTopScorers(STAGE_ID);
            return (res.data.data || []).slice(0, 5);
        }
    });

    if (isLoading) return <div>Yükleniyor...</div>;
    if (error) return <div>Hata: {error.message}</div>;

    return (
        <div className="topscorers-container topscorers-narrow">
            <h2 className="topscorers-title">Gol Krallığı</h2>
            <div className="topscorers-list">
                {data.map((item, idx) => (
                    <div className="topscorer-row" key={item.id}>
                        <div className="topscorer-rank">{item.position}</div>
                        <img className="topscorer-img" src={item.player?.image_path} alt={item.player?.display_name} />
                        <div className="topscorer-name">{item.player?.display_name}</div>
                        <div className="topscorer-goals">{item.total} <span>gol</span></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopScorers; 