import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, MessageCircle, X, ShieldAlert, ImagePlus, Flag } from 'lucide-react';
import { confirmAndReportUser } from '../utils/reportUser';
import { useApp } from '../context/AppContext';
import { uploadChatImage } from '../utils/chatUpload';
import { createOptimisticMessage, mergeWithPending, removeOptimistic } from '../utils/chatMessages';
import {
  parseChatPayload,
  payloadToMessage,
  payloadMatchesChat,
  payloadMatchesAd,
  appendIncomingMessage,
  patchConversationList,
  normalizeId,
} from '../utils/chatSocket';
import { emitJoin } from '../utils/socket';
import ChatTrustCaution from '../components/ChatTrustCaution';
import { getChatTrustCautionFromProfile } from '../utils/chatTrustCaution';
import { SkeletonChatRow, SkeletonConversation } from '../components/Skeleton';

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
  const lastMsgObj = typeof item.lastMessage === 'object' ? item.lastMessage : null;
  const lastMsg = typeof item.lastMessage === 'string'
    ? item.lastMessage
    : (item.lastMessage?.message || (lastMsgObj?.imageUrl ? '📷 Photo' : ''));
  const adTitle = item.item || item.adTitle || item.adId?.title || item.ad?.title || '';
  const lastMsgFrom = item.lastMessage?.from?._id || item.lastMessage?.from || item.lastMessageFrom;
  const isMe = lastMsgFrom && user?._id && String(lastMsgFrom) === String(user._id);
  const isUnread = item.isSeen === false && !isMe;
  const lastMsgTime = getLastMessageTime(item);
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
          ? <img className="chat-avatar chat-avatar-img" src={otherPic} alt="" />
          : <div className="chat-avatar">{getInitials(otherName)}</div>}
        {isUnread && <span className="unread-dot" aria-hidden />}
      </div>
      <div className="chat-info">
        <div className="chat-header-row">
          <span className={`chat-name${isUnread ? ' unread' : ''}`}>{otherName}</span>
          {lastMsgTime && <span className="chat-time">{formatChatTime(lastMsgTime)}</span>}
        </div>
        {adTitle && <span className="chat-ad-pill" title={adTitle}>{adTitle}</span>}
        <p className={`chat-preview${isUnread ? ' unread' : ''}`}>
          {isMe && <span className="chat-preview-you">You: </span>}
          {lastMsg || 'No messages yet'}
        </p>
      </div>
    </div>
  );
}

