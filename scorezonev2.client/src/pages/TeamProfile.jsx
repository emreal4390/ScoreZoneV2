import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSquad } from '../api/backend';
import TeamFixtures from '../components/TeamFixtures';
import './TeamProfile.css';

const SEASON_ID = 23851; // 2024-25 sezonu

const positionMap = {
    1: 'Kaleci',
    2: 'Defans',
    3: 'Orta Saha',
    4: 'Forvet',
    25: 'Defans',
    26: 'Orta Saha',
    27: 'Forvet',
    28: 'Kaleci'
};

const positionOrder = ['Forvet', 'Orta Saha', 'Defans', 'Kaleci'];

const TeamProfile = () => {
    const { teamId } = useParams();
    const [activeTab, setActiveTab] = useState('squad');

    const { data, isLoading, error } = useQuery({
        queryKey: ['squad', SEASON_ID, teamId],
        queryFn: async () => {
            const res = await getSquad(SEASON_ID, teamId);
            return res.data.data || [];
        }
    });

    if (isLoading) return <div className="team-profile-container">Yükleniyor...</div>;
    if (error) return <div className="team-profile-container">Hata: {error.message}</div>;

    // Pozisyona göre gruplama
    const grouped = {};
    data.forEach(item => {
        const pos = positionMap[item.player?.position_id] || 'Diğer';
        if (!grouped[pos]) grouped[pos] = [];
        grouped[pos].push(item);
    });

    const renderContent = () => {
        switch (activeTab) {
            case 'squad':
                return (
                    <>
                        <h2 className="team-profile-title">Kadro</h2>
                        {positionOrder.map((pos) =>
                            grouped[pos] && grouped[pos].length > 0 && (
                                <div key={pos}>
                                    <h3 className="squad-position-title">{pos}</h3>
                                    <div className="squad-list">
                                        {grouped[pos].map((item) => (
                                            <div className="squad-player-card small" key={item.id}>
                                                <img src={item.player?.image_path} alt={item.player?.display_name} className="squad-player-img" />
                                                <div className="squad-player-info">
                                                    <div className="squad-player-name">{item.player?.display_name}</div>
                                                    <div className="squad-player-jersey">#{item.jersey_number}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}
                    </>
                );
            case 'fixtures':
                return <TeamFixtures teamId={teamId} />;
            default:
                return null;
        }
    };

    return (
        <div className="team-profile-container">
            <div className="team-profile-tabs">
                <button 
                    className={`team-profile-tab ${activeTab === 'squad' ? 'active' : ''}`}
                    onClick={() => setActiveTab('squad')}
                >
                    Kadro
                </button>
                <button 
                    className={`team-profile-tab ${activeTab === 'fixtures' ? 'active' : ''}`}
                    onClick={() => setActiveTab('fixtures')}
                >
                    Maçlar
                </button>
            </div>
            <div className="team-profile-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default TeamProfile; 