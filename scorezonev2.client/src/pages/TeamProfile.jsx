import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    24: 'Kaleci',
    25: 'Defans',
    26: 'Orta Saha',
    27: 'Forvet',
    28: 'Kaleci'
};

const positionOrder = ['Forvet', 'Orta Saha', 'Defans', 'Kaleci'];

const TeamProfile = () => {
    const { teamId } = useParams();
    const [activeTab, setActiveTab] = useState('squad');
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ['squad', SEASON_ID, teamId],
        queryFn: async () => {
            const res = await getSquad(SEASON_ID, teamId);
            return res.data.data || [];
        }
    });

    if (isLoading) return <div className="team-profile-container">Yükleniyor...</div>;
    if (error) return <div className="team-profile-container">Hata: {error.message}</div>;

    // Oyuncuları pozisyona göre sıralı tek bir diziye çevir
    const sortedPlayers = [...data].sort((a, b) => {
        const posA = positionMap[a.player?.position_id] || 'Diğer';
        const posB = positionMap[b.player?.position_id] || 'Diğer';
        if (posA === posB) return (a.player?.display_name || '').localeCompare(b.player?.display_name || '');
        return positionOrder.indexOf(posA) - positionOrder.indexOf(posB);
    });

    const renderContent = () => {
        switch (activeTab) {
            case 'squad':
                return (
                    <>
                        <h2 className="team-profile-title"></h2>
                        <div className="squad-table-wrapper">
                            <table className="squad-table">
                                <thead>
                                    <tr>
                                        <th>Oyuncu</th>
                                        <th>Pozisyon</th>
                                        <th>Forma</th>
                                        <th>Yaş</th>
                                        <th>Boy</th>
                                        <th>Piyasa değeri</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedPlayers.map((item) => (
                                        <tr key={item.id} className="squad-table-row" onClick={() => navigate(`/players/${item.player?.id}`)} style={{ cursor: 'pointer' }}>
                                            <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <img src={item.player?.image_path} alt={item.player?.display_name} className="squad-table-img" />
                                                <span>{item.player?.display_name}</span>
                                            </td>
                                            <td>{item.player?.position?.name || positionMap[item.player?.position_id] || '-'}</td>
                                            <td>{item.jersey_number || '-'}</td>
                                            <td>{item.player?.date_of_birth ? (new Date().getFullYear() - new Date(item.player.date_of_birth).getFullYear()) : '-'}</td>
                                            <td>{item.player?.height ? item.player.height + ' cm' : '-'}</td>
                                            <td>{item.player?.market_value || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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