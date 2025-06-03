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
        <div className={`standings ${isHomePage ? 'home-standings' : ''}`}>
            {!isHomePage && <h2>Puan Durumu</h2>}
            <table>
                <thead>
                    <tr>
                        <th>Sıra</th>
                        <th>Takım</th>
                        <th>P</th>
                    </tr>
                </thead>
                <tbody>
                    {table.map((team, index) => (
                        <tr key={`${team.id}-${index}`}>
                            <td>{index + 1}</td>
                            <td className="team-cell">
                                <img src={team.logo} alt={team.name} width={20} />
                                <Link to={`/teams/${team.id}`} className="team-link">
                                    {team.name}
                                </Link>
                            </td>
                            <td>{team.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Standings;
