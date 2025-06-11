from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import joblib
import numpy as np
from pydantic import BaseModel
from typing import List
import logging

# Loglama ayarları
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tüm originlere izin ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model ve scaler'ı yükle
try:
    logger.info("Model ve scaler yükleniyor...")
    model = joblib.load('player_rating_model.joblib')
    scaler = joblib.load('scaler.joblib')
    logger.info("Model ve scaler başarıyla yüklendi")
except Exception as e:
    logger.error(f"Model yüklenirken hata oluştu: {e}")
    raise

class PlayerStats(BaseModel):
    minutesPlayed: int
    goals: int
    assists: int
    shotsTotal: int
    shotsOnTarget: int
    passes: int
    accuratePasses: int
    keyPasses: int
    dribbleAttempts: int
    successfulDribbles: int
    tackles: int
    tacklesWon: int
    interceptions: int
    clearances: int
    duelsWon: int
    totalDuels: int
    aerialsWon: int
    aerials: int
    possessionLost: int
    bigChancesCreated: int
    bigChancesMissed: int
    throughBallsWon: int
    redcards: int
    yellowcards: int
    yellowredCards: int
    errorLeadToGoal: int
    errorLeadToShot: int
    lastManTackle: int
    saves: int
    goalsConceded: int

def create_features(stats: PlayerStats) -> List[float]:
    try:
        # Gol ve asist bazlı özellikler
        goal_contribution = stats.goals + stats.assists
        goal_contribution_per_90 = goal_contribution / (stats.minutesPlayed / 90) if stats.minutesPlayed > 0 else 0
        big_chance_contribution = stats.bigChancesCreated + stats.bigChancesMissed
        
        # Pas bazlı özellikler
        pass_accuracy = stats.accuratePasses / stats.passes if stats.passes > 0 else 0
        key_passes_per_90 = stats.keyPasses / (stats.minutesPlayed / 90) if stats.minutesPlayed > 0 else 0
        through_balls_per_90 = stats.throughBallsWon / (stats.minutesPlayed / 90) if stats.minutesPlayed > 0 else 0
        
        # Savunma bazlı özellikler
        defensive_actions = stats.tackles + stats.interceptions + stats.clearances
        defensive_actions_per_90 = defensive_actions / (stats.minutesPlayed / 90) if stats.minutesPlayed > 0 else 0
        tackle_success_rate = stats.tacklesWon / stats.tackles if stats.tackles > 0 else 0
        
        # Top hakimiyeti bazlı özellikler
        possession_lost_per_90 = stats.possessionLost / (stats.minutesPlayed / 90) if stats.minutesPlayed > 0 else 0
        dribbles_success_rate = stats.successfulDribbles / stats.dribbleAttempts if stats.dribbleAttempts > 0 else 0
        duels_success_rate = stats.duelsWon / stats.totalDuels if stats.totalDuels > 0 else 0
        
        # Hava hakimiyeti
        aerial_success_rate = stats.aerialsWon / stats.aerials if stats.aerials > 0 else 0
        
        # Şut bazlı özellikler
        shot_accuracy = stats.shotsOnTarget / stats.shotsTotal if stats.shotsTotal > 0 else 0
        shots_per_90 = stats.shotsTotal / (stats.minutesPlayed / 90) if stats.minutesPlayed > 0 else 0
        
        # Kaleci özellikleri
        save_rate = stats.saves / (stats.saves + stats.goalsConceded) if (stats.saves + stats.goalsConceded) > 0 else 0
        saves_per_90 = stats.saves / (stats.minutesPlayed / 90) if stats.minutesPlayed > 0 else 0
        
        # Olumsuz istatistikler için yeni özellikler - daha yüksek cezalar
        discipline_penalty = (stats.redcards * 15.0 + 
                            stats.yellowredCards * 12.0 + 
                            stats.yellowcards * 3.0)
        
        error_penalty = (stats.errorLeadToGoal * 15.0 + 
                        stats.errorLeadToShot * 5.0)
        
        last_man_tackle_penalty = stats.lastManTackle * 5.0
        
        # Tüm özellikleri listeye ekle (veri setindeki sırayla, drop_columns hariç)
        features = [
            stats.minutesPlayed,  # Minutes Played
            stats.clearances,     # Clearances
            0,                    # Fouls Drawn
            0,                    # Touches
            0,                    # Long Balls
            0,                    # Fouls
            stats.duelsWon,       # Duels Won
            0,                    # Dribbled Past
            0,                    # Duels Lost
            stats.totalDuels,     # Total Duels
            pass_accuracy,        # Accurate Passes Percentage
            stats.passes,         # Passes
            stats.accuratePasses, # Accurate Passes
            stats.tackles,        # Tackles
            stats.goalsConceded,  # Goals Conceded
            stats.aerialsWon,     # Aerials Won
            stats.interceptions,  # Interceptions
            stats.dribbleAttempts,# Dribble Attempts
            stats.successfulDribbles, # Successful Dribbles
            0,                    # Long Balls Won
            stats.keyPasses,      # Key Passes
            stats.bigChancesCreated, # Big Chances Created
            0,                    # Dispossessed
            0,                    # Total Crosses
            stats.shotsTotal,     # Shots Total
            stats.goals,          # Goals
            stats.shotsOnTarget,  # Shots On Target
            0,                    # Accurate Crosses
            0,                    # Shots Off Target
            0,                    # Penalties Won
            0,                    # Blocked Shots
            stats.bigChancesMissed, # Big Chances Missed
            0,                    # Penalties Scored
            stats.assists,        # Assists
            0,                    # Shots Blocked
            stats.yellowcards,    # Yellowcards
            stats.saves,          # Saves
            0,                    # Saves Insidebox
            0,                    # Goalkeeper Goals Conceded
            0,                    # Penalties Committed
            0,                    # Offsides
            0,                    # Aerials Lost
            0,                    # Through Balls
            stats.throughBallsWon,# Through Balls Won
            stats.redcards,       # Redcards
            0,                    # Hit Woodwork
            0,                    # Punches
            stats.errorLeadToGoal,# Error Lead To Goal
            0,                    # Clearance Offline
            stats.yellowredCards, # Yellowred Cards
            0,                    # Chances Created
            0,                    # Ball Recovery
            0,                    # Backward Passes
            0,                    # Long Balls Won Percentage
            0,                    # Passes In Final Third
            aerial_success_rate,  # Aerials Won Percentage
            stats.possessionLost, # Possession Lost
            stats.aerials,        # Aerials
            tackle_success_rate,  # Tacles Won Percentage
            stats.tacklesWon,     # Tackles Won
            0,                    # Successful Crosses Percentage
            duels_success_rate,   # Duels Won Percentage
            stats.errorLeadToShot,# Error Lead To Shot
            0,                    # Offsides Provoked
            0,                    # Turn Over
            0,                    # Good High Claim
            stats.lastManTackle,  # Last Man Tackle
            0,                    # Own Goals
            0,                    # Penalties Missed
            0,                    # Penalties Saved
            # Ek özellikler
            goal_contribution,
            goal_contribution_per_90,
            big_chance_contribution,
            key_passes_per_90,
            through_balls_per_90,
            defensive_actions,
            defensive_actions_per_90,
            possession_lost_per_90,
            dribbles_success_rate,
            shot_accuracy,
            shots_per_90,
            save_rate,
            saves_per_90,
            discipline_penalty,
            error_penalty,
            last_man_tackle_penalty
        ]
        
        # Eksik özellikleri 0 ile doldur (90 özelliğe tamamla)
        while len(features) < 90:
            features.append(0)
        
        logger.info(f"Toplam özellik sayısı: {len(features)}")
        return features
    except Exception as e:
        logger.error(f"Özellik oluşturulurken hata: {e}")
        raise

