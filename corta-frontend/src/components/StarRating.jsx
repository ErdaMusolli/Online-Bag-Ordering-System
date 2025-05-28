import React, { useState } from 'react';
 

function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
 
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
 
const StarRating = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
 
  const submitReview = async (selectedRating) => {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();
 
    if (!token || !userId) {
      setMessage('You must be logged in to submit a review.');
      return;
    }
 
    const reviewData = {
      userId: userId,               
      productId: productId,
      rating: selectedRating
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
        setRating(selectedRating);
      } else {
        const errorText = await res.text();
        console.error("Review submission failed:", errorText);
        setMessage('Failed to add review.');
      }
    } catch (error) {
      console.error('Network error:', error);
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
              onClick={() => submitReview(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
>
              ★
</span>
          );
        })}
</div>
 
      {message && (
<div style={{ marginTop: '10px', color: message.includes('success') ? 'green' : 'red' }}>
          {message}
</div>
      )}
</div>
  );
};
 
export default StarRating;
 