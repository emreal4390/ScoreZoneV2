import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Standings from './components/Standings';
import NewsSlider from './components/NewsSlider';
import Fixtures from './components/Fixtures';
import TopScorers from './components/TopScorers';
import TeamProfile from './pages/TeamProfile';
import PlayerRating from './pages/PlayerRating.jsx';
import Feed from './pages/Feed';
import PlayerProfile from './pages/PlayerProfile';
import FeaturedPlayers from './components/FeaturedPlayers';
import PlayerComparison from './components/PlayerComparison';
import SportsNews from './components/SportsNews';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <header className="app-navbar">
                    <Link to="/" className="navbar-logo">ScoreZone</Link>
                    <nav className="navbar-menu">
                        <Link to="/">Ana Sayfa</Link>
                        <Link to="/player-rating">Rating Hesaplama</Link>
                        <Link to="/feed">Akış</Link>
                    </nav>
                </header>
                <main className="app-content">
                    <Routes>
                        <Route path="/" element={
                            <div className="main-layout">
                                <aside className="left-panel">
                                    <Standings />
                                    <TopScorers />
                                </aside>
                                <main className="center-panel">
                                    <NewsSlider />
                                    <FeaturedPlayers />
                                    <Fixtures limit={9} />
                                </main>
                                <aside className="right-panel">
                                    <PlayerComparison />
                                    <SportsNews />
                                </aside>
                            </div>
                        } />
                        <Route path="/teams/:teamId" element={<TeamProfile />} />
                        <Route path="/player-rating" element={<PlayerRating />} />
                        <Route path="/feed" element={<Feed />} />
                        <Route path="/players/:playerId" element={<PlayerProfile />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
