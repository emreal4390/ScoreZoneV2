import { BrowserRouter as Router } from 'react-router-dom';
import Standings from './components/Standings';
import NewsSlider from './components/NewsSlider';
import Fixtures from './components/Fixtures';
import TopScorers from './components/TopScorers';
import './App.css';

function App() {
    return (
        <Router>
            <>
                <header className="app-navbar">
                    <div className="navbar-logo">ScoreZone</div>
                    <nav className="navbar-menu">
                        <a href="/">Ana Sayfa</a>
                        <a href="/standings">Puan Durumu</a>
                    </nav>
                </header>
                <div className="main-layout">
                    <aside className="left-panel">
                        <Standings />
                        <Fixtures limit={10} />
                    </aside>
                    <main className="center-panel">
                        <NewsSlider />
                        <TopScorers />
                    </main>
                </div>
            </>
        </Router>
    );
}

export default App;
