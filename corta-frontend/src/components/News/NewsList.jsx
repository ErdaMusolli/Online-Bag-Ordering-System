import React, { useEffect, useState } from 'react';

const staticNews = [
  {
    id: 1,
    title: 'New Organic Products Launched',
    date: 'January 12, 2025',
    image: '/News1.jpg',
    link: '/news/1',
  },
  {
    id: 2,
    title: 'Discount for First Orders',
    date: 'January 10, 2025',
    image: '/News2.jpg',
    link: '/news/2',
  },
  {
    id: 3,
    title: 'About Us',
    date: 'January 8, 2025',
    image: '/News3.jpg',
    link: '/news/3',
  },
  {
    id: 4,
    title: 'New Fall/Winter Collection 2024',
    date: 'October 1, 2024',
    description: 'Embrace the cold season with our latest selection of warm, stylish garments crafted with sustainable materials.',
    image: '/News4.jpg',
    link: '/news/4',
  },
  {
    id: 5,
    title: 'Welcome the Spring Collection 2025!',
    date: 'May 10, 2025',
    description: 'Fresh colors, light fabrics, and floral patterns to brighten your days while staying eco-friendly.',
    image: '/News5.jpg',
    link: '/news/5',
  },
];

const NewsList = () => {
  const [newsItems, setNewsItems] = useState(staticNews);
  const [slideIndex, setSlideIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5197/api/news')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch news');
        return res.json();
      })
      .then((data) => {
        try {
          const rawNewsArray = data?.$values || data;

          if (!Array.isArray(rawNewsArray)) {
            throw new Error('Fetched data is not an array');
          }

          const backendNews = rawNewsArray.map(item => ({
            id: item.id,
            title: item.title,
            description: item.content,
            author: item.author,
            date: item.datePublished,
            image: item.imageUrl,
            link: `/news/${item.id}`,
          }));

          const mergedNews = [...staticNews];
          backendNews.forEach(item => {
            if (!mergedNews.find(n => n.id === item.id)) {
              mergedNews.push(item);
            }
          });

          setNewsItems(mergedNews);
        } catch (processingError) {
          console.error("⚠️ Error processing fetched data:", processingError);
          setError(processingError.message);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(prev => (newsItems.length ? (prev + 1) % newsItems.length : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [newsItems.length]);

  if (error) {
    return <div className="alert alert-danger text-center mt-5">Error: {error}</div>;
  }

  return (
    <div className="w-100 px-4 mt-5 pt-5">

      <div className="position-relative mb-5" style={{ height: '400px' }}>
        {newsItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              display: index === slideIndex ? 'block' : 'none',
              position: 'absolute',
              width: '100%',
              height: '400px',
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '10px',
              }}
            />
            <div
              className="position-absolute bottom-0 start-0 m-3 text-white bg-dark bg-opacity-75 p-3 rounded"
              style={{ maxWidth: '70%' }}
            >
              <h2>{item.title}</h2>
              <p>{item.date ? new Date(item.date).toLocaleDateString() : ''}</p>
              {item.description && <p>{item.description}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="row justify-content-center text-center">
        {newsItems.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <a href={item.link}>
              <img
                src={item.image}
                alt={item.title}
                className="img-fluid rounded border"
                style={{ width: '100%', height: '350px', objectFit: 'cover' }}
              />
            </a>
            <h4 className="mt-3">{item.title}</h4>
            <p>{item.date ? new Date(item.date).toLocaleDateString() : ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsList;





















