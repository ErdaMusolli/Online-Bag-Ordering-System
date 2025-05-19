import React, { useState } from 'react';
 
const StarRating = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
 
  return (
<div style={{ marginTop: '5px' }}>
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
  );
};
 
export default StarRating;

 