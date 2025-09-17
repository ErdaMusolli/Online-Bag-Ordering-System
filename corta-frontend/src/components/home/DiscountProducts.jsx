import React, { useEffect, useState } from 'react';
import api, { API_ORIGIN } from "../../services/apiClient";

const staticNews = [
  { id: 1, title: 'New Organic Products Launched', date: 'January 12, 2025', image: '/News1.jpg', link: '/news/1' },
  { id: 2, title: 'Discount for First Orders', date: 'January 10, 2025', image: '/News2.jpg', link: '/news/2' },
  { id: 3, title: 'About Us', date: 'January 8, 2025', image: '/News3.jpg', link: '/news/3' },
];

const DiscountProducts = () => {
  const [newsItems, setNewsItems] = useState(staticNews);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const { data } = await api.get("/news");
        const raw = Array.isArray(data?.$values) ? data.$values : data;
        if (!Array.isArray(raw)) throw new Error("Invalid format");

        const backend = raw.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.content,
          date: item.datePublished,
          image: item.imageUrl ? new URL(item.imageUrl, API_ORIGIN).href : "",
          link: `/news/${item.id}`,
        }));

        const merged = [...staticNews];
        backend.forEach((b) => {
          if (!merged.some((s) => s.id === b.id)) merged.push(b);
        });

        if (alive) setNewsItems(merged);
      } catch (err) {
        if (alive) setError(err.message || "Failed to fetch news");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  if (loading) return <div className="text-center mt-5">Loading…</div>;
  if (error)   return <div className="alert alert-danger text-center mt-5">Error: {error}</div>;

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
