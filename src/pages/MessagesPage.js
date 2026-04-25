import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

function getInitials(name) {
  if (!name || name === 'Seller' || name === 'Buyer') return '??';
  const p = name.trim().split(/\s+/);
  return p.length === 1 ? p[0].substring(0, 2).toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function ChatRow({ item, isBuying, user, onClick, isSelected }) {
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
      className={`chat-row${isUnread ? ' unread' : ''}${isSelected ? ' selected' : ''}`}
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

function FraudBanner({ fraud, onClose }) {
  if (!fraud?.fraudIndicators?.length) return null;
  return (
    <div className="fraud-banner">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div className="fraud-title">⚠ Safety Insight</div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }} onClick={onClose}>✕</button>
      </div>
      <div className="fraud-indicators">
        {fraud.fraudIndicators.map((ind, i) => (
          <div key={i} className="fraud-indicator-row">
            <div className="fraud-dot" />
            <div className="fraud-text">{ind}</div>
          </div>
        ))}
      </div>
      {fraud.recommendations && (
        <div className="fraud-rec-box">
          <div className="fraud-rec-label">Recommendation:</div>
          <div className="fraud-rec-text">{fraud.recommendations}</div>
        </div>
      )}
    </div>
  );
}

function toChatKey({ adId, buyerId, sellerId }) {
  return `${adId || ''}-${buyerId || ''}-${sellerId || ''}`;
}

