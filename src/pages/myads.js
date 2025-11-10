import React, { useState, useEffect } from 'react';
import { MapPin, Eye } from 'lucide-react';

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

  useEffect(() => {
    if (user && user._id) {
      fetch(`${API_BASE_URL}/api/ads/listUserAds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: user._id })
      })
        .then(res => res.json())
        .then(result => {
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
    <div style={styles.container}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>My Ads</h2>
      {(!myAds || myAds.length === 0) ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No ads posted yet</p>
          <button style={{ ...styles.backButton, marginTop: '16px' }} onClick={() => setView('home')}>
            Start browsing
          </button>
        </div>
      ) : (
        <>
          {editMode ? (
            <div style={styles.formContainer}>
              <button style={styles.backButton} onClick={() => { setEditMode(false); setEditAd(null); }}>
                ← Cancel Edit
              </button>
              <div style={styles.formCard}>
                <h2 style={styles.formTitle}>Edit Your Ad</h2>
                <div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Title *</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={editAd.title}
                      onChange={e => setEditAd({ ...editAd, title: e.target.value })}
                      placeholder="e.g., iPhone 13 Pro Max"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Category *</label>
                    <select
                      style={styles.select}
                      value={editAd.category}
                      onChange={e => {
                        setEditAd({ ...editAd, category: e.target.value, subCategory: '' });
                      }}
                    >
                      {categories.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Subcategory dropdown for Edit Ad form */}
                  {(() => {
                    const selectedCat = categories.find(c => c.id === editAd.category);
                    if (selectedCat && Array.isArray(selectedCat.subCategories) && selectedCat.subCategories.length > 0) {
                      return (
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Subcategory</label>
                          <select
                            style={styles.select}
                            value={editAd.subCategory || ''}
                            onChange={e => setEditAd({ ...editAd, subCategory: e.target.value })}
                          >
                            <option key='' value=''>-- Select Subcategory --</option>
                            {selectedCat.subCategories.map(sub => (
                              <option key={sub} value={sub}>{sub}</option>
                            ))}
                          </select>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Price (₹) *</label>
                    <input
                      type="number"
                      style={styles.input}
                      value={editAd.price}
                      onChange={e => setEditAd({ ...editAd, price: e.target.value })}
                      placeholder="15000"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Location *</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={editAd.location}
                      onChange={e => setEditAd({ ...editAd, location: e.target.value })}
                      placeholder="City name"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Description *</label>
                    <textarea
                      style={styles.textarea}
                      value={editAd.description}
                      onChange={e => setEditAd({ ...editAd, description: e.target.value })}
                      placeholder="Describe your item..."
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Image Upload (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      style={styles.input}
                      onChange={e => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                          setEditAd({ ...editAd, image: files });
                        }
                      }}
                    />
                    {Array.isArray(editAd.image) && editAd.image.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                        {editAd.image.map((file, idx) => (
                          <img key={idx} src={typeof file === 'string' ? file : URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} style={{ maxWidth: 100, maxHeight: 100, borderRadius: 8 }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    style={styles.submitButton}
                    onClick={e => {
                      e.preventDefault();
                      handleEditAd();
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.grid}>
              {myAds.map((listing, idx) => (
                <div
                  key={listing.id || idx}
                  style={{ ...styles.card, position: 'relative' }}
                  onClick={() => {
                    setLastListView('myads');
                    setSelectedListing({ ...listing, showAiAnalytics: true });
                    setView('detail');
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                >
                  <div style={styles.cardImageWrapper}>
                    <img
                      src={listing.image}
                      alt={listing.title}
                      style={styles.cardImage}
                      onError={e => { e.target.src = 'https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg'; e.target.alt = 'Image not found'; }}
                    />
                    {/* Sold tag */}
                    {listing.isSold && (
                      <span style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 4,
                        background: '#22c55e',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 14,
                        borderRadius: 8,
                        padding: '4px 14px',
                        boxShadow: '0 1px 4px rgba(34,197,94,0.10)',
                        letterSpacing: '0.5px',
                        pointerEvents: 'none',
                      }}>
                        Sold
                      </span>
                    )}
                    {/* Disabled tag (only if not sold) */}
                    {!listing.isActive && !listing.isSold && (
                      <span style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 3,
                        background: '#f33b08ff',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 14,
                        borderRadius: 8,
                        padding: '4px 14px',
                        boxShadow: '0 1px 4px rgba(245,158,66,0.10)',
                        letterSpacing: '0.5px',
                        pointerEvents: 'none',
                      }}>
                        Disabled
                      </span>
                    )}
                  </div>
                  <button
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      background: '#fff',
                      border: 'none',
                      padding: '6px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      zIndex: 2
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      <path d="M15 6l3 3" />
                    </svg>
                  </button>
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
              <div ref={observerTarget} style={{ height: 1 }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyAds;
