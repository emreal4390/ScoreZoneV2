import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/PlayerProfile.css';

function InfoCard({ player }) {
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
          <p>{player?.nationality?.name}</p>
        </div>
      </div>
      <div className="profile-info-grid">
        <div><b>Yaş:</b> {player?.age}</div>
        <div><b>Boy:</b> {player?.height} cm</div>
        <div><b>Kilo:</b> {player?.weight} kg</div>
        <div><b>Pozisyon:</b> {player?.detailedposition?.name}</div>
        <div><b>Ayak:</b> {player?.preferred_foot}</div>
      </div>
    </div>
  );
}

function CareerCard({ teams }) {
  return (
    <div className="profile-card">
      <h3>Kariyer</h3>
      <ul>
        {teams?.map((item, i) => (
          <li key={i}>
            <b>{item.team?.name}</b> <span>({item.start ?? '-'} - {item.end ?? '-'})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatsCard({ stats }) {
  if (!stats?.length) return null;
  const s = stats[0];
  return (
    <div className="profile-card">
      <h3>İstatistikler</h3>
      <div className="profile-stats-grid">
        <div><b>Maç:</b> {s.appearances}</div>
        <div><b>Gol:</b> {s.goals}</div>
        <div><b>Asist:</b> {s.assists}</div>
        <div><b>Dakika:</b> {s.minutes}</div>
        <div><b>Pas:</b> {s.passes}</div>
        <div><b>Şut:</b> {s.shots_total}</div>
        <div><b>İsabetli Şut:</b> {s.shots_on_target}</div>
        <div><b>Puan:</b> {s.rating}</div>
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
        <StatsCard stats={player?.statistics} />
        <TrophiesTabs trophies={player?.trophies} />
      </div>
    </div>
  );
}

// Basit stiller için öneri:
// .player-profile-layout { max-width: 1100px; margin: 0 auto; padding: 2rem; }
// .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
// .profile-card { background: #fff; border-radius: 16px; box-shadow: 0 2px 12px #0001; padding: 1.5rem; }
// .profile-header { display: flex; gap: 1rem; align-items: center; }
// .profile-img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
// .profile-info-grid, .profile-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
// .profile-trophy-list { list-style: none; padding: 0; } 