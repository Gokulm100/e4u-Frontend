import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createOptimisticMessage, mergeWithPending, removeOptimistic } from '../utils/chatMessages';
import {
  parseChatPayload,
  payloadToMessage,
  payloadMatchesChat,
  payloadMatchesAd,
  appendIncomingMessage,
  normalizeId,
} from '../utils/chatSocket';
import { emitJoin } from '../utils/socket';

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
  const { pageExtra, navigate, user, apiFetch, showToast, fetchMessageCount, subscribeChatMessages } = useApp();
  const { chatInfo, otherName, isSeller } = pageExtra;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [fraud, setFraud] = useState(null);
  const [showFraud, setShowFraud] = useState(true);
  const msgsRef = useRef(null);
  const chatInfoRef = useRef(chatInfo);
  const fetchMsgsRef = useRef(null);
  chatInfoRef.current = chatInfo;

  const { adId, buyerId, sellerId, adTitle } = chatInfo || {};

  const fetchMsgs = useCallback(async (silent = false) => {
    if (!adId || !buyerId || !sellerId) return;
    try {
      const data = await apiFetch(`/api/ads/chat?adId=${adId}&buyerId=${buyerId}&sellerId=${sellerId}`);
      if (data.fraudCheck) { setFraud(data.fraudCheck); setShowFraud(true); }
      const msgs = Array.isArray(data) ? data : (Array.isArray(data.chats) ? data.chats : []);
      setMessages(prev => (silent ? mergeWithPending(msgs, prev) : msgs));
    } catch { /* ignore */ }
  }, [adId, buyerId, sellerId, apiFetch]);

  fetchMsgsRef.current = fetchMsgs;

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
    if (!user?._id) return undefined;
    emitJoin(user._id);
    return subscribeChatMessages((payload) => {
      const info = chatInfoRef.current;
      if (!info?.adId) return;
      const parsed = parseChatPayload(payload);
      if (!parsed.message) return;

      const matchesThread = payloadMatchesChat(payload, info)
        || payloadMatchesAd(payload, info.adId);
      if (!matchesThread) return;

      const fromMe = normalizeId(parsed.from) === normalizeId(user._id);
      const incoming = payloadToMessage(parsed);
      setMessages(prev => appendIncomingMessage(
        prev.filter(m => !(m._optimisticId && fromMe && m.message === incoming.message)),
        incoming,
      ));
      if (!fromMe) markSeen();
    });
  }, [user?._id, subscribeChatMessages]);

  useEffect(() => {
    if (!adId || !buyerId || !sellerId) return undefined;
    const interval = setInterval(() => fetchMsgsRef.current?.(true), 15000);
    return () => clearInterval(interval);
  }, [adId, buyerId, sellerId]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !user?._id) return;
    const msg = input.trim();
    const optimistic = createOptimisticMessage(msg, user._id);
    const optId = optimistic._optimisticId;
    setInput('');
    setMessages(prev => [...prev, optimistic]);
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
    } catch {
      setMessages(prev => removeOptimistic(prev, optId));
      setInput(msg);
      showToast('Could not send message.', 'error');
    }
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
                <React.Fragment key={m._id || m._optimisticId || i}>
                  {separator}
                  <div className={`msg-bubble${isMe ? ' me' : ''}${m.pending ? ' pending' : ''}`}>
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
