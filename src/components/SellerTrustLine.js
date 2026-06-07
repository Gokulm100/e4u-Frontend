import React from 'react';
import SellerRating from './SellerRating';
import TrustBadge from './TrustBadge';

export default function SellerTrustLine({
  ratingAvg = 0,
  reviewCount = 0,
  completedSales = 0,
  badges = [],
  trustScore,
  size = 'md',
  showScore = false,
}) {
  return (
    <div className="seller-trust-line">
      <SellerRating
        ratingAvg={ratingAvg}
        reviewCount={reviewCount}
        completedSales={completedSales}
        size={size === 'md' ? 'md' : 'sm'}
      />
      <TrustBadge badges={badges} trustScore={trustScore} size={size === 'md' ? 'md' : 'sm'} showScore={showScore} />
    </div>
  );
}