def predict_player_rating(stats: PlayerStats) -> float:
    try:
        # Özellikleri oluştur
        features = create_features(stats)
        
        # Özellikleri numpy dizisine dönüştür
        features_array = np.array(features).reshape(1, -1)
        
        # Ölçeklendirme
        features_scaled = scaler.transform(features_array)
        
        # Tahmin
        predicted_rating = model.predict(features_scaled)[0]
        
        # Olumsuz istatistikler için direkt cezalar
        if stats.redcards > 0:
            predicted_rating -= 1.5
        if stats.errorLeadToGoal > 0:
            predicted_rating -= 1.5
        if stats.yellowredCards > 0:
            predicted_rating -= 0.6
        if stats.yellowcards > 0:
            predicted_rating -= 0.3
        
        # Rating'i 0-10 arasında tut
        predicted_rating = max(0, min(10, predicted_rating))
        
        logger.info(f"Tahmin edilen rating: {predicted_rating}")
        return predicted_rating
    except Exception as e:
        logger.error(f"Rating tahmini yapılırken hata: {e}")
        raise

@app.post("/predict")
async def predict(stats: PlayerStats):
    try:
        logger.info(f"Gelen veri: {stats.dict()}")
        
        # Tahmin yap
        rating = predict_player_rating(stats)
        
        return {"rating": float(rating)}
    except Exception as e:
        logger.error(f"Tahmin yapılırken hata: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 