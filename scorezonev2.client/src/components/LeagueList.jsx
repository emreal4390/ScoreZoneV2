import React, { useEffect, useState } from 'react';
import backend from '../api/backend';

const LeagueList = () => {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        backend.get('/leagues/all')
            .then(res => {
                console.log("API cevab�:", res.data);
                setLeagues(res.data.data || []); // g�venli eri�im
                setLoading(false);
            })
            .catch(err => {
                console.error("API'den veri al�namad�:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Y�kleniyor...</p>;

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
