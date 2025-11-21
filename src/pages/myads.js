import React, { useState, useEffect } from 'react';
import AiTextArea from '../components/aiTextArea';
import {  Eye } from 'lucide-react';
import LoaderOverlay from '../components/LoadingOverlay';
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

const MyAds = ({ styles, editMode, editAd, setEditMode, setEditAd, categories, setLastListView, setSelectedListing, setView, handleEditAd, observerTarget, user }) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/ads/listUserAds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: user._id })
      })
        .then(res => res.json())
        .then(result => {
          setLoading(false);
          let data = result?.ads || [];
          if (Array.isArray(data)) {
            const listingObjs = data.map(listing => {
              let posted = 'Unknown';
              if (listing.createdAt) {
                const created = new Date(listing.createdAt);
                const now = new Date();
                const diffMs = now - created;
                const diffSec = Math.floor(diffMs / 1000);
                const diffMin = Math.floor(diffSec / 60);
                const diffHr = Math.floor(diffMin / 60);
                const diffDay = Math.floor(diffHr / 24);
                if (diffMin < 1) {
                  posted = 'moments ago';
                } else if (diffMin < 60) {
                  posted = `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
                } else if (diffHr < 24) {
                  posted = `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
                } else if (diffDay < 7) {
                  posted = `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
                } else {
                  posted = created.toLocaleDateString();
                }
              }
              return {
                id: listing._id,
                title: listing.title,
                price: listing.price,
                location: listing.location,
                category: listing?.category?.name ? listing?.category?.name : 'Uncategorized',
                categoryId: listing?.category?._id ? listing?.category?._id : null,
                description: listing.description,
                seller: listing.seller ? listing.seller.name : 'Unknown',
                sellerId: listing.seller ? listing.seller._id : null,
                subCategory: listing?.subCategory ? listing?.subCategory : '',
                posted,
                isSold: listing.isSold || false,
                isActive: listing.isActive !== undefined ? listing.isActive : true,
                views: listing.views || 0,
                image: Array.isArray(listing.images) && listing.images.length > 0
                  ? `${API_BASE_URL}/${listing.images[0]}`
                  : 'https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg',
              };
            });
            setMyAds(listingObjs);
          }
        })
        .catch(() => {
          setMyAds([]);
        });
    }
  }, [user, API_BASE_URL]);

  return (
    <div style={{ ...styles.container, maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(37,99,235,0.5); }
            70% { box-shadow: 0 0 0 10px rgba(37,99,235,0); }
            100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
          }
          .pulse-animate {
            animation: pulse 1.5s infinite;
          }
        `}
      </style>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 32, color: '#1c6be9ff', letterSpacing: 0.5 }}>My Ads</h2>
      {(!myAds || myAds.length === 0) ? (
        <div style={{ ...styles.emptyState, background: '#f8fafc', borderRadius: 16, padding: 48}}>
          <p style={{ ...styles.emptyText, fontSize: 20, color: '#64748b', marginBottom: 16 }}>Opps! You haven't posted any ads yet.</p>
          <button
            className="pulse-animate"
            style={{ ...styles.createFirstAdButton }}
            onClick={() => setView('post')}
          >
            Create Your First Ad
          </button>
        </div>
      ) : (
        <>
          {editMode ? (
            <div style={{ ...styles.formContainer, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: 32, maxWidth: 600, margin: '0 auto' }}>
              <button
                style={{
                  ...styles.backButton,
                  marginBottom: 16,
                  background: 'none',
                  color: '#2563eb',
                  fontWeight: 600,
                  border: 'none',
                  fontSize: 16,
                  cursor: 'pointer'
                }}
                onClick={() => { setEditMode(false); setEditAd(null); }}
              >
                ← Cancel Edit
              </button>
              <div style={{ ...styles.formCard, boxShadow: 'none', padding: 0 }}>
                <h2 style={{ ...styles.formTitle, fontSize: 22, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>Edit Your Ad</h2>
                <div>
                  {/* Form fields remain unchanged */}
                  {/* ... */}
                  {/* (Keep your form fields as in your original code) */}
                  {/* ... */}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                ...styles.grid,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 32,
                marginTop: 8
              }}
            >
              {myAds.map((listing, idx) => (
                <div
                  key={listing.id || idx}
                  style={{
                    ...styles.card,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 2px 16px rgba(30,41,59,0.08)',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0'
                  }}
                  onClick={() => {
                    setLastListView('myads');
                    setSelectedListing({ ...listing, showAiAnalytics: true });
                    setView('detail');
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,41,59,0.14)';
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 2px 16px rgba(30,41,59,0.08)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ ...styles.cardImageWrapper, height: 180, background: '#f1f5f9', position: 'relative' }}>
                    <img
                      src={listing.image}
                      alt={listing.title}
                      style={{ ...styles.cardImage, objectFit: 'cover', width: '100%', height: '100%', borderRadius: '16px 16px 0 0' }}
                      onError={e => { e.target.src = 'https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg'; e.target.alt = 'Image not found'; }}
                    />
                    {/* Sold/Disabled tags */}
                    {listing.isSold && (
                      <span style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 4,
                        background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 14,
                        borderRadius: 8,
                        padding: '4px 18px',
                        boxShadow: '0 2px 8px rgba(34,197,94,0.10)',
                        letterSpacing: '0.5px',
                        pointerEvents: 'none',
                        textShadow: '0 1px 2px rgba(0,0,0,0.08)'
                      }}>
                        Sold
                      </span>
                    )}
                    {!listing.isActive && !listing.isSold && (
                      <span style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 3,
                        background: 'linear-gradient(90deg, #f87171 0%, #f33b08ff 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 14,
                        borderRadius: 8,
                        padding: '4px 18px',
                        boxShadow: '0 2px 8px rgba(245,158,66,0.10)',
                        letterSpacing: '0.5px',
                        pointerEvents: 'none',
                        textShadow: '0 1px 2px rgba(0,0,0,0.08)'
                      }}>
                        Disabled
                      </span>
                    )}
                  </div>
                  {!listing.isSold && (
                    <button
                      style={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        color: '#2563eb',
                        fontWeight: 600,
                        background: '#f1f5f9',
                        border: 'none',
                        padding: '6px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 1px 4px rgba(30,41,59,0.07)',
                        zIndex: 2,
                        fontSize: 15,
                        transition: 'background 0.15s'
                      }}
                      title="Edit Ad"
                      onClick={e => {
                        e.stopPropagation();
                        setEditMode(true);
                        let catId = listing.category;
                        let subCat = '';
                        if (categories && categories.length) {
                          const found = categories.find(cat => cat.name === listing.category);
                          if (found && found.id) catId = found.id;
                          if (listing.subCategory) {
                            subCat = listing.subCategory;
                          } else if (listing.subcategory) {
                            subCat = listing.subcategory;
                          }
                        }
                        setEditAd({ ...listing, category: catId, subCategory: subCat });
                      }}
                    >
                      Edit
                    </button>
                  )}
                  <div style={{ ...styles.cardContent, padding: '20px 20px 16px 20px' }}>
                    <h3 style={{ ...styles.cardTitle, fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 8, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{listing.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 14px',
                        borderRadius: '12px',
                        fontSize: 13,
                        fontWeight: 600,
                        background: getCategoryGradient(listing.category),
                        color: '#334155',
                        letterSpacing: 0.5,
                        minWidth: 60,
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                        marginRight: 10
                      }}>{listing.category}</span>
                      <span style={{ color: '#64748b', fontSize: 14 }}>{listing.subCategory}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ ...styles.cardPrice, fontSize: 18, fontWeight: 700, color: '#2563eb', marginRight: 16 }}>₹{listing.price.toLocaleString()}</span>
                      <span style={{ ...styles.cardLocation, color: '#64748b', fontSize: 15, display: 'flex', alignItems: 'center' }}>
                        <Eye style={{ width: 16, height: 16, marginRight: 4 }} />
                        {typeof listing.views === 'number' ? listing.views : 0}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ ...styles.cardPosted, color: '#64748b', fontSize: 14 }}>{listing.posted}</span>
                      <span style={{ color: '#64748b', fontSize: 14 }}>{listing.location}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={observerTarget} style={{ height: 1 }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyAds;
