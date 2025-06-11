import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HelpOutline, Add, Remove } from '@mui/icons-material';
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
    const [showHelp, setShowHelp] = useState(false);
    const [helpPosition, setHelpPosition] = useState({ x: 0, y: 0 });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        }
    };

    const handleHelpClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHelpPosition({
            x: rect.left,
            y: rect.bottom + window.scrollY
        });
        setShowHelp(!showHelp);
    };

    const handleRatingChange = (amount) => {
        setRating(prev => {
            const newRating = prev + amount;
            return Math.max(0, Math.min(100, newRating));
        });
    };

    return (
        <div className="player-rating-container">
            <div className="player-rating-header">
                <h1>Oyuncu Puanı Hesaplama</h1>
                <HelpOutline 
                    className="help-icon" 
                    onClick={handleHelpClick}
                />
                {showHelp && (
                    <div 
                        className="help-tooltip"
                        style={{
                            left: `${helpPosition.x}px`,
                            top: `${helpPosition.y}px`
                        }}
                    >
                        Bu form, oyuncunun performans verilerine göre 0-100 arasında bir puan hesaplar.
                        Boş bırakılan alanlar 0 olarak değerlendirilir.
                    </div>
                )}
            </div>

            <div className="player-rating-content">
                <form className="player-rating-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Dakika</label>
                        <input
                            type="number"
                            name="minutesPlayed"
                            value={formData.minutesPlayed}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Gol</label>
                        <input
                            type="number"
                            name="goals"
                            value={formData.goals}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Asist</label>
                        <input
                            type="number"
                            name="assists"
                            value={formData.assists}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Toplam Şut</label>
                        <input
                            type="number"
                            name="shotsTotal"
                            value={formData.shotsTotal}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>İsabetli Şut</label>
                        <input
                            type="number"
                            name="shotsOnTarget"
                            value={formData.shotsOnTarget}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Pas</label>
                        <input
                            type="number"
                            name="passes"
                            value={formData.passes}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>İsabetli Pas</label>
                        <input
                            type="number"
                            name="accuratePasses"
                            value={formData.accuratePasses}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Kritik Pas</label>
                        <input
                            type="number"
                            name="keyPasses"
                            value={formData.keyPasses}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Dribling Denemesi</label>
                        <input
                            type="number"
                            name="dribbleAttempts"
                            value={formData.dribbleAttempts}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Başarılı Dribling</label>
                        <input
                            type="number"
                            name="successfulDribbles"
                            value={formData.successfulDribbles}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Müdahale</label>
                        <input
                            type="number"
                            name="tackles"
                            value={formData.tackles}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Başarılı Müdahale</label>
                        <input
                            type="number"
                            name="tacklesWon"
                            value={formData.tacklesWon}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Top Çalma</label>
                        <input
                            type="number"
                            name="interceptions"
                            value={formData.interceptions}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Top Temizleme</label>
                        <input
                            type="number"
                            name="clearances"
                            value={formData.clearances}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Kazanılan Düello</label>
                        <input
                            type="number"
                            name="duelsWon"
                            value={formData.duelsWon}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Toplam Düello</label>
                        <input
                            type="number"
                            name="totalDuels"
                            value={formData.totalDuels}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Kazanılan Hava Topu</label>
                        <input
                            type="number"
                            name="aerialsWon"
                            value={formData.aerialsWon}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Toplam Hava Topu</label>
                        <input
                            type="number"
                            name="aerials"
                            value={formData.aerials}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Top Kaybı</label>
                        <input
                            type="number"
                            name="possessionLost"
                            value={formData.possessionLost}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Oluşturulan Büyük Fırsat</label>
                        <input
                            type="number"
                            name="bigChancesCreated"
                            value={formData.bigChancesCreated}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Kaçırılan Büyük Fırsat</label>
                        <input
                            type="number"
                            name="bigChancesMissed"
                            value={formData.bigChancesMissed}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Kazanılan Ara Pas</label>
                        <input
                            type="number"
                            name="throughBallsWon"
                            value={formData.throughBallsWon}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Kırmızı Kart</label>
                        <input
                            type="number"
                            name="redcards"
                            value={formData.redcards}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Sarı Kart</label>
                        <input
                            type="number"
                            name="yellowcards"
                            value={formData.yellowcards}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>İki Sarı Kart</label>
                        <input
                            type="number"
                            name="yellowredCards"
                            value={formData.yellowredCards}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Gol Yediren Hata</label>
                        <input
                            type="number"
                            name="errorLeadToGoal"
                            value={formData.errorLeadToGoal}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Şut Yediren Hata</label>
                        <input
                            type="number"
                            name="errorLeadToShot"
                            value={formData.errorLeadToShot}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Son Adam Müdahalesi</label>
                        <input
                            type="number"
                            name="lastManTackle"
                            value={formData.lastManTackle}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Kurtarış</label>
                        <input
                            type="number"
                            name="saves"
                            value={formData.saves}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Yenen Gol</label>
                        <input
                            type="number"
                            name="goalsConceded"
                            value={formData.goalsConceded}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/')}>Geri</button>
                        <button type="submit">Hesapla</button>
                    </div>
                </form>

                <div className="player-rating-result">
                    <div className="rating-display">
                        <div className="rating-label">Oyuncu Puanı</div>
                        <div className="rating-value">{rating !== null ? rating.toFixed(1) : '-'}</div>
                        <div className="rating-description">
                            {rating !== null && (
                                <>
                                    {rating >= 90 ? 'Dünya Yıldızı' :
                                     rating >= 80 ? 'Çok İyi' :
                                     rating >= 70 ? 'İyi' :
                                     rating >= 60 ? 'Orta' :
                                     'Geliştirilmeli'}
                                </>
                            )}
                        </div>
                        {rating !== null && (
                            <div className="rating-scale">
                                <button onClick={() => handleRatingChange(-1)}>
                                    <Remove />
                                </button>
                                <span>{rating.toFixed(1)}</span>
                                <button onClick={() => handleRatingChange(1)}>
                                    <Add />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerRating; 