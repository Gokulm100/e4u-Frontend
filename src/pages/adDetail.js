import React, { useEffect, useState } from 'react';
import { useToast } from '../components/ToastContext';
import { MapPin, Heart, Eye } from 'lucide-react';
import Chat from './chat';
import AiSummary from '../components/aiSummary';
import AiAnalytics from '../components/aiAnalytics';
// Simple modal component for congrats popup
const SoldModal = ({ open, onClose, users, loading, onConfirm }) => {
  const [dealSource, setDealSource] = useState(''); // 'app', 'elsewhere', ''
  const [selectedUser, setSelectedUser] = useState('');
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(30, 41, 59, 0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
        borderRadius: 8,
        padding: '38px 32px 32px 32px',
        minWidth: 350,
        maxWidth: 400,
        boxShadow: '0 8px 32px rgba(30,41,59,0.18)',
        textAlign: 'center',
        position: 'relative',
        border: '1.5px solid #e0e7ef',
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 18,
          right: 22,
          fontSize: 22,
          color: '#64748b',
          cursor: 'pointer',
          fontWeight: 400
        }} onClick={onClose} title="Close">×</div>
        <div style={{ fontSize: '2.3rem', fontWeight: 900, color: '#2563eb', marginBottom: 6, letterSpacing: '-1px', fontFamily: 'inherit' }}>Yay!!</div>
        <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#22223b', marginBottom: 10, letterSpacing: '-0.5px', fontFamily: 'inherit' }}>Congratulations 🎉</div>
        <div style={{ fontSize: '1.08rem', color: '#475569', marginBottom: 24, fontWeight: 500 }}>Let us know how you closed the deal:</div>
        <div style={{ marginBottom: 22, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <label style={{ fontWeight: 600, fontSize: '1.04rem', cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="radio" name="dealSource" value="app" checked={dealSource === 'app'} onChange={() => setDealSource('app')} style={{ accentColor: '#2563eb', width: 18, height: 18 }} />
            <span>Yes, through this app</span>
          </label>
          <label style={{ fontWeight: 600, fontSize: '1.04rem', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="radio" name="dealSource" value="elsewhere" checked={dealSource === 'elsewhere'} onChange={() => setDealSource('elsewhere')} style={{ accentColor: '#64748b', width: 18, height: 18 }} />
            <span>No, the deal was made elsewhere</span>
          </label>
        </div>
        {dealSource === 'app' && (
          <div style={{ marginBottom: 24, textAlign: 'left' }}>
            <label style={{ fontWeight: 600, fontSize: '1.01rem', color: '#22223b', marginRight: 10, marginBottom: 6, display: 'block' }}>Select buyer:</label>
            {loading ? (
              <div style={{ color: '#64748b', fontSize: '1rem', padding: '8px 0 0 2px' }}>Loading users...</div>
            ) : (
              <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                fontSize: '1.04rem',
                width: '100%',
                background: '#f8fafc',
                color: '#22223b',
                fontWeight: 500,
                marginTop: 2,
                outline: 'none',
                boxShadow: '0 1px 4px rgba(30,41,59,0.04)'
              }}>
                <option value="">-- Select User --</option>
                {users && users.length > 0 && users.map(u => (
                  <option key={u._id} value={u._id}>{u.name || u.email || u._id}</option>
                ))}
              </select>
            )}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 8 }}>
          <button onClick={onClose} style={{
            background: 'linear-gradient(90deg, #e0e7ef 0%, #f8fafc 100%)',
            color: '#475569',
            border: 'none',
            borderRadius: 8,
            padding: '10px 26px',
            fontWeight: 700,
            fontSize: '1.05rem',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(30,41,59,0.04)',
            transition: 'background 0.2s'
          }}>Cancel</button>
          <button
            onClick={() => {
              if (dealSource === 'app') {
                onConfirm({ soldThroughApp: true, selectedUser });
              } else if (dealSource === 'elsewhere') {
                onConfirm({ soldThroughApp: false, selectedUser: null });
              }
            }}
            style={{
              background: 'linear-gradient(90deg, #2263c5ff 0%, #2563eb 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 26px',
              fontWeight: 700,
              fontSize: '1.05rem',
              cursor: dealSource === '' || (dealSource === 'app' && (!selectedUser || loading)) ? 'not-allowed' : 'pointer',
              opacity: dealSource === '' || (dealSource === 'app' && (!selectedUser || loading)) ? 0.7 : 1,
              boxShadow: '0 1px 4px rgba(34,197,94,0.10)',
              transition: 'background 0.2s'
            }}
            disabled={dealSource === '' || (dealSource === 'app' && (!selectedUser || loading))}
          >Confirm</button>
        </div>
      </div>
    </div>
  );
};


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
  const { showToast } = useToast();

  // Modal state for Mark as Sold
  const [soldModalOpen, setSoldModalOpen] = useState(false);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [loadingInterested, setLoadingInterested] = useState(false);
  const [isSold, setIsSold] = useState(false);

  // Disable/Enable ad state
  const [showDisablePopup, setShowDisablePopup] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);
  // Use isActive from selectedListing (if present) to determine disabled state
  const [isDisabled, setIsDisabled] = useState(
    selectedListing.hasOwnProperty('isActive') ? !selectedListing.isActive : (selectedListing.disabled || false)
  );


  // Responsive check for mobile view
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  // Fetch interested users when Mark as Sold is clicked
  const handleMarkAsSoldClick = async () => {
    if (!selectedListing || !selectedListing.id || !API_BASE_URL) return;
    setLoadingInterested(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ads/getUsersInterestedInAd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: selectedListing.id })
      });
      const data = await res.json();
      if (Array.isArray(data.users)) {
        setInterestedUsers(data.users);
      } else {
        setInterestedUsers([]);
      }
    } catch (e) {
      setInterestedUsers([]);
    }
    setLoadingInterested(false);
    setSoldModalOpen(true);
  };

  // Increment views if not from My Ads (i.e., showAiAnalytics is not true)
  useEffect(() => {
    if (selectedListing && selectedListing.id && !selectedListing.showAiAnalytics && API_BASE_URL) {
      fetch(`${API_BASE_URL}/api/ads/incrementViews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ adId: selectedListing.id })
      });
    }
  }, [selectedListing, API_BASE_URL, user]);

  if (!selectedListing) return null;
  // Only show AI Analytics if showAiAnalytics is true (from My Ads detail view)
  const showAiAnalytics = selectedListing.showAiAnalytics === true;
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {showAiAnalytics ? (
                (selectedListing.isSold || isSold) ? (
                  <span style={{
                    background: '#2fed1aff',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: isMobile ? '0.92rem' : '1.08rem',
                    borderRadius: 8,
                    padding: isMobile ? '5px 12px' : '8px 22px',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 8px rgba(34,197,94,0.10)',
                    border: 'none',
                    display: 'inline-block',
                  }}>Sold!</span>
                ) : (
                  <>
                    {!isDisabled ? (
                      <button
                        style={{
                          background: '#f33b08ff',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: isMobile ? '5px 10px' : '8px 16px',
                          fontWeight: 600,
                          fontSize: isMobile ? '0.92rem' : '1rem',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(245,158,66,0.10)'
                        }}
                        onClick={e => { e.stopPropagation(); setShowDisablePopup(true); }}
                      >
                        {isMobile ? 'Disable' : 'Disable Ad'}
                      </button>
                    ) : (
                      <button
                        style={{
                          background: '#22c55e',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: isMobile ? '5px 10px' : '8px 16px',
                          fontWeight: 600,
                          fontSize: isMobile ? '0.92rem' : '1rem',
                          cursor: disableLoading ? 'not-allowed' : 'pointer',
                          boxShadow: '0 2px 8px rgba(34,197,94,0.10)'
                        }}
                        disabled={disableLoading}
                        onClick={async e => {
                          e.stopPropagation();
                          setDisableLoading(true);
                          try {
                            const token = user && user.token ? user.token : localStorage.getItem('authToken') || '';
                            const res = await fetch(`${API_BASE_URL}/api/ads/enableAd`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                              },
                              body: JSON.stringify({ adId: selectedListing.id })
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setIsDisabled(false);
                              showToast('Ad enabled successfully.', 'success');
                            } else {
                              showToast(data.message || 'Failed to enable ad.', 'error');
                            }
                          } catch (e) {
                            showToast('Failed to enable ad.', 'error');
                          }
                          setDisableLoading(false);
                        }}
                      >
                        {disableLoading ? 'Enabling...' : (isMobile ? 'Enable' : 'Enable Ad')}
                      </button>
                    )}
                    {showDisablePopup && (
                      <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(30, 41, 59, 0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(2px)'
                      }}>
                        <div style={{
                          background: '#fff',
                          borderRadius: 8,
                          padding: '32px 28px',
                          minWidth: 320,
                          maxWidth: 380,
                          boxShadow: '0 8px 32px rgba(30,41,59,0.18)',
                          textAlign: 'center',
                          position: 'relative',
                          border: '1.5px solid #e0e7ef',
                          fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
                          overflow: 'hidden'
                        }}>
                          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#22223b', marginBottom: 18 }}>Disable this ad?</div>
                          <div style={{ fontSize: '1.08rem', color: '#475569', marginBottom: 24, fontWeight: 500 }}>Are you sure you want to disable this ad? This action can be reversed by editing the ad.</div>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 8 }}>
                            <button onClick={() => setShowDisablePopup(false)} style={{
                              background: 'linear-gradient(90deg, #e0e7ef 0%, #f8fafc 100%)',
                              color: '#475569',
                              border: 'none',
                              borderRadius: 8,
                              padding: '10px 26px',
                              fontWeight: 700,
                              fontSize: '1.05rem',
                              cursor: 'pointer',
                              boxShadow: '0 1px 4px rgba(30,41,59,0.04)',
                              transition: 'background 0.2s'
                            }}>Cancel</button>
                            <button
                              onClick={async () => {
                                setDisableLoading(true);
                                try {
                                  const token = user && user.token ? user.token : localStorage.getItem('authToken') || '';
                                  const res = await fetch(`${API_BASE_URL}/api/ads/disableAd`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                                    },
                                    body: JSON.stringify({ adId: selectedListing.id })
                                  });
                                  const data = await res.json();
                                  if (res.ok) {
                                    setIsDisabled(true);
                                    setShowDisablePopup(false);
                                    showToast('Ad disabled successfully.', 'success');
                                  } else {
                                    showToast(data.message || 'Failed to disable ad.', 'error');
                                  }
                                } catch (e) {
                                  showToast('Failed to disable ad.', 'error');
                                }
                                setDisableLoading(false);
                              }}
                              style={{
                                background: '#f33b08ff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '10px 26px',
                                fontWeight: 700,
                                fontSize: '1.05rem',
                                cursor: disableLoading ? 'not-allowed' : 'pointer',
                                opacity: disableLoading ? 0.7 : 1,
                                boxShadow: '0 1px 4px rgba(245,158,66,0.10)',
                                transition: 'background 0.2s'
                              }}
                              disabled={disableLoading}
                            >
                              {disableLoading ? 'Disabling...' : 'Confirm'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <button
                      style={{
                        background: '#065beeff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: isMobile ? '5px 10px' : '8px 16px',
                        fontWeight: 600,
                        fontSize: isMobile ? '0.92rem' : '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(34,197,94,0.10)'
                      }}
                      onClick={handleMarkAsSoldClick}
                    >
                      {isMobile ? 'Sold' : 'Mark as Sold'}
                    </button>
                    <SoldModal
                      open={soldModalOpen}
                      onClose={() => setSoldModalOpen(false)}
                      users={interestedUsers}
                      loading={loadingInterested}
                      onConfirm={async ({ soldThroughApp, selectedUser }) => {
                        setSoldModalOpen(false);
                        const token = user && user.token ? user.token : localStorage.getItem('authToken') || '';
                        if (soldThroughApp && selectedUser) {
                          // Call markAdAsSold API for app sale
                          try {
                            const res = await fetch(`${API_BASE_URL}/api/ads/markAdAsSold`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                              },
                              body: JSON.stringify({ adId: selectedListing.id, buyerId: selectedUser })
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setIsSold(true);
                              showToast('Success!', 'success');
                            } else {
                              showToast(data.message || 'Failed to mark ad as sold.', 'error');
                            }
                          } catch (e) {
                            showToast('Failed to mark ad as sold.', 'error');
                          }
                        } else if (soldThroughApp) {
                          showToast('Please select a user.', 'error');
                        } else {
                          // Call markAdAsSold API for external sale (no buyerId, pass null)
                          try {
                            const res = await fetch(`${API_BASE_URL}/api/ads/markAdAsSold`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                              },
                              body: JSON.stringify({ adId: selectedListing.id, buyerId: null })
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setIsSold(true);
                              showToast('Success!', 'success');
                            } else {
                              showToast(data.message || 'Failed to mark ad as sold.', 'error');
                            }
                          } catch (e) {
                            showToast('Failed to mark ad as sold.', 'error');
                          }
                        }
                      }}
                    />
                  </>
                )
              ) : (
                <>
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
                    onClick={() => { if (user) { setChatOpen(true); } else { showToast('Please login to contact the seller.', 'error'); } }}
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
                </>
              )}
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
          {showAiAnalytics && !(selectedListing.isSold || isSold) && <AiAnalytics ad={selectedListing} API_BASE_URL={API_BASE_URL} />}
          <div style={{ margin: '32px 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Seller Information</h3>
            <div style={{ fontWeight: 600, fontSize: '1.08rem', color: '#111', marginBottom: '6px' }}>
              {typeof selectedListing.seller === 'object' && selectedListing.seller !== null ? selectedListing.seller.name : selectedListing.seller}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '0' }}>Member since 2023</div>
            {/* Only show Contact Seller if user is not the seller */}
            {!(user && (selectedListing.sellerId === user._id || (selectedListing.seller && selectedListing.seller._id === user._id))) && (
              <button style={styles.contactButton} onClick={() => { if (user) { setChatOpen(true) } else { showToast('Please login to contact the seller.', 'error'); } }}>
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
