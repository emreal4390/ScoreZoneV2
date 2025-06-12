import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './FeaturedPlayers.css';

const FeaturedPlayers = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const playerIds = [
                    5640825, 455805, 26294, 201060,
                    523964, 22528506, 37586403, 164132, 25589,
                    129095, 8417851, 159402, 205411
                ];
                const playerPromises = playerIds.map(id => 
                    axios.get(`/api/players/details/${id}`)
                );
                
                const responses = await Promise.all(playerPromises);
                const playerData = responses.map(response => {
                    const data = response.data.data;
                    return {
                        id: data.id,
                        name: data.display_name,
                        image: data.image_path,
                        team: data.teams?.[0]?.team?.name || 'Takım Bilgisi Yok'
                    };
                });
                
                setPlayers(playerData);
            } catch (error) {
                console.error('Oyuncu bilgileri alınamadı:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    if (loading) {
        return (
            <div className="featured-players-container">
                <h2 className="featured-players-title">Dikkat Çeken Futbolcular</h2>
                <div className="featured-players-grid">
                    {[1, 2, 3, 4].map((_, index) => (
                        <div key={index} className="featured-player-card loading">
                            <div className="featured-player-image">
                                <div className="loading-placeholder"></div>
                            </div>
                            <div className="featured-player-info">
                                <div className="loading-placeholder"></div>
                                <div className="loading-placeholder"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="featured-players-container">
            <h2 className="featured-players-title">Dikkat Çeken Futbolcular</h2>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 10
                    },
                    480: {
                        slidesPerView: 2,
                        spaceBetween: 15
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 20
                    }
                }}
            >
                {players.map((player) => (
                    <SwiperSlide key={player.id}>
                        <div 
                            className="featured-player-card"
                            onClick={() => navigate(`/players/${player.id}`)}
                        >
                            <div className="featured-player-image">
                                <img src={player.image} alt={player.name} />
                            </div>
                            <div className="featured-player-info">
                                <h3>{player.name}</h3>
                                <p>{player.team}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default FeaturedPlayers; 