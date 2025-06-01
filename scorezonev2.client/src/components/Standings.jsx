import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import backend from "../api/backend";
import "./Standings.css"; // Stil dosyasını ekledik

const Standings = () => {
    const [table, setTable] = useState([]);
    const seasonId = "19686";
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    useEffect(() => {
        backend.get(`/leagues/standings/${seasonId}`)
            .then(res => {
                const rawData = res.data.data;
                const seen = new Set();
                const uniqueRows = [];

                for (const row of rawData) {
                    if (!seen.has(row.id)) {
                        seen.add(row.id);
                        uniqueRows.push(row);
                    }
                }

                const formatted = uniqueRows
                    .sort((a, b) => b.points - a.points)
                    .map(entry => ({
                        id: entry.id,
                        points: entry.points,
                        name: entry.team.name,
                        logo: entry.team.logo
                    }));

                setTable(formatted);
            })
            .catch(err => console.error("Puan durumu alınamadı", err));
    }, []);

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
