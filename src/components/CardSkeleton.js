import React from "react";
import "./Skeleton.css";

export default function CardSkeleton({ isMobile }) {
  const skeletonCards = Array.from({ length: isMobile ? 6 : 8 });

  return (
      <div className="skeleton-card-container"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr 1fr',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        {skeletonCards.map((_, idx) => (
          <div className=" skeleton skeleton-card" key={idx} style={isMobile ? { width: '100%' } : {}}>
            <div className="skeleton skeleton-image" />
            <div className="skeleton skeleton-content">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
            </div>
          </div>
        ))}
      </div>
  );
}
