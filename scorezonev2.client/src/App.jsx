import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Standings from './components/Standings';
import NewsSlider from './components/NewsSlider';
import Fixtures from './components/Fixtures';
import TopScorers from './components/TopScorers';
import TeamProfile from './pages/TeamProfile';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <header className="app-navbar">
                    <div className="navbar-logo">ScoreZone</div>
                    <nav className="navbar-menu">
                        <a href="/">Ana Sayfa</a>
                        <a href="/standings">Puan Durumu</a>
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
                                    <Fixtures limit={9} />
                                </main>
                            </div>
                        } />
                        <Route path="/teams/:teamId" element={<TeamProfile />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
