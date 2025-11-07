import React from 'react';
import { Heart, MapPin, Eye } from 'lucide-react';

function getCategoryGradient(category) {
  const gradients = {
    Electronics: 'linear-gradient(90deg, #a4d3f9ff 0%, #f7f7f7 100%)',
    Furniture: 'linear-gradient(90deg, #c1f7d3 0%, #f7f7f7 100%)',
    Vehicles: 'linear-gradient(90deg, #ffe5b4 0%, #f7f7f7 100%)',
    RealEstate: 'linear-gradient(90deg, #4af2b5ff 0%, #f3acacff 100%)',
    Services: 'linear-gradient(90deg, #d0bdf4 0%, #f7f7f7 100%)',
    Games: 'linear-gradient(90deg, #fac3ecff 0%, #f7f7f7 100%)',
    Uncategorized: 'linear-gradient(90deg, #f7cac9 0%, #f7f7f7 100%)'
  };
  return gradients[category] || 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)';
}


const Favorites = ({ styles, favorites, listings, setLastListView, setSelectedListing, setView, toggleFavorite }) => (
  <div style={styles.container}>
    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>My Favorites</h2>
    {favorites.length === 0 ? (
      <div style={styles.emptyState}>
        <Heart style={{ width: '64px', height: '64px', color: '#d1d5db', margin: '0 auto 16px' }} />
        <p style={styles.emptyText}>No favorites yet</p>
        <button style={{ ...styles.backButton, marginTop: '16px' }} onClick={() => setView('home')}>
          Start browsing
        </button>
      </div>
    ) : (
      <div style={styles.grid}>
        {listings
          .filter(listing => favorites.includes(listing.id) || favorites.includes(listing._id))
          .map((listing, idx) => (
            <div
              key={listing.id || idx}
              style={styles.card}
              onClick={() => {
                setLastListView('favorites');
                setSelectedListing(listing);
                setView('detail');
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)')}
            >
              <div style={styles.cardImageWrapper}>
                <img
                  src={listing.image}
                  alt={listing.title}
                  style={styles.cardImage}
                  onError={e => {
                    e.target.src = 'https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg';
                    e.target.alt = 'Image not found';
                  }}
                />
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleFavorite(listing.id);
                  }}
                  style={styles.favoriteButton}
                >
                  <Heart style={{ ...styles.favoriteIcon, ...styles.favoriteIconActive }} />
                </button>
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{listing.title}</h3>
                <p style={{ margin: '4px 0', textAlign: 'left' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: 13,
                    fontWeight: 600,
                    background: getCategoryGradient(listing.category),
                    color: '#333',
                    letterSpacing: 0.5,
                    minWidth: 60,
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.07)'
                  }}>{listing.category}</span>
                </p>
                <p style={styles.cardPrice}>₹{listing.price.toLocaleString()}</p>
                <div style={styles.cardLocation}>
                  <MapPin style={{ width: '16px', height: '16px' }} />
                  {listing.location}
                </div>
                <p style={styles.cardPosted}>
                  {listing.posted}
                  <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', color: '#6b7280', fontSize: 14 }}>
                    <Eye style={{ width: 16, height: 16, marginRight: 4 }} />
                    {typeof listing.views === 'number' ? listing.views : 0}
                  </span>
                </p>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
);

export default Favorites;
