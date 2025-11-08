import React from 'react';
import { MapPin, Heart, Eye } from 'lucide-react';
import Chat from './chat';
import AiSummary from '../components/aiSummary';

const AdDetail = ({
  styles,
  selectedListing,
  lastListView,
  setView,
  currentImageIdx,
  setCurrentImageIdx,
  favorites,
  toggleFavorite,
  messageCount,
  user,
  setChatOpen,
  chatOpen,
  chatMessages,
  setChatMessages,
  chatInput,
  setChatInput,
  selectedMessage,
  setSelectedMessage,
  API_BASE_URL
}) => {
  if (!selectedListing) return null;
  const images = Array.isArray(selectedListing.images) && selectedListing.images.length > 0
    ? selectedListing.images
    : selectedListing.image
      ? [selectedListing.image]
      : [];
  const fallback = 'https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg';

  return (
    <div style={styles.detailContainer}>
      <button style={styles.backButton} onClick={() => setView(lastListView)}>
        ← Back to listings
      </button>
      <div style={styles.detailCard}>
        {/* Image carousel logic */}
        <div style={{ position: 'relative', textAlign: 'center' }}>
          {images.length > 1 && (
            <button
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 44,
                height: 44,
                fontSize: 28,
                cursor: 'pointer',
                zIndex: 2,
                boxShadow: '0 2px 8px rgba(37,99,235,0.18)'
              }}
              onClick={() => setCurrentImageIdx(idx => (idx === 0 ? images.length - 1 : idx - 1))}
              aria-label="Previous image"
            >&#8592;</button>
          )}
          <img
            src={images.length > 0 ? images[currentImageIdx] : fallback}
            alt={selectedListing.title}
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              objectFit: 'contain',
              display: 'block',
              margin: '32px auto',
              background: '#f7f7f7',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onError={e => { e.target.src = fallback; e.target.alt = 'Image not found'; }}
          />
          {images.length > 1 && (
            <button
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 44,
                height: 44,
                fontSize: 28,
                cursor: 'pointer',
                zIndex: 2,
                boxShadow: '0 2px 8px rgba(37,99,235,0.18)'
              }}
              onClick={() => setCurrentImageIdx(idx => (idx === images.length - 1 ? 0 : idx + 1))}
              aria-label="Next image"
            >&#8594;</button>
          )}
          {images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: '#2563eb', borderRadius: 12, padding: '4px 16px', fontSize: 16, color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
              {currentImageIdx + 1} / {images.length}
            </div>
          )}
        </div>
        <div style={styles.detailContent}>
          <div style={styles.detailHeader}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
              <h2 style={{ ...styles.detailTitle, marginBottom: 0, textAlign: 'left' }}>{selectedListing.title}</h2>
              <p style={{ ...styles.detailPrice, marginTop: 4, marginBottom: 0, textAlign: 'left' }}>
                ₹{selectedListing.price.toLocaleString()}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => toggleFavorite(selectedListing.id)}
                style={{
                  ...styles.favoriteButton,
                  position: 'relative',
                  top: 0,
                  right: 0,
                }}
              >
                <Heart
                  style={{
                    width: '24px',
                    height: '24px',
                    ...(favorites.includes(selectedListing.id) ? styles.favoriteIconActive : styles.favoriteIconInactive),
                  }}
                />
              </button>
              <button
                onClick={() => { if (user) { setChatOpen(true); } else { alert('Please login to contact the seller.'); } }}
                style={{
                  ...styles.favoriteButton,
                  position: 'relative',
                  top: 0,
                  right: 0,
                }}
                title="Messages"
              >
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#909090ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  {messageCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      background: '#2563eb',
                      color: '#fff',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      minWidth: '8px',
                      textAlign: 'center',
                      zIndex: 2,
                    }}>{messageCount}</span>
                  )}
                </div>
              </button>
            </div>
          </div>
          <div style={styles.detailSection}>
            <div style={{
              ...styles.detailLocation,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '16px',
              marginBottom: 0
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin style={{ width: '20px', height: '20px' }} />
                {selectedListing.location}
              </span>
              <span style={{ color: '#6b7280', fontSize: '14px', display: 'inline-flex', alignItems: 'center' }}>
                Posted {selectedListing.posted}
                <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center' }}>
                  <Eye style={{ width: 16, height: 16, marginRight: 4 }} />
                  {typeof selectedListing.views === 'number' ? selectedListing.views : 0}
                </span>
              </span>
            </div>
          </div>
          <div style={styles.descriptionSection}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={{ color: '#374151', lineHeight: '1.6', textAlign: 'justify' }}>{selectedListing.description}</p>
            <AiSummary
              adTitle={selectedListing.title}
              category={selectedListing.category?.name || selectedListing.category}
              subCategory={selectedListing.subCategory?.name || selectedListing.subCategory}
              description={selectedListing.description}
              API_BASE_URL={API_BASE_URL}
            />
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />
          <div style={{ margin: '32px 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Seller Information</h3>
            <div style={{ fontWeight: 600, fontSize: '1.08rem', color: '#111', marginBottom: '6px' }}>
              {typeof selectedListing.seller === 'object' && selectedListing.seller !== null ? selectedListing.seller.name : selectedListing.seller}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '0' }}>Member since 2023</div>
            {/* Only show Contact Seller if user is not the seller */}
            {!(user && (selectedListing.sellerId === user._id || (selectedListing.seller && selectedListing.seller._id === user._id))) && (
              <button style={styles.contactButton} onClick={() => { if (user) { setChatOpen(true) } else { alert('Please login to contact the seller.'); } }}>
                Contact Seller
              </button>
            )}
            {chatOpen && (
              <Chat
                selectedListing={selectedListing}
                selectedMessage={selectedMessage || { user: user?._id }}
                user={user}
                chatMessages={chatMessages}
                setChatMessages={setChatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                setChatOpen={setChatOpen}
                chatOpen={chatOpen}
                API_BASE_URL={API_BASE_URL}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetail;
