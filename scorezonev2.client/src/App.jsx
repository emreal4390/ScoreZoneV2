import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Standings from './components/Standings';
import PlayerCard from './components/PlayerCard';
import NewsSlider from './components/NewsSlider';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <header className="app-header">
                    <div className="logo"> ScoreZone</div>
                    <nav className="app-nav">
                        <Link to="/">Ana Sayfa</Link>
                        <Link to="/standings">Puan Durumu</Link>
                    </nav>
                </header>

                <main className="app-content">
                    <Routes>
                        <Route path="/" element={
                            <>
                                <h1 className="section-title">Günün Futbol Haberleri</h1>
                                <NewsSlider />
                            </>
                        } />
                        <Route path="/standings" element={<Standings />} />
                        <Route path="/players/:id" element={<PlayerCard playerId={14} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
