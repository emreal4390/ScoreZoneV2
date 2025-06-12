import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import backend from "../api/backend";
import "./Standings.css"; // Stil dosyasını ekledik

const Standings = () => {
    const seasonId = "23851";
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    const { data: table = [], isLoading, error } = useQuery({
        queryKey: ['standings', seasonId],
        queryFn: async () => {
            const res = await backend.get(`/leagues/standings/${seasonId}`);
            const rawData = res.data.data;
            const seen = new Set();
            const uniqueRows = [];

            for (const row of rawData) {
                if (!seen.has(row.id)) {
                    seen.add(row.id);
                    uniqueRows.push(row);
                }
            }

            return uniqueRows
                .sort((a, b) => b.points - a.points)
                .map(entry => ({
                    id: entry.id,
                    points: entry.points,
                    name: entry.team.name,
                    logo: entry.team.logo
                }));
        }
    });

    if (isLoading) return <div>Yükleniyor...</div>;
    if (error) return <div>Hata: {error.message}</div>;

    return (
        <div className="standings-container">
            <h2 className="standings-title">Canlı Puan Durumu</h2>
            <div className="standings-table">
                <div className="standings-header">
                    <div className="standings-row">
                        <span className="standings-position">#</span>
                        <span className="standings-team">Takım</span>
                        <div className="standings-points">Puan</div>
                    </div>
                </div>
                <div className="standings-body">
                    {table.map((team, index) => (
                        <div key={team.id} className="standings-row">
                            <span className="standings-position" style={{ color: '#fff' }}>({index + 1})</span>
                            <span className="standings-team" style={{ color: '#fff' }}>
                                <img src={team.logo} alt={team.name} width={20} />
                                <Link to={`/teams/${team.id}`} className="team-link">
                                    {team.name}
                                </Link>
                            </span>
                            <div className="standings-points">{team.points}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Standings;
