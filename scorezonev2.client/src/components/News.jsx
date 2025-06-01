import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css';

const News = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const options = {
            method: 'GET',
            url: 'https://football-news-aggregator-live.p.rapidapi.com/news/fourfourtwo/bundesliga',
            headers: {
                'x-rapidapi-host': 'football-news-aggregator-live.p.rapidapi.com',
                'x-rapidapi-key': '2e90ed0ccbmsh0024f2cdce88508p15317ajsn182b3743ecfc'
            },
        };

        axios.request(options)
            .then((response) => {
                setArticles(response.data);
            })
            .catch((error) => {
                console.error('Haber çekme hatasý:', error);
            });
    }, []);

    return (
        <div className="news-container">
            <h2 className="news-title">Bundesliga Haberleri (FourFourTwo)</h2>
            <ul className="news-list">
                {articles.map((item, i) => (
                    <li key={i}>
                        <a href={item.link} target="_blank" rel="noreferrer">
                            {item.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default News;
