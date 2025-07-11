import React from 'react';
import { useQuery } from '@tanstack/react-query';
import backend from '../api/backend';
import Slider from 'react-slick';
import './NewsSlider.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NewsSlider = () => {
    const { data: articles = [], isLoading, error } = useQuery({
        queryKey: ['news'],
        queryFn: async () => {
            const res = await backend.get('/news');
            return (res.data.articles || []).filter(item =>
                item.headline && item.links
            );
        }
    });

    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000,
        arrows: true,
        pauseOnHover: false
    };

    const getLeagueName = (leagueCode) => {
        const leagues = {
            'eng.1': 'Premier Lig',
            'ger.1': 'Bundesliga',
            'esp.1': 'La Liga',
            'ita.1': 'Serie A',
            'fra.1': 'Ligue 1'
        };
        return leagues[leagueCode] || 'Futbol';
    };

    if (isLoading) return <div>Yükleniyor...</div>;
    if (error) return <div>Hata: {error.message}</div>;

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {articles.map((item, index) => (
                    <div key={index} className="slider-item">
                        <a href={item.links} target="_blank" rel="noreferrer">
                            <div className="slider-image-wrapper">
                                <img
                                    src={item.images?.[0]?.url || 'https://via.placeholder.com/800x400?text=Fotoğraf+Yok'}
                                    alt={item.headline}
                                    className="slider-image"
                                />
                                <div className="slider-overlay">
                                    <span className="slider-category">{getLeagueName(item.league)}</span>
                                    <h2 className="slider-title">{item.headline}</h2>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default NewsSlider;
