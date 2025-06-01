import React, { useEffect, useState } from 'react';
import backend from '../api/backend';

const LeagueList = () => {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        backend.get('/leagues/all')
            .then(res => {
                console.log("API cevabý:", res.data);
                setLeagues(res.data.data || []); // güvenli eriþim
                setLoading(false);
            })
            .catch(err => {
                console.error("API'den veri alýnamadý:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Yükleniyor...</p>;

    return (
        <div>
            <h2>Ligler</h2>
            <ul>
                {leagues.map(l => (
                    <li key={l.id}>
                        {l.name} ({l.code || "Kod yok"})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LeagueList;
