import React from 'react';
import { MapPin, Eye } from 'lucide-react';

const FALLBACK = 'https://images.pexels.com/photos/10703759/pexels-photo-10703759.jpeg';

export default function AdCard({ listing, onClick }) {
  return (
    <div className="ad-card" onClick={() => onClick(listing)}>
      <div className="ad-card-img-wrap">
        <img
          className="ad-card-img"
          src={listing.images[0]}
          alt={listing.title}
          onError={e => { e.target.src = FALLBACK; }}
        />
        <div className="ad-cat-tag">{listing.category}</div>
      </div>
      <div className="ad-card-body">
        <div className="ad-title">{listing.title}</div>
        <div className="ad-price">₹{Number(listing.price).toLocaleString('en-IN')}</div>
        <div className="ad-meta">
          <div className="ad-meta-item"><MapPin size={12} /> {listing.location}</div>
          <div className="ad-meta-item"><Eye size={12} /> {listing.views}</div>
        </div>
        <div className="ad-posted">{listing.posted}</div>
      </div>
    </div>
  );
}