function getListChatInfo(item, isBuying, user) {
  const buyerId = item.buyerId || item.buyer?._id || (isBuying ? user?._id : null);
  const sellerId = item.sellerId || item.seller?._id || (!isBuying ? user?._id : null);
  const adId = item.adId?._id || item.adId || item.ad?._id || item._id;
  const adTitle = item.item || item.adTitle || item.adId?.title || item.ad?.title || '';
  return { adId, buyerId, sellerId, adTitle };
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === now.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function isSameConversation(item, chatInfo, isBuying, user) {
  const itemInfo = getListChatInfo(item, isBuying, user);
  return toChatKey(itemInfo) === toChatKey(chatInfo);
}


export default function MessagesPage() {
  const { user, apiFetch, navigate, hasConsented, showToast, fetchMessageCount } = useApp();
  const [tab, setTab] = useState(0);
  const [buying, setBuying] = useState([]);
  const [selling, setSelling] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [input, setInput] = useState('');
  const [fraud, setFraud] = useState(null);
  const [showFraud, setShowFraud] = useState(true);
  const [isMobileView, setIsMobileView] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const msgsRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const onChange = (e) => setIsMobileView(e.matches);
    setIsMobileView(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    }
    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

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
          apiFetch('/api/ads/getSellingMessages', {
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

  const buyingUnread = buying.filter(c => c.isSeen === false).length;
  const sellingUnread = selling.filter(c => c.isSeen === false).length;
  const list = tab === 0 ? buying : selling;
  const selectedKey = selectedChat?.chatInfo ? toChatKey(selectedChat.chatInfo) : '';

  useEffect(() => {
    if (!user || loading) return;
    if (list.length === 0) {
      setSelectedChat(null);
      setMessages([]);
      return;
    }
    const keys = new Set(list.map(item => toChatKey(getListChatInfo(item, tab === 0, user))));
    if (selectedKey && !keys.has(selectedKey)) {
      setSelectedChat(null);
      setMessages([]);
    }
  }, [tab, list, user, loading, selectedKey]);

  const openChat = (chatInfo, otherName, isSeller) => {
    if (isSeller) {
      setSelling(prev => prev.map(item => (
        isSameConversation(item, chatInfo, false, user) ? { ...item, isSeen: true } : item
      )));
    } else {
      setBuying(prev => prev.map(item => (
        isSameConversation(item, chatInfo, true, user) ? { ...item, isSeen: true } : item
      )));
    }
    if (isMobileView) {
      navigate('chat', { chatInfo, otherName, isSeller });
      return;
    }
    setMessages([]);
    setChatLoading(true);
    setSelectedChat({ chatInfo, otherName, isSeller });
  };

  const fetchSelectedChat = async () => {
    const info = selectedChat?.chatInfo;
    if (!info?.adId || !info?.buyerId || !info?.sellerId) return;
    setChatLoading(true);
    try {
      const data = await apiFetch(`/api/ads/chat?adId=${info.adId}&buyerId=${info.buyerId}&sellerId=${info.sellerId}`);
      if (data.fraudCheck) {
        setFraud(data.fraudCheck);
        setShowFraud(true);
      }
      const msgs = Array.isArray(data) ? data : (Array.isArray(data.chats) ? data.chats : []);
      setMessages(msgs);
    } catch { /* ignore */ }
    finally { setChatLoading(false); }
  };

  const markSelectedSeen = async () => {
    const info = selectedChat?.chatInfo;
    if (!info?.adId || !user?._id) return;
    try {
      const senderId = selectedChat.isSeller ? info.buyerId : info.sellerId;
      await apiFetch('/api/ads/markMessagesAsSeen', {
        method: 'POST',
        body: JSON.stringify({ adId: info.adId, reader: user._id, sender: senderId }),
      });
      fetchMessageCount();
    } catch { /* ignore */ }
  };

  useEffect(() => {
    if (!selectedChat?.chatInfo) return;
    fetchSelectedChat();
    markSelectedSeen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat?.chatInfo) return undefined;
    const interval = setInterval(fetchSelectedChat, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    const msg = input.trim();
    const info = selectedChat?.chatInfo;
    if (!msg || !info?.adId) return;
    setInput('');
    try {
      await apiFetch('/api/ads/chat', {
        method: 'POST',
        body: JSON.stringify({
          adId: info.adId,
          from: selectedChat.isSeller ? info.sellerId : info.buyerId,
          to: selectedChat.isSeller ? info.buyerId : info.sellerId,
          message: msg,
        }),
      });
      fetchSelectedChat();
    } catch {
      showToast('Could not send message.', 'error');
    }
  };

  let lastDate = null;

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

  return (
    <div className="messages-split-layout">
      <div className="messages-list-panel">
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
            {list.map((item, i) => {
              const itemKey = toChatKey(getListChatInfo(item, tab === 0, user));
              return (
                <ChatRow
                  key={i}
                  item={item}
                  isBuying={tab === 0}
                  user={user}
                  onClick={openChat}
                  isSelected={itemKey === selectedKey}
                />
              );
            })}
          </div>
        )}
      </div>

      {!isMobileView && (
      <div className="messages-chat-panel">
        {!selectedChat?.chatInfo && (
          <div className="messages-chat-placeholder">
            <span className="empty-title">Select a conversation</span>
            <span className="empty-sub">Choose a chat from Buying or Selling to view messages.</span>
          </div>
        )}

        {selectedChat?.chatInfo && (
          <>
            <div className="messages-chat-header">
              <div className="detail-header-title">{selectedChat.otherName}</div>
              {selectedChat.chatInfo.adTitle && (
                <div className="messages-chat-subtitle">{selectedChat.chatInfo.adTitle}</div>
              )}
            </div>

            <div className="chat-detail-msgs" ref={msgsRef}>
              {chatLoading && (
                <div className="empty-state"><div className="spinner" /></div>
              )}
              {!chatLoading && messages.length === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)' }}>
                  No messages yet. Say hi! 👋
                </div>
              )}
              {messages.map((m, i) => {
                const fromId = m.from?._id || m.from;
                const isMe = fromId === user?._id;
                let separator = null;
                if (m.createdAt) {
                  const d = new Date(m.createdAt).toDateString();
                  if (d !== lastDate) {
                    lastDate = d;
                    separator = (
                      <div key={`sep-${i}`} className="date-separator">
                        <div className="date-line" />
                        <div className="date-label">{formatDateLabel(m.createdAt)}</div>
                        <div className="date-line" />
                      </div>
                    );
                  }
                }
                return (
                  <React.Fragment key={i}>
                    {separator}
                    <div className={`msg-bubble${isMe ? ' me' : ''}`}>
                      <div className="msg-text">{m.message}</div>
                      {m.createdAt && (
                        <div className="msg-time">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {showFraud && <FraudBanner fraud={fraud} onClose={() => setShowFraud(false)} />}

            <div className="chat-detail-input">
              <textarea
                className="form-input form-textarea"
                style={{ minHeight: 42, maxHeight: 100, padding: '10px 14px' }}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Type a message..."
              />
              <button className="send-btn" onClick={send}><Send size={18} /></button>
            </div>
          </>
        )}
      </div>
      )}
    </div>
  );
}
