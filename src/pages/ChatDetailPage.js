import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

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

export default function ChatDetailPage() {
  const { pageExtra, navigate, user, apiFetch, showToast, fetchMessageCount } = useApp();
  const { chatInfo, otherName, isSeller } = pageExtra;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [fraud, setFraud] = useState(null);
  const [showFraud, setShowFraud] = useState(true);
  const msgsRef = useRef(null);

  const { adId, buyerId, sellerId, adTitle } = chatInfo || {};

  const fetchMsgs = async (silent = false) => {
    if (!adId || !buyerId || !sellerId) return;
    try {
      const data = await apiFetch(`/api/ads/chat?adId=${adId}&buyerId=${buyerId}&sellerId=${sellerId}`);
      if (data.fraudCheck) { setFraud(data.fraudCheck); setShowFraud(true); }
      const msgs = Array.isArray(data) ? data : (Array.isArray(data.chats) ? data.chats : []);
      setMessages(msgs);
    } catch { /* ignore */ }
  };

  const markSeen = async () => {
    if (!adId || !user?._id) return;
    try {
      const senderId = isSeller ? buyerId : sellerId;
      await apiFetch('/api/ads/markMessagesAsSeen', {
        method: 'POST',
        body: JSON.stringify({ adId, reader: user._id, sender: senderId }),
      });
      fetchMessageCount();
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchMsgs();
    markSeen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatInfo]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const msg = input.trim(); setInput('');
    try {
      await apiFetch('/api/ads/chat', {
        method: 'POST',
        body: JSON.stringify({
          adId,
          from: isSeller ? sellerId : buyerId,
          to: isSeller ? buyerId : sellerId,
          message: msg,
        }),
      });
      fetchMsgs(true);
    } catch { showToast('Could not send message.', 'error'); }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date(); yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === now.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  let lastDate = null;

  return (
    <div>
      <div className="detail-back-bar chat-header-bar">
        <button className="back-btn" onClick={() => navigate('messages')}><ArrowLeft size={18} /></button>
        <div className="chat-header-info">
          <div className="detail-header-title">{otherName}</div>
          {adTitle && <div className="chat-header-subtitle">{adTitle}</div>}
        </div>
      </div>

      <div className="chat-detail-layout">
        <div className="chat-detail-msgs" ref={msgsRef}>
          {messages.length === 0
            ? <div className="chat-empty-state">No messages yet. Say hi! 👋</div>
            : messages.map((m, i) => {
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
                      <div className="date-label">{formatDate(m.createdAt)}</div>
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
          <button className="send-btn" onClick={send} disabled={!input.trim()}><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
}
