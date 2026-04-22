import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

function getInitials(name) {
  if (!name || name === 'Seller' || name === 'Buyer') return '??';
  const p = name.trim().split(/\s+/);
  return p.length === 1 ? p[0].substring(0, 2).toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function ChatRow({ item, isBuying, user, onClick }) {
  const otherName = isBuying
    ? (item.sellerName || item.seller?.name || 'Seller')
    : (item.buyerName || item.buyer?.name || 'Buyer');
  const otherPic = isBuying
    ? (item.sellerPic || item.seller?.profilePic)
    : (item.buyerPic || item.buyer?.profilePic);
  const lastMsg = typeof item.lastMessage === 'string'
    ? item.lastMessage
    : (item.lastMessage?.message || '');
  const adTitle = item.item || item.adTitle || item.adId?.title || item.ad?.title || '';
  const adImage = item.adId?.images?.[0] || item.ad?.images?.[0] || null;
  const lastMsgFrom = item.lastMessage?.from?._id || item.lastMessage?.from || item.lastMessageFrom;
  const isMe = lastMsgFrom && user?._id && String(lastMsgFrom) === String(user._id);
  const isUnread = item.isSeen === false && !isMe;

  const buyerId = item.buyerId || item.buyer?._id || (isBuying ? user._id : null);
  const sellerId = item.sellerId || item.seller?._id || (!isBuying ? user._id : null);
  const adId = item.adId?._id || item.adId || item.ad?._id || item._id;

  return (
    <div
      className={`chat-row${isUnread ? ' unread' : ''}`}
      onClick={() => onClick({ adId, buyerId, sellerId, adTitle }, otherName, !isBuying)}
    >
      <div className="chat-avatar-wrap">
        {otherPic
          ? <img className="chat-avatar" src={otherPic} alt={otherName} style={{ objectFit: 'cover' }} />
          : <div className="chat-avatar">{getInitials(otherName)}</div>}
        {isUnread && <div className="unread-dot" />}
      </div>
      <div className="chat-info">
        <div className="chat-header-row">
          <span className={`chat-name${isUnread ? ' unread' : ''}`}>{otherName}</span>
          <span className="chat-time">{item.updatedAt || ''}</span>
        </div>
        <div className="chat-ad-title">{adTitle.substring(0, 30)}{adTitle.length > 30 ? '...' : ''}</div>
        <div className={`chat-preview${isUnread ? ' unread' : ''}`}>
          {isMe && <span style={{ color: 'var(--muted)' }}>You: </span>}
          {(lastMsg || '').substring(0, 40)}{lastMsg?.length > 40 ? '...' : ''}
        </div>
      </div>
      {adImage && <img className="ad-thumb" src={adImage} alt="" />}
    </div>
  );
}


export default function MessagesPage() {
  const { user, apiFetch, navigate, hasConsented } = useApp();
  const [tab, setTab] = useState(0);
  const [buying, setBuying] = useState([]);
  const [selling, setSelling] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const storedToken = localStorage.getItem("authToken");
        const [r1, r2] = await Promise.all([
          apiFetch('/api/ads/getBuyingMessages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`
            },
          }),
          apiFetch('/api/ads/getSellingMessages ', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`
            },
          }),
        ]);
        if (!cancelled) {
          setBuying(Array.isArray(r1?.filteredMessages) ? r1.filteredMessages : []);
          setSelling(Array.isArray(r2?.filteredMessages) ? r2.filteredMessages : []);
        }
      } catch { /* ignore */ }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [user, apiFetch]);

  if (!user) {
    return (
      <div className="login-wall">
        <div className="login-icon-circle">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </div>
        <div className="login-title">Your Messages</div>
        <div className="login-sub">Sign in to view your chats with buyers and sellers.</div>
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
          <p style={{margin: '16px 0 24px 0'}}>To use messaging and other features, please accept our Privacy Policy and Terms of Service.</p>
          <button className="accept-btn" style={{minWidth: 180}} onClick={() => navigate('consent')}>Review & Accept</button>
        </div>
      </div>
    );
  }

  const buyingUnread = buying.filter(c => c.isSeen === false).length;
  const sellingUnread = selling.filter(c => c.isSeen === false).length;
  const list = tab === 0 ? buying : selling;

  const openChat = (chatInfo, otherName, isSeller) => {
    navigate('chat', { chatInfo, otherName, isSeller });
  };

  return (
    <div>
      <div className="messages-tabs">
        <button className={`msg-tab${tab === 0 ? ' active' : ''}`} onClick={() => setTab(0)}>
          Buying {buyingUnread > 0 && <span className="msg-badge">{buyingUnread}</span>}
        </button>
        <button className={`msg-tab${tab === 1 ? ' active' : ''}`} onClick={() => setTab(1)}>
          Selling {sellingUnread > 0 && <span className="msg-badge">{sellingUnread}</span>}
        </button>
      </div>

      {loading && (
        <div className="empty-state"><div className="spinner" /></div>
      )}

      {!loading && list.length === 0 && (
        <div className="empty-state">
          <span className="empty-title">No chats yet</span>
          <span className="empty-sub">{tab === 0 ? 'Start a conversation by messaging a seller.' : 'Buyers will appear here when they message you.'}</span>
        </div>
      )}

      {!loading && list.length > 0 && (
        <div className="chat-list">
          {list.map((item, i) => (
            <ChatRow
              key={i}
              item={item}
              isBuying={tab === 0}
              user={user}
              onClick={openChat}
            />
          ))}
        </div>
      )}
    </div>
  );
}
