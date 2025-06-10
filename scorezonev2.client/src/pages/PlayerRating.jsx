import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useApi } from '../hooks/useApi.jsx';

const initialStats = {
  minutesPlayed: 0,
  goals: 0,
  assists: 0,
  shotsTotal: 0,
  shotsOnTarget: 0,
  passes: 0,
  accuratePasses: 0,
  keyPasses: 0,
  dribbleAttempts: 0,
  successfulDribbles: 0,
  tackles: 0,
  tacklesWon: 0,
  interceptions: 0,
  clearances: 0,
  duelsWon: 0,
  totalDuels: 0,
  aerialsWon: 0,
  aerials: 0,
  possessionLost: 0,
  bigChancesCreated: 0,
  bigChancesMissed: 0,
  throughBallsWon: 0,
  redcards: 0,
  yellowcards: 0,
  yellowredCards: 0,
  errorLeadToGoal: 0,
  errorLeadToShot: 0,
  lastManTackle: 0,
  saves: 0,
  goalsConceded: 0
};

const PlayerRating = () => {
  const [stats, setStats] = useState(initialStats);
  const [rating, setRating] = useState(null);
  const { post, loading, error } = useApi();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStats(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRating(null);

    try {
      const response = await post('/api/PlayerRating/predict', stats);
      setRating(response.rating);
    } catch (err) {
      console.error('Rating hesaplama hatası:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Oyuncu Rating Hesaplama
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} columns={12}>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Dakika"
                name="minutesPlayed"
                type="number"
                value={stats.minutesPlayed}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Gol"
                name="goals"
                type="number"
                value={stats.goals}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Asist"
                name="assists"
                type="number"
                value={stats.assists}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Toplam Şut"
                name="shotsTotal"
                type="number"
                value={stats.shotsTotal}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="İsabetli Şut"
                name="shotsOnTarget"
                type="number"
                value={stats.shotsOnTarget}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Pas"
                name="passes"
                type="number"
                value={stats.passes}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="İsabetli Pas"
                name="accuratePasses"
                type="number"
                value={stats.accuratePasses}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Kritik Pas"
                name="keyPasses"
                type="number"
                value={stats.keyPasses}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Dribling Denemesi"
                name="dribbleAttempts"
                type="number"
                value={stats.dribbleAttempts}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Başarılı Dribling"
                name="successfulDribbles"
                type="number"
                value={stats.successfulDribbles}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Müdahale"
                name="tackles"
                type="number"
                value={stats.tackles}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Başarılı Müdahale"
                name="tacklesWon"
                type="number"
                value={stats.tacklesWon}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Top Çalma"
                name="interceptions"
                type="number"
                value={stats.interceptions}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Top Temizleme"
                name="clearances"
                type="number"
                value={stats.clearances}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Kazanılan Düello"
                name="duelsWon"
                type="number"
                value={stats.duelsWon}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Toplam Düello"
                name="totalDuels"
                type="number"
                value={stats.totalDuels}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Kazanılan Hava Topu"
                name="aerialsWon"
                type="number"
                value={stats.aerialsWon}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Toplam Hava Topu"
                name="aerials"
                type="number"
                value={stats.aerials}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Top Kaybı"
                name="possessionLost"
                type="number"
                value={stats.possessionLost}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Büyük Fırsat Yaratma"
                name="bigChancesCreated"
                type="number"
                value={stats.bigChancesCreated}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Kaçırılan Büyük Fırsat"
                name="bigChancesMissed"
                type="number"
                value={stats.bigChancesMissed}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Başarılı Uzun Pas"
                name="throughBallsWon"
                type="number"
                value={stats.throughBallsWon}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Kırmızı Kart"
                name="redcards"
                type="number"
                value={stats.redcards}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Sarı Kart"
                name="yellowcards"
                type="number"
                value={stats.yellowcards}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="İki Sarı Kart"
                name="yellowredCards"
                type="number"
                value={stats.yellowredCards}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Gol Hatası"
                name="errorLeadToGoal"
                type="number"
                value={stats.errorLeadToGoal}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Şut Hatası"
                name="errorLeadToShot"
                type="number"
                value={stats.errorLeadToShot}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Son Adam Müdahalesi"
                name="lastManTackle"
                type="number"
                value={stats.lastManTackle}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Kurtarış"
                name="saves"
                type="number"
                value={stats.saves}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid span={6}>
              <TextField
                fullWidth
                label="Yenen Gol"
                name="goalsConceded"
                type="number"
                value={stats.goalsConceded}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Rating Hesapla'}
            </Button>
          </Box>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {rating !== null && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Oyuncu Ratingi: {rating.toFixed(2)}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default PlayerRating; 