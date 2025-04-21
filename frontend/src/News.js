import React, { useEffect, useState } from 'react';

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = () => {
    setLoading(true);
    setError(null);
    fetch('https://btowner18.onrender.com/api/news')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setArticles([]);
        } else {
          setArticles(data.news || []);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch news.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Skeleton loader for news cards
  const NewsSkeleton = () => (
    <ul className="news-list" style={{ listStyle: 'none', padding: 0 }}>
      {[1,2,3].map(i => (
        <li key={i} style={{ marginBottom: 24, background: '#232323', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px #0004', minHeight: 60 }}>
          <div className="skeleton-title" style={{ width: '60%', height: 18, background: '#333', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s infinite' }}></div>
          <div className="skeleton-date" style={{ width: '40%', height: 12, background: '#333', borderRadius: 4, animation: 'pulse 1.5s infinite' }}></div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="news-container" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'transparent', padding: 12 }}>
      <div className="news-card" style={{ background: '#1A1A1A', borderRadius: 18, boxShadow: '0 4px 24px #0008', padding: 24, maxWidth: 700, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ textAlign: 'center', color: '#9B59B6', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, margin: 0 }}>Live Crypto News</h2>
          <button onClick={fetchNews} style={{ background: '#9B59B6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, cursor: 'pointer', marginLeft: 12 }}>Refresh</button>
        </div>
        {loading && <NewsSkeleton />}
        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: 12 }}>{error}</div>}
        {!loading && !error && articles.length === 0 && (
          <div style={{ color: '#aaa', textAlign: 'center', marginBottom: 12 }}>No news articles available.</div>
        )}
        <ul className="news-list" style={{ listStyle: 'none', padding: 0 }}>
          {!loading && !error && articles.map(article => (
            <li key={article.id} style={{ marginBottom: 24, background: '#232323', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px #0004' }}>
              <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: '#9B59B6', fontSize: 18, textDecoration: 'none' }}>
                {article.title}
              </a>
              <div style={{ fontSize: 13, color: '#aaa', marginTop: 6 }}>{new Date(article.feedDate).toLocaleString()}</div>
              {article.source && <span style={{ fontSize: 12, color: '#888' }}>Source: {article.source}</span>}
            </li>
          ))}
        </ul>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .news-card {
            padding: 10px !important;
            max-width: 100vw !important;
          }
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default News;
