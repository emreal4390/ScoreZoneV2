import React, { useState, useEffect } from 'react';
import backend from '../api/backend';
import '../styles/SportsNews.css';

const SportsNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            
            const response = await backend.get('/news/sportsnews');
            const data = response.data;
            
            if (data.status === 'ok' && data.articles) {
                setNews(data.articles);
            } else {
                setError('Haberler yüklenirken bir hata oluştu.');
            }
        } catch (err) {
            console.error('SportsNews API hatası:', err);
            setError('Haberler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const nextNews = () => {
        setCurrentNewsIndex((prev) => (prev + 1) % news.length);
    };

    const prevNews = () => {
        setCurrentNewsIndex((prev) => (prev - 1 + news.length) % news.length);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Az önce';
        } else if (diffInHours < 24) {
            return `${diffInHours} saat önce`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} gün önce`;
        }
    };

    const truncateText = (text, maxLength = 80) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (loading) {
        return (
            <div className="sports-news-container">
                <h2>Diğer Spor Haberleri</h2>
                <div className="news-loading">
                    <div className="loading-spinner"></div>
                    <p>Haberler yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="sports-news-container">
                <h2>Diğer Spor Haberleri</h2>
                <div className="news-error">
                    <p>{error}</p>
                    <button onClick={fetchNews} className="retry-btn">Tekrar Dene</button>
                </div>
            </div>
        );
    }

    if (news.length === 0) {
        return (
            <div className="sports-news-container">
                <h2>Diğer  Spor Haberleri</h2>
                <div className="no-news">
                    <p>Şu anda haber bulunamadı.</p>
                </div>
            </div>
        );
    }

    const currentArticle = news[currentNewsIndex];

    return (
        <div className="sports-news-container">
            <h2>Diğer Spor Haberleri</h2>
            
            <div className="news-card">
                <div className="news-image-container">
                    <img 
                        src={currentArticle.urlToImage} 
                        alt={currentArticle.title}
                        className="news-image"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Haber+Resmi';
                        }}
                    />
                    <div className="news-overlay">
                        <div className="news-source">{currentArticle.source.name}</div>
                        <div className="news-date">{formatDate(currentArticle.publishedAt)}</div>
                    </div>
                </div>
                
                <div className="news-content">
                    <h3 className="news-title">
                        <a 
                            href={currentArticle.articleUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="news-link"
                        >
                            {truncateText(currentArticle.title, 60)}
                        </a>
                    </h3>
                    
                    <p className="news-description">
                        {truncateText(currentArticle.description, 100)}
                    </p>
                    
                    {currentArticle.author && (
                        <div className="news-author">
                            Yazar: {currentArticle.author}
                        </div>
                    )}
                </div>
                
                <div className="news-navigation">
                    <button 
                        onClick={prevNews} 
                        className="nav-btn prev-btn"
                        disabled={news.length <= 1}
                    >
                        ‹
                    </button>
                    
                    <div className="news-indicators">
                        {news.map((_, index) => (
                            <span 
                                key={index} 
                                className={`indicator ${index === currentNewsIndex ? 'active' : ''}`}
                                onClick={() => setCurrentNewsIndex(index)}
                            />
                        ))}
                    </div>
                    
                    <button 
                        onClick={nextNews} 
                        className="nav-btn next-btn"
                        disabled={news.length <= 1}
                    >
                        ›
                    </button>
                </div>
            </div>
            
            <div className="news-footer">
                <a 
                    href="https://newsapi.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="news-api-link"
                >
                    NewsAPI ile güçlendirildi
                </a>
            </div>
        </div>
    );
};

export default SportsNews; 