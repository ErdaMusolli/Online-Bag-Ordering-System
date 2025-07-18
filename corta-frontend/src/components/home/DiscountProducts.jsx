import React, { useEffect, useState } from 'react';

const staticNews = [
  { id: 1, title: 'New Organic Products Launched', date: 'January 12, 2025', image: '/News1.jpg', link: '/news/1' },
  { id: 2, title: 'Discount for First Orders', date: 'January 10, 2025', image: '/News2.jpg', link: '/news/2' },
  { id: 3, title: 'About Us', date: 'January 8, 2025', image: '/News3.jpg', link: '/news/3' },
];

const DiscountProducts = () => {
  const [newsItems, setNewsItems] = useState(staticNews);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5197/api/news')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch news');
        return res.json();
      })
      .then((data) => {
        const raw = data?.$values || data;
        if (!Array.isArray(raw)) throw new Error('Invalid format');
        const backend = raw.map(item => ({
          id: item.id,
          title: item.title,
          description: item.content,
          date: item.datePublished,
          image: item.imageUrl,
          link: `/news/${item.id}`
        }));
        const merged = [
          ...staticNews,
          ...backend.filter(b => !staticNews.some(s => s.id === b.id))
        ];
        setNewsItems(merged);
      })
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div className="alert alert-danger text-center mt-5">Error: {error}</div>;

  return (
    <div id="homeSlider" className="carousel slide mb-5" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {newsItems.map((_, idx) => (
          <button
            key={idx}
            type="button"
            data-bs-target="#homeSlider"
            data-bs-slide-to={idx}
            className={idx === 0 ? 'active' : ''}
            aria-current={idx === 0 ? 'true' : undefined}
            aria-label={`Slide ${idx+1}`}
          />
        ))}
      </div>

      <div className="carousel-inner rounded" style={{ height: '300px', maxWidth: '800px', margin: '0 auto' }}>
        {newsItems.map((item, idx) => (
          <div key={item.id} className={`carousel-item${idx === 0 ? ' active' : ''}`}>
            <a href={item.link}>
              <img
                src={item.image}
                className="d-block w-100"
                alt={item.title}
                style={{ height: '300px', objectFit: 'cover', borderRadius: '10px' }}
              />
            </a>
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
              <h5 className="mb-1">{item.title}</h5>
              <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                {item.date ? new Date(item.date).toLocaleDateString() : ''}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#homeSlider" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#homeSlider" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default DiscountProducts;
