import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import '../styles/Feed.css';

const Feed = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Transfermarkt haberlerini çek
                const transfermarktResponse = await axios.get('/api/news/transfermarkt');
                const transfermarktParser = new DOMParser();
                const transfermarktXml = transfermarktParser.parseFromString(transfermarktResponse.data, 'text/xml');
                const transfermarktItems = transfermarktXml.getElementsByTagName('item');
                
                // Fox Sports haberlerini çek
                const foxSportsResponse = await axios.get('/api/news/foxsports');
                const foxSportsParser = new DOMParser();
                const foxSportsXml = foxSportsParser.parseFromString(foxSportsResponse.data, 'text/xml');
                const foxSportsItems = foxSportsXml.getElementsByTagName('item');

                // Transfermarkt haberlerini işle
                const transfermarktNews = Array.from(transfermarktItems).map(item => ({
                    title: item.getElementsByTagName('title')[0].textContent.trim(),
                    link: item.getElementsByTagName('link')[0].textContent.trim(),
                    pubDate: new Date(item.getElementsByTagName('pubDate')[0].textContent.trim()),
                    description: item.getElementsByTagName('description')[0].textContent.trim(),
                    author: item.getElementsByTagName('author')[0].textContent.trim(),
                    source: 'Transfermarkt'
                }));

                // Fox Sports haberlerini işle
                const foxSportsNews = Array.from(foxSportsItems).map(item => {
                    const mediaContent = item.getElementsByTagName('media:content')[0];
                    const imageUrl = mediaContent ? mediaContent.getAttribute('url') : null;
                    
                    return {
                        title: item.getElementsByTagName('title')[0].textContent.trim(),
                        link: item.getElementsByTagName('link')[0].textContent.trim(),
                        pubDate: new Date(item.getElementsByTagName('pubDate')[0].textContent.trim()),
                        description: item.getElementsByTagName('description')[0].textContent.trim(),
                        imageUrl,
                        source: 'Fox Sports'
                    };
                });

                // Tüm haberleri birleştir ve tarihe göre sırala
                const allNews = [...transfermarktNews, ...foxSportsNews]
                    .sort((a, b) => b.pubDate - a.pubDate);

                setNews(allNews);
                setLoading(false);
            } catch (err) {
                setError('Haberler yüklenirken bir hata oluştu.');
                setLoading(false);
                console.error('Haber yükleme hatası:', err);
            }
        };

        fetchNews();
    }, []);

    if (loading) return (
        <div className="feed-loading">
            <div className="loading-spinner"></div>
            <p>Haberler Yükleniyor...</p>
        </div>
    );
    
    if (error) return (
        <div className="feed-error">
            <i className="error-icon">⚠️</i>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="feed-container">
            <h1>Futbol Haberleri</h1>
            <div className="feed-list">
                {news.map((item, index) => (
                    <article key={index} className="feed-item">
                        {item.imageUrl && (
                            <div className="feed-image-container">
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.title}
                                    className="feed-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://www.transfermarkt.com.tr/images/logo.png';
                                    }}
                                />
                            </div>
                        )}
                        <div className="feed-content">
                            <div className="feed-source">
                                <span className={`source-badge ${item.source.toLowerCase().replace(' ', '-')}`}>
                                    {item.source}
                                </span>
                            </div>
                            <h2 className="feed-title">
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    {item.title}
                                </a>
                            </h2>
                            <div className="feed-meta">
                                <span className="feed-date">
                                    <i className="fas fa-calendar-alt"></i>
                                    {format(item.pubDate, 'd MMMM yyyy HH:mm', { locale: tr })}
                                </span>
                                {item.author && (
                                    <span className="feed-author">
                                        <i className="fas fa-user"></i>
                                        {item.author}
                                    </span>
                                )}
                            </div>
                            <div 
                                className="feed-description"
                                dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                            <div className="feed-actions">
                                <div className="feed-interactions">
                                    <button className="interaction-btn like-btn">
                                        <i className="far fa-heart"></i>
                                        <span>Beğen</span>
                                    </button>
                                    <button className="interaction-btn comment-btn">
                                        <i className="far fa-comment"></i>
                                        <span>Yorum Yap</span>
                                    </button>
                                    <button className="interaction-btn share-btn">
                                        <i className="fas fa-share"></i>
                                        <span>Paylaş</span>
                                    </button>
                                </div>
                                <div className="feed-reactions">
                                    <button className="reaction-btn">
                                        <i className="far fa-thumbs-up"></i>
                                    </button>
                                    <button className="reaction-btn">
                                        <i className="far fa-laugh"></i>
                                    </button>
                                    <button className="reaction-btn">
                                        <i className="far fa-surprise"></i>
                                    </button>
                                    <button className="reaction-btn">
                                        <i className="far fa-angry"></i>
                                    </button>
                                </div>
                            </div>
                            <a 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="read-more"
                            >
                                Devamını Oku
                                <i className="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Feed; 