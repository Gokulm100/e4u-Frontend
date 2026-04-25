import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const FALLBACK = 'https://images.pexels.com/photos/10703759/pexels-photo-10703759.jpeg';

export default function MyAdsPage() {
  const { user, apiFetch, navigate, showToast, showModal, mapListing, hasConsented } = useApp();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) {
      setAds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await apiFetch(`/api/ads/listUserAds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: user._id })
      });
      const data = Array.isArray(result) ? result : (result.ads || result.data || []);
      setAds(data.map(mapListing));
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [user]); // eslint-disable-line

  const handleDelete = (ad) => {
    showModal('Disable Ad', `Disable "${ad.title}"? This cannot be undone.`, '🗑️', async () => {
      try {
        const token = localStorage.getItem('authToken');
        await apiFetch(`/api/ads/disableAd`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ adId: ad.id })
        });
        showToast('Ad disabled.', 'success');
        load();
      } catch { showToast('Failed to disable ad.', 'error'); }
    });
  };
  const handleEnable = (ad) => {
    showModal('Enable Ad', `Enable "${ad.title}"?`, '✅', async () => {
      try {
        const token = localStorage.getItem('authToken');
        await apiFetch(`/api/ads/enableAd`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ adId: ad.id })
        });
        showToast('Ad enabled.', 'success');
        load();
      } catch { showToast('Failed to enable ad.', 'error'); }
    });
  };
  const handleMarkSold = (ad) => {
    showModal('Mark as Sold', `Mark "${ad.title}" as sold?`, '✅', async () => {
      try {
        const token = localStorage.getItem('authToken');
        await apiFetch(`/api/ads/markAsSold/${ad.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ adId: ad.id })
        });
        showToast('Marked as sold!', 'success');
        load();
      } catch { showToast('Failed to update status.', 'error'); }
    });
  };


  if (!user) {
    return (
      <div className="login-wall">
        <div className="login-icon-circle">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </div>
        <div className="login-title">My Ads</div>
        <div className="login-sub">Sign in to manage your posted ads.</div>
        <button className="google-btn" onClick={() => navigate('profile')}>Sign In</button>
      </div>
    );
  }

  // Show translucent overlay if user is logged in but hasConsented is false
  if (user && hasConsented === false) {
    return (
      <div className="messages-page-overlay-wrap">
        <div className="messages-page-overlay-blur" />
        <div className="messages-page-overlay-content">
          <h2>Please Accept Privacy & Terms</h2>
          <p style={{margin: '16px 0 24px 0'}}>To manage your ads and other features, please accept our Privacy Policy and Terms of Service.</p>
          <button className="accept-btn" style={{minWidth: 180}} onClick={() => navigate('consent')}>Review & Accept</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div className="page-title" style={{ marginBottom: 0 }}>My Ads</div>
        <button
          className="topbar-btn primary"
          style={{ background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }}
          onClick={() => navigate('post')}
        >
          <PlusCircle size={16} /> Post Ad
        </button>
      </div>

      {loading && <div className="empty-state"><div className="spinner" /></div>}

      {!loading && ads.length === 0 && (
        <div className="empty-state">
          <span className="empty-title">No ads yet</span>
          <span className="empty-sub">Post your first ad to start selling!</span>
          <button className="submit-btn" style={{ marginTop: 16, width: 'auto', padding: '10px 24px' }} onClick={() => navigate('post')}>
            Post an Ad
          </button>
        </div>
      )}

      {!loading && ads.map(ad => (
        <div
          key={ad.id}
          className="my-ad-row"
          style={{ cursor: 'pointer' }}
          onClick={e => {
            // Prevent navigation if an action button is clicked
            if (
              e.target.closest('.my-ad-actions') ||
              e.target.classList.contains('edit-btn') ||
              e.target.classList.contains('delete-btn')
            ) return;
            navigate('ad-detail', { listing: ad });
          }}
        >
          <img
            className="my-ad-img"
            src={ad.images[0]}
            alt={ad.title}
            onError={e => { e.target.src = FALLBACK; }}
          />
          <div className="my-ad-info">
            <div className="my-ad-title">{ad.title}</div>
            <div className="my-ad-price">₹{Number(ad.price).toLocaleString('en-IN')}</div>
            <div className="my-ad-meta">{ad.location} · {ad.posted}</div>
            <div style={{ marginTop: 6 }}>
              <span className={`ad-status-badge ${ad.isActive === false ? 'inactive' : 'active'}`}>
                {ad.isActive === false ? 'inactive' : 'Active'}
              </span>
            </div>
          </div>
          <div className="my-ad-actions">
            <button className="edit-btn" onClick={e => { e.stopPropagation(); navigate('post', { ad }); }}>Edit</button>
            {ad.isActive === true ? <button className="delete-btn" onClick={e => { e.stopPropagation(); handleDelete(ad); }}>Disable</button> : <button className="edit-btn" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: 'var(--success)' }} onClick={e => { e.stopPropagation(); handleEnable(ad); }}>Enable</button>}
            {ad.status !== 'sold' && (
              <button className="edit-btn" style={{ background: '#e6ecf4', borderColor: '#90bcee', color: 'var(--primary)' }} onClick={e => { e.stopPropagation(); handleMarkSold(ad); }}>
                Mark Sold
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
