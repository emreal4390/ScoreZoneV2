import React from 'react';
import { useQuery } from '@tanstack/react-query';
import backend from '../api/backend';
import './Fixtures.css';

const Fixtures = ({ limit = 10 }) => {
    const { data: fixtures = [], isLoading, error } = useQuery({
        queryKey: ['fixtures', limit],
        queryFn: async () => {
            const res = await backend.get('/matches/fixtures');
            return (res.data.data || []).slice(0, limit);
        }
    });

    if (isLoading) return <div>Yükleniyor...</div>;
    if (error) return <div>Hata: {error.message}</div>;

    return (
        <div className="fixtures-list-modern">
            <h2 className="fixtures-title">Fikstür</h2>
            {fixtures.map((fixture) => (
                <div key={fixture.id} className="fixture-row">
                    <div className="fixture-row-date">
                        {new Date(fixture.starting_at).toLocaleDateString('tr-TR', {
                            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                        })}
                    </div>
                    <div className="fixture-row-teams">
                        <span className="fixture-row-team home">{fixture.name.split(' vs ')[0]}</span>
                        <span className="fixture-row-vs">-</span>
                        <span className="fixture-row-team away">{fixture.name.split(' vs ')[1]}</span>
                    </div>
                    <div className="fixture-row-result">
                        {fixture.result_info || 'Henüz oynanmadı'}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Fixtures; 