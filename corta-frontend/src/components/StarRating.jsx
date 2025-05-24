import React, { useState } from 'react';

const StarRating = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to submit a review.');
      return;
    }

    const reviewData = {
      productId: productId,
      rating: rating,
    };

    try {
      const res = await fetch('http://localhost:5197/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (res.ok) {
        setMessage('Review added successfully!');
        setRating(0);
      } else {
        setMessage('Failed to add review.');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setMessage('Network error.');
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ marginBottom: '10px' }}>
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={index}
              style={{
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: starValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'
              }}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          );
        })}
      </div>

      <button className="btn btn-primary" onClick={handleSubmit} disabled={rating === 0}>
        Dërgo Review
      </button>

      {message && <div style={{ marginTop: '10px', color: message.includes('sucsess') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
};

export default StarRating;
