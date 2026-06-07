import React from 'react';
import { Star } from 'lucide-react';

export default function SellerRating({ ratingAvg = 0, reviewCount = 0, completedSales = 0, size = 'md' }) {
  const hasReviews = reviewCount > 0;
  const starSize = size === 'sm' ? 14 : 16;

  return (
    <div className="seller-rating">
      <Star size={starSize} fill="#f59e0b" color="#f59e0b" />
      <span className="seller-rating-value">{hasReviews ? Number(ratingAvg).toFixed(1) : 'New'}</span>
      {hasReviews && (
        <span className="seller-rating-meta">
          ({reviewCount} review{reviewCount === 1 ? '' : 's'})
        </span>
      )}
      {completedSales > 0 && (
        <span className="seller-rating-meta">
          · {completedSales} sale{completedSales === 1 ? '' : 's'}
        </span>
      )}
    </div>
  );
}