function FraudBanner({ fraud, onClose, onReportUser }) {
  if (!fraud?.fraudIndicators?.length) return null;
  return (
    <div className="fraud-banner">
      <div className="fraud-banner-head">
        <div className="fraud-title">
          <ShieldAlert size={15} />
          Safety insight
        </div>
        <button type="button" className="fraud-banner-close" onClick={onClose} aria-label="Dismiss">
          <X size={16} />
        </button>
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
      {fraud.type !== 'SAFE' && onReportUser && (
        <button type="button" className="fraud-report-btn" onClick={onReportUser}>
          Report user
        </button>
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

function getLastMessageTime(item) {
  const lm = item?.lastMessage;
  if (lm && typeof lm === 'object') {
    return lm.createdAt || lm.updatedAt || lm.timestamp || null;
  }
  return item?.updatedAt || item?.lastMessageAt || item?.lastMessageTime || item?.createdAt || null;
}

function formatChatTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000 && d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diff < 604800000) {
    return d.toLocaleDateString([], { weekday: 'short' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
  const { user, apiFetch, navigate, hasConsented, showToast, fetchMessageCount, subscribeChatMessages } = useApp();
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
  const [counterparty, setCounterparty] = useState(null);
  const [showTrustCaution, setShowTrustCaution] = useState(true);
  const [isMobileView, setIsMobileView] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const [viewerImage, setViewerImage] = useState(null);
  const msgsRef = useRef(null);
  const fileInputRef = useRef(null);
  const selectedChatRef = useRef(selectedChat);
  const fetchSelectedChatRef = useRef(null);
  const reloadListsRef = useRef(null);
  selectedChatRef.current = selectedChat;

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

  const reloadLists = useCallback(async (showSpinner = false) => {
    if (!user) return;
    if (showSpinner) setLoading(true);
    try {
      const storedToken = localStorage.getItem('authToken');
      const [r1, r2] = await Promise.all([
        apiFetch('/api/ads/getBuyingMessages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        }),
        apiFetch('/api/ads/getSellingMessages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        }),
      ]);
      setBuying(Array.isArray(r1?.filteredMessages) ? r1.filteredMessages : []);
      setSelling(Array.isArray(r2?.filteredMessages) ? r2.filteredMessages : []);
    } catch { /* ignore */ }
    finally { if (showSpinner) setLoading(false); }
  }, [user, apiFetch]);

  reloadListsRef.current = reloadLists;

  useEffect(() => {
    reloadLists(true);
  }, [reloadLists]);

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

  const fetchSelectedChat = async (silent = false) => {
    const info = selectedChat?.chatInfo;
    if (!info?.adId || !info?.buyerId || !info?.sellerId) return;
    if (!silent) setChatLoading(true);
    try {
      const data = await apiFetch(`/api/ads/chat?adId=${info.adId}&buyerId=${info.buyerId}&sellerId=${info.sellerId}`);
      if (data.fraudCheck) {
        setFraud(data.fraudCheck);
        setShowFraud(true);
      }
      if (data.counterparty) {
        setCounterparty(data.counterparty);
      }
      const msgs = Array.isArray(data) ? data : (Array.isArray(data.chats) ? data.chats : []);
      setMessages(prev => (silent ? mergeWithPending(msgs, prev) : msgs));
    } catch { /* ignore */ }
    finally { if (!silent) setChatLoading(false); }
  };

  fetchSelectedChatRef.current = fetchSelectedChat;

  const handleReportUser = () => {
    const info = selectedChat?.chatInfo;
    if (!info) return;
    confirmAndReportUser({
      apiFetch,
      showToast,
      buyerId: info.buyerId,
      sellerId: info.sellerId,
      isSeller: selectedChat.isSeller,
      targetName: selectedChat.otherName,
    });
  };

  const markSelectedSeen = async () => {
    const info = selectedChat?.chatInfo;
    if (!info?.adId || !user?._id) return;
    try {
      const senderId = selectedChat.isSeller ? info.buyerId : info.sellerId;
      await apiFetch('/api/ads/markMessagesAsSeen', {
        method: 'POST',
        body: JSON.stringify({
          adId: info.adId,
          reader: user._id,
          sender: senderId,
          buyerId: info.buyerId,
          sellerId: info.sellerId,
        }),
      });
      fetchMessageCount();
    } catch { /* ignore */ }
  };

  useEffect(() => {
    if (!selectedChat?.chatInfo) return;
    setCounterparty(null);
    setShowTrustCaution(true);
    fetchSelectedChat();
    markSelectedSeen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  useEffect(() => {
    setShowTrustCaution(true);
  }, [counterparty?._id]);

  useEffect(() => {
    if (!user?._id) return undefined;
    emitJoin(user._id);
    return subscribeChatMessages((payload) => {
      const parsed = parseChatPayload(payload);
      if (!parsed.message && !parsed.imageUrl) return;

      const fromMe = normalizeId(parsed.from) === normalizeId(user._id);
      const incoming = payloadToMessage(parsed);
      const sel = selectedChatRef.current;

      if (sel?.chatInfo) {
        const matchesThread = payloadMatchesChat(payload, sel.chatInfo)
          || payloadMatchesAd(payload, sel.chatInfo.adId);
        if (matchesThread) {
          setMessages(prev => appendIncomingMessage(
            prev.filter(m => !(m._optimisticId && fromMe && m.message === incoming.message)),
            incoming,
          ));
          if (!fromMe) {
            const info = sel.chatInfo;
            const senderId = sel.isSeller ? info.buyerId : info.sellerId;
            apiFetch('/api/ads/markMessagesAsSeen', {
              method: 'POST',
              body: JSON.stringify({
                adId: info.adId,
                reader: user._id,
                sender: senderId,
                buyerId: info.buyerId,
                sellerId: info.sellerId,
              }),
            }).then(() => fetchMessageCount()).catch(() => {});
          }
        } else {
          fetchSelectedChatRef.current?.(true);
        }
      }

      setBuying(prev => {
        const buyingPatch = patchConversationList(prev, parsed, user._id, true, fromMe);
        setSelling(sp => {
          const sellingPatch = patchConversationList(sp, parsed, user._id, false, fromMe);
          if (!fromMe && !buyingPatch.found && !sellingPatch.found) {
            reloadListsRef.current?.(false);
          }
          return sellingPatch.list;
        });
        return buyingPatch.list;
      });
    });
  }, [user?._id, subscribeChatMessages, apiFetch, fetchMessageCount]);

  useEffect(() => {
    if (!selectedChat?.chatInfo) return undefined;
    const interval = setInterval(() => fetchSelectedChatRef.current?.(true), 15000);
    return () => clearInterval(interval);
  }, [selectedChat]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  const bumpListLastMessage = (chatInfo, message, isSeller) => {
    const now = new Date().toISOString();
    const patch = (item) => {
      if (!isSameConversation(item, chatInfo, !isSeller, user)) return item;
      const prevLm = typeof item.lastMessage === 'object' && item.lastMessage ? item.lastMessage : {};
      return {
        ...item,
        updatedAt: now,
        lastMessage: { ...prevLm, message, createdAt: now, from: user._id },
      };
    };
    if (isSeller) setSelling(prev => prev.map(patch));
    else setBuying(prev => prev.map(patch));
  };

  const send = async () => {
    const msg = input.trim();
    const info = selectedChat?.chatInfo;
    if (!msg || !info?.adId || !user?._id) return;
    const optimistic = createOptimisticMessage(msg, user._id);
    const optId = optimistic._optimisticId;
    setInput('');
    setMessages(prev => [...prev, optimistic]);
    bumpListLastMessage(info, msg, selectedChat.isSeller);
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
      fetchSelectedChat(true);
    } catch {
      setMessages(prev => removeOptimistic(prev, optId));
      setInput(msg);
      showToast('Could not send message.', 'error');
    }
  };

  const sendImage = async (file) => {
    const info = selectedChat?.chatInfo;
    if (!file || !info?.adId || !user?._id) return;
    const localUrl = URL.createObjectURL(file);
    const optimistic = createOptimisticMessage('', user._id, localUrl);
    const optId = optimistic._optimisticId;
    setMessages(prev => [...prev, optimistic]);
    bumpListLastMessage(info, '📷 Photo', selectedChat.isSeller);
    try {
      await uploadChatImage({
        adId: info.adId,
        from: selectedChat.isSeller ? info.sellerId : info.buyerId,
        to: selectedChat.isSeller ? info.buyerId : info.sellerId,
        file,
      });
      fetchSelectedChat(true);
    } catch {
      setMessages(prev => removeOptimistic(prev, optId));
      showToast('Could not send photo.', 'error');
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
    <div className="messages-page">
      <header className="messages-page-header">
        <h1 className="messages-page-title">Messages</h1>
        <p className="messages-page-subtitle">Stay in touch with buyers and sellers</p>
      </header>

      <div className="messages-split-layout">
        <div className="messages-list-panel">
          <div className="messages-list-card">
        <div className="messages-tabs">
          <button className={`msg-tab${tab === 0 ? ' active' : ''}`} onClick={() => setTab(0)}>
            Buying {buyingUnread > 0 && <span className="msg-badge">{buyingUnread}</span>}
          </button>
          <button className={`msg-tab${tab === 1 ? ' active' : ''}`} onClick={() => setTab(1)}>
            Selling {sellingUnread > 0 && <span className="msg-badge">{sellingUnread}</span>}
          </button>
        </div>

        {loading && (
          <div className="chat-list">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonChatRow key={`skel-${i}`} />)}
          </div>
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
        </div>

      {!isMobileView && (
      <div className="messages-chat-panel">
        {!selectedChat?.chatInfo && (
          <div className="messages-chat-placeholder">
            <div className="messages-placeholder-icon">
              <MessageCircle size={32} strokeWidth={1.75} />
            </div>
            <span className="empty-title">Select a conversation</span>
            <span className="empty-sub">Pick a chat from Buying or Selling to start messaging.</span>
          </div>
        )}

        {selectedChat?.chatInfo && (
          <>
            <div className="messages-chat-header">
              <div className="messages-chat-header-main">
                <div className="messages-chat-header-avatar">{getInitials(selectedChat.otherName)}</div>
                <div className="messages-chat-header-text">
                  <div className="messages-chat-name">{selectedChat.otherName}</div>
                  {selectedChat.chatInfo.adTitle && (
                    <div className="messages-chat-subtitle">{selectedChat.chatInfo.adTitle}</div>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="messages-chat-report-btn"
                onClick={handleReportUser}
                aria-label="Report user"
                title="Report user"
              >
                <Flag size={16} />
              </button>
            </div>

            {showTrustCaution && (() => {
              const trustCaution = getChatTrustCautionFromProfile(counterparty);
              if (!trustCaution.show) return null;
              return (
                <ChatTrustCaution
                  reason={trustCaution.reason}
                  onClose={() => setShowTrustCaution(false)}
                />
              );
            })()}

            <div className="chat-detail-msgs" ref={msgsRef}>
              {chatLoading && <SkeletonConversation />}
              {!chatLoading && messages.length === 0 && (
                <div className="messages-empty-chat">
                  <MessageCircle size={28} strokeWidth={1.75} />
                  <span>No messages yet — say hi!</span>
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
                  <React.Fragment key={m._id || m._optimisticId || i}>
                    {separator}
                    <div className={`msg-bubble${isMe ? ' me' : ''}${m.pending ? ' pending' : ''}${m.imageUrl ? ' has-image' : ''}`}>
                      {m.imageUrl && (
                        <img
                          className="msg-image"
                          src={m.imageUrl}
                          alt="attachment"
                          onClick={() => setViewerImage(m.imageUrl)}
                        />
                      )}
                      {m.message && <div className="msg-text">{m.message}</div>}
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

            {showFraud && (
              <FraudBanner
                fraud={fraud}
                onClose={() => setShowFraud(false)}
                onReportUser={handleReportUser}
              />
            )}

            <div className="chat-detail-input">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) sendImage(file);
                  e.target.value = '';
                }}
              />
              <textarea
                className="messages-compose-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Write a message..."
                rows={1}
              />
              <button
                type="button"
                className="chat-attach-btn"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Attach photo"
              >
                <ImagePlus size={24} />
              </button>
              <button type="button" className="messages-send-btn" onClick={send} aria-label="Send message">
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
      )}
      </div>

      {viewerImage && (
        <div className="image-viewer-overlay" onClick={() => setViewerImage(null)}>
          <button className="image-viewer-close" aria-label="Close">✕</button>
          <img className="image-viewer-img" src={viewerImage} alt="attachment" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
