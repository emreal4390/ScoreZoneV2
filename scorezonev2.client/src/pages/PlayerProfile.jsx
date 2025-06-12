import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/PlayerProfile.css';

function InfoCard({ player }) {
  // Yaş hesaplama
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Ayak bilgisini metadata'dan alma ve Türkçe'ye çevirme
  const getPreferredFoot = () => {
    if (!player?.metadata) return null;
    const footData = player.metadata.find(m => m.type?.code === 'preferred-foot');
    const foot = footData?.values;
    if (foot === 'left') return 'Sol ';
    if (foot === 'right') return 'Sağ ';
    return foot || null;
  };

  const age = calculateAge(player?.date_of_birth);
  const preferredFoot = getPreferredFoot();

  return (
    <div className="profile-card">
      <div className="profile-header">
        <img src={player?.image_path} alt={player?.display_name} className="profile-img" />
        <div>
          <h2>{player?.display_name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {player?.teams?.[0]?.team?.image_path && (
              <img src={player.teams[0].team.image_path} alt="Takım" className="team-img" />
            )}
            <span>{player?.teams?.[0]?.team?.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {player?.nationality?.image_path && (
              <img src={player.nationality.image_path} alt={player.nationality.name} className="team-img" style={{ width: '24px', height: '24px' }} />
            )}
            <span>{player?.nationality?.name}</span>
          </div>
        </div>
      </div>
      <div className="profile-info-grid">
        <div><b>Yaş:</b> {age || '-'}</div>
        <div><b>Boy:</b> {player?.height || '-'} cm</div>
        <div><b>Kilo:</b> {player?.weight || '-'} kg</div>
        <div><b>Pozisyon:</b> {player?.detailedposition?.name || '-'}</div>
        <div><b>Ayak:</b> {preferredFoot || '-'}</div>
      </div>
    </div>
  );
}

function CareerCard({ teams }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${date.getFullYear()} ${months[date.getMonth()]}`;
  };

  return (
    <div className="profile-card">
      <h3>Kariyer</h3>
      <ul>
        {teams?.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            {item.team?.image_path && (
              <img src={item.team.image_path} alt={item.team.name} className="team-img" style={{ width: '24px', height: '24px' }} />
            )}
            <span><b>{item.team?.name}</b></span>
            <span>({formatDate(item.start)} - {formatDate(item.end)})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatsCard({ stats }) {
  if (!stats?.length) return null;

  const getStatValue = (statType) => {
    const stat = stats.find(s => s.type?.code === statType);
    return stat?.value?.total || 0;
  };

  const getStatName = (statType) => {
    const stat = stats.find(s => s.type?.code === statType);
    return stat?.type?.name || statType;
  };

  const statTypes = [
    'appearances',
    'minutes-played',
    'goals',
    'assists',
    'passes',
    'shots-total',
    'shots-on-target',
    'rating'
  ];

  return (
    <div className="profile-card">
      <h3>İstatistikler</h3>
      <div className="profile-stats-grid">
        {statTypes.map((type, index) => (
          <div key={index}>
            <b>{getStatName(type)}:</b> {getStatValue(type)}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrophiesTabs({ trophies }) {
  // Takımları bul
  const teams = Array.from(new Set(trophies.map(t => t.team?.id && t.team?.name ? JSON.stringify({id: t.team.id, name: t.team.name, image: t.team.image_path}) : null).filter(Boolean)))
    .map(str => JSON.parse(str));
  const [activeTeam, setActiveTeam] = useState(teams[0]?.id);

  return (
    <div className="profile-card">
      <h3>Kupalar</h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        {teams.map(team => (
          <button
            key={team.id}
            className={activeTeam === team.id ? 'trophy-tab active' : 'trophy-tab'}
            onClick={() => setActiveTeam(team.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {team.image && <img src={team.image} alt={team.name} className="team-img" style={{ width: 24, height: 24 }} />}
            <span>{team.name}</span>
          </button>
        ))}
      </div>
      <ul className="profile-trophy-list">
        {trophies.filter(t => t.team?.id === activeTeam && t.trophy?.name !== 'Runner-up').map((t, i) => (
          <li key={i}>
            {t.league?.image_path && (
              <img src={t.league.image_path} alt={t.league?.name} className="trophy-img" style={{ border: 'none', background: 'none' }} />
            )}
            {t.trophy?.image_path && (
              <img src={t.trophy.image_path} alt={t.trophy?.name} className="trophy-img" />
            )}
            {t.team?.image_path && (
              <img src={t.team.image_path} alt={t.team?.name} className="team-img" />
            )}
            <div className="trophy-info">
              <span><b>{t.trophy?.name}</b> - {t.league?.name}</span>
              <span style={{ fontSize: '0.95em', color: '#fbbf24' }}>{t.season?.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PlayerProfile() {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlayer() {
      setLoading(true);
      try {
        const url = `/api/players/details/${playerId}`;
        const { data } = await axios.get(url);
        setPlayer(data.data);
      } catch (e) {
        setError('Oyuncu verisi alınamadı.');
      }
      setLoading(false);
    }
    fetchPlayer();
  }, [playerId]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="player-profile-layout">
      <div className="profile-grid">
        <InfoCard player={player} />
        <CareerCard teams={player?.teams} />
        <TrophiesTabs trophies={player?.trophies} />
      </div>
    </div>
  );
}

