import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SportsSoccer, TrendingUp, Shield, Speed, EmojiEvents } from '@mui/icons-material';
import './PlayerRating.css';

const PlayerRating = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        minutesPlayed: '',
        goals: '',
        assists: '',
        shotsTotal: '',
        shotsOnTarget: '',
        passes: '',
        accuratePasses: '',
        keyPasses: '',
        dribbleAttempts: '',
        successfulDribbles: '',
        tackles: '',
        tacklesWon: '',
        interceptions: '',
        clearances: '',
        duelsWon: '',
        totalDuels: '',
        aerialsWon: '',
        aerials: '',
        possessionLost: '',
        bigChancesCreated: '',
        bigChancesMissed: '',
        throughBallsWon: '',
        redcards: '',
        yellowcards: '',
        yellowredCards: '',
        errorLeadToGoal: '',
        errorLeadToShot: '',
        lastManTackle: '',
        saves: '',
        goalsConceded: ''
    });

    const [rating, setRating] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Boş değerleri 0 ile doldur
            const filledData = Object.fromEntries(
                Object.entries(formData).map(([key, value]) => [key, value === '' ? '0' : value])
            );
            
            const response = await axios.post('https://localhost:7107/api/playerrating/predict', filledData);
            setRating(response.data.rating);
        } catch (error) {
            console.error('Error:', error);
            alert('Oyuncu puanı hesaplanırken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 90) return '#FFD700'; // Altın
        if (rating >= 80) return '#4CAF50'; // Yeşil
        if (rating >= 70) return '#2196F3'; // Mavi
        if (rating >= 60) return '#FF9800'; // Turuncu
        return '#F44336'; // Kırmızı
    };

    const statCategories = [
        {
            title: 'Temel Bilgiler',
            icon: <SportsSoccer />,
            fields: [
                { name: 'minutesPlayed', label: 'Oynanan Dakika', type: 'number' }
            ]
        },
        {
            title: 'Hücum İstatistikleri',
            icon: <TrendingUp />,
            fields: [
                { name: 'goals', label: 'Gol', type: 'number' },
                { name: 'assists', label: 'Asist', type: 'number' },
                { name: 'shotsTotal', label: 'Toplam Şut', type: 'number' },
                { name: 'shotsOnTarget', label: 'İsabetli Şut', type: 'number' },
                { name: 'bigChancesCreated', label: 'Oluşturulan Büyük Fırsat', type: 'number' },
                { name: 'bigChancesMissed', label: 'Kaçırılan Büyük Fırsat', type: 'number' }
            ]
        },
        {
            title: 'Pas ve Top Hakimiyeti',
            icon: <Speed />,
            fields: [
                { name: 'passes', label: 'Pas', type: 'number' },
                { name: 'accuratePasses', label: 'İsabetli Pas', type: 'number' },
                { name: 'keyPasses', label: 'Kritik Pas', type: 'number' },
                { name: 'throughBallsWon', label: 'Kazanılan Ara Pas', type: 'number' },
                { name: 'dribbleAttempts', label: 'Dribling Denemesi', type: 'number' },
                { name: 'successfulDribbles', label: 'Başarılı Dribling', type: 'number' },
                { name: 'possessionLost', label: 'Top Kaybı', type: 'number' }
            ]
        },
        {
            title: 'Savunma İstatistikleri',
            icon: <Shield />,
            fields: [
                { name: 'tackles', label: 'Müdahale', type: 'number' },
                { name: 'tacklesWon', label: 'Başarılı Müdahale', type: 'number' },
                { name: 'interceptions', label: 'Top Çalma', type: 'number' },
                { name: 'clearances', label: 'Top Temizleme', type: 'number' },
                { name: 'lastManTackle', label: 'Son Adam Müdahalesi', type: 'number' },
                { name: 'saves', label: 'Kurtarış', type: 'number' },
                { name: 'goalsConceded', label: 'Yenen Gol', type: 'number' }
            ]
        },
        {
            title: 'Düello ve Hava Hakimiyeti',
            icon: <EmojiEvents />,
            fields: [
                { name: 'duelsWon', label: 'Kazanılan Düello', type: 'number' },
                { name: 'totalDuels', label: 'Toplam Düello', type: 'number' },
                { name: 'aerialsWon', label: 'Kazanılan Hava Topu', type: 'number' },
                { name: 'aerials', label: 'Toplam Hava Topu', type: 'number' }
            ]
        },
        {
            title: 'Disiplin ve Hatalar',
            icon: <Shield />,
            fields: [
                { name: 'redcards', label: 'Kırmızı Kart', type: 'number' },
                { name: 'yellowcards', label: 'Sarış Kart', type: 'number' },
                { name: 'yellowredCards', label: 'İki Sarı Kart', type: 'number' },
                { name: 'errorLeadToGoal', label: 'Gol Yediren Hata', type: 'number' },
                { name: 'errorLeadToShot', label: 'Şut Yediren Hata', type: 'number' }
            ]
        }
    ];

    return (
        <div className="player-rating-container">
            <div className="player-rating-content">
                <div className="form-section">
                    <form className="player-rating-form" onSubmit={handleSubmit}>
                        {statCategories.map((category, index) => (
                            <div key={index} className="stat-category">
                                <div className="category-header">
                                    <span className="category-icon">{category.icon}</span>
                                    <h3>{category.title}</h3>
                                </div>
                                <div className="category-fields">
                                    {category.fields.map((field) => (
                                        <div key={field.name} className="form-group">
                                            <label htmlFor={field.name}>{field.label}</label>
                                            <input
                                                id={field.name}
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleInputChange}
                                                placeholder={`${field.label} girin`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="form-actions">
                            <button type="button" onClick={() => navigate('/')} className="back-button">
                                Geri Dön
                            </button>
                            <button type="submit" className="calculate-button" disabled={isLoading}>
                                {isLoading ? 'Hesaplanıyor...' : 'Puanı Hesapla'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="result-section">
                    <div className="player-rating-result">
                        <div className="rating-display">
                            <div className="rating-header">
                                <h2>Oyuncu Puanı</h2>
                                <div className="rating-badge">
                                    {rating !== null ? (
                                        <span 
                                            className="rating-number"
                                            style={{ color: getRatingColor(rating) }}
                                        >
                                            {rating.toFixed(1)}
                                        </span>
                                    ) : (
                                        <span className="rating-placeholder">-</span>
                                    )}
                                </div>
                            </div>
                            
                            {rating !== null && (
                                <>
                                    <div className="rating-bar">
                                        <div 
                                            className="rating-fill"
                                            style={{ 
                                                width: `${rating}%`,
                                                backgroundColor: getRatingColor(rating)
                                            }}
                                        ></div>
                                    </div>
                                </>
                            )}
                            
                            {rating === null && (
                                <div className="empty-state">
                                    <div className="empty-icon">⚽</div>
                                    <p>Verileri girip "Puanı Hesapla" butonuna tıklayın</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerRating; 