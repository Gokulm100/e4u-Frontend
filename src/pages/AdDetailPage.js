import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, Eye, Clock, Tag, User, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

const FALLBACK = 'https://images.pexels.com/photos/10703759/pexels-photo-10703759.jpeg';

function ImageCarousel({ images }) {
  const [idx, setIdx] = useState(0);
  if (!images?.length) return null;
  const go = (dir) => setIdx(i => (i + dir + images.length) % images.length);
  return (
    <div className="img-carousel-wrap">
      <div className="img-carousel" style={{ transform: `translateX(-${idx * 100}%)`, transition: 'transform 0.3s', display: 'flex' }}>
        {images.map((src, i) => (
          <img key={i} className="carousel-img" src={src} alt={`img ${i + 1}`} onError={e => { e.target.src = FALLBACK; }} style={{ minWidth: '100%' }} />
        ))}
      </div>
      {images.length > 1 && <>
        <button className="carousel-nav prev" onClick={() => go(-1)}>‹</button>
        <button className="carousel-nav next" onClick={() => go(1)}>›</button>
        <div className="carousel-dots">
          {images.map((_, i) => (
            <button key={i} className={`carousel-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      </>}
    </div>
  );
}

function AiSummary({ listing, apiFetch }) {
  const [state, setState] = useState('loading'); // loading | done | error
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await apiFetch('/api/ads/summarizeAdUsingAi', {
          method: 'POST',
          body: JSON.stringify({ adTitle: listing.title, category: listing.category, subCategory: listing.subCategory, description: listing.description }),
        });
        if (!cancelled) { setSummary(res.data); setState('done'); }
      } catch { if (!cancelled) setState('error'); }
    }
    load();
    return () => { cancelled = true; };
  }, [listing, apiFetch]);

  return (
    <div className="ai-summary-card">
      <div className="ai-header">
        <span className="ai-icon">✦</span>
        <span className="ai-header-text">AI Summary</span>
      </div>
      {state === 'loading' && <div className="ai-loading"><div className="spinner" style={{ width: 18, height: 18 }} /><span>Analysing description…</span></div>}
      {state === 'error' && <div className="ai-error">Failed to load AI summary.</div>}
      {state === 'done' && summary && Object.entries(summary).map(([k, v]) => (
        <div key={k} className="ai-row">
          <div className="ai-key">{k}</div>
          <div className="ai-val">{typeof v === 'object' ? Object.entries(v).map(([a, b]) => `${a}: ${b}`).join(' · ') : String(v)}</div>
        </div>
      ))}
    </div>
  );
}

function PriceInsights({ listing, apiFetch }) {
  const [highest, setHighest] = useState(null);
  const [best, setBest] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch('/api/ai/provideAiPriceInsights', {
          method: 'POST',
          body: JSON.stringify({ adId: listing.id, category: listing.categoryId || listing.category, subCategory: listing.subCategory || 'General' }),
        });
        if (res.success && res.data?.summary) {
          const s = res.data.summary;
          setHighest(s.find(i => i.title?.includes('Highest')));
          setBest(s.find(i => i.title?.includes('Best')));
        }
      } catch { /* ignore */ }
    }
    load();
  }, [listing, apiFetch]);

  return (
    <div className="offers-row">
      <div className="offer-card">
        <div className="offer-badge">↗ Highest Offer</div>
        <div className="offer-price">{highest?.value ? `₹${Number(highest.value).toLocaleString('en-IN')}` : '₹-'}</div>
        <div className="offer-desc">{highest?.description || (highest ? '' : <div className="spinner" style={{ width: 18, height: 18, margin: '8px 0' }} />)}</div>
      </div>
      <div className="offer-card">
        <div className="offer-badge orange">🏆 Best Offer</div>
        <div className="offer-price">{best?.value ? `₹${Number(best.value).toLocaleString('en-IN')}` : '₹-'}</div>
        <div className="offer-desc">{best?.description || (best ? '' : <div className="spinner" style={{ width: 18, height: 18, margin: '8px 0' }} />)}</div>
      </div>
    </div>
  );
}

function AiAnalytics({ listing, apiFetch }) {
  const [state, setState] = useState('prompt'); // prompt | loading | done | error
  const [data, setData] = useState(null);

  const generate = async () => {
    setState('loading');
    try {
      const res = await apiFetch('/api/ai/provideAiAnalytics', {
        method: 'POST',
        body: JSON.stringify({ adId: listing.id, category: listing.categoryId || '', subCategory: listing.subCategory || '' }),
      });
      setData(res.data);
      setState('done');
    } catch { setState('error'); }
  };

  if (state === 'prompt') return (
    <div className="analytics-prompt">
      <div className="ai-powered-badge">AI POWERED</div>
      <div className="analytics-title">Boost your Ad Performance</div>
      <div className="analytics-desc">Get AI driven insights and smart tips to sell your item 2x faster.</div>
      <button className="generate-btn" onClick={generate}>✦ Generate Analysis</button>
    </div>
  );

  if (state === 'loading') return (
    <div className="analytics-prompt">
      <div className="spinner" />
      <div className="analytics-desc" style={{ marginTop: 12 }}>Analyzing market trends...</div>
    </div>
  );

  if (state === 'error') return (
    <div className="analytics-prompt">
      <div style={{ color: 'var(--error)' }}>Could not load AI analytics.</div>
      <button className="generate-btn" style={{ marginTop: 12 }} onClick={generate}>Try Again</button>
    </div>
  );

  const insights = Array.isArray(data?.analysis) ? data.analysis : [];
  const suggestions = Array.isArray(data?.recommendations) ? data.recommendations : [];

  return (
    <div className="detail-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✦</div>
          <div className="section-title" style={{ margin: 0 }}>AI Insights</div>
        </div>
        <button onClick={() => setState('prompt')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>↺</button>
      </div>
      <div className="analytics-insights">
        {insights.map((item, i) => (
          <div key={i} className="insight-card">
            <div className="insight-title">{item.title}</div>
            <div className="insight-value">{item.value}</div>
            <div className="insight-divider" />
            <div className="insight-desc">{item.description}</div>
          </div>
        ))}
      </div>
      {suggestions.length > 0 && (
        <div className="suggestions-box">
          <div className="suggestions-header">Optimization Tips</div>
          {suggestions.map((s, i) => (
            <div key={i} className="suggestion-row">
              <div className="suggestion-bullet" />
              <div><div className="s-title">{s.title}</div><div className="s-desc">{s.description}</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailChatBox({ listing, user, apiFetch, showToast, navigate }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const msgsRef = useRef(null);

  const fetchMsgs = async () => {
    try {
      const data = await apiFetch(`/api/ads/chat?adId=${listing.id}&sellerId=${listing.sellerId}&buyerId=${user._id}`);
      setMessages(Array.isArray(data.chats) ? data.chats : []);
    } catch { /* ignore */ }
  };

  const openChat = async () => {
    if (!user) { showToast('Please sign in to chat with the seller.', 'error'); navigate('profile'); return; }
    setOpen(true);
    await fetchMsgs();
  };

  const send = async () => {
    if (!input.trim()) return;
    const msg = input.trim(); setInput('');
    try {
      await apiFetch('/api/ads/chat', {
        method: 'POST',
        body: JSON.stringify({ adId: listing.id, from: user._id, to: listing.sellerId, message: msg }),
      });
      await fetchMsgs();
    } catch { showToast('Could not send message.', 'error'); }
  };

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  if (!open) return (
    <button className="chat-trigger-btn" onClick={openChat}>
      <Send size={18} /> Chat with Seller
    </button>
  );

  return (
    <div className="chat-box">
      <div className="section-title">Chat with Seller</div>
      <div className="chat-messages-area" ref={msgsRef}>
        {messages.length === 0
          ? <div className="chat-empty">No messages yet. Say hello!</div>
          : messages.map((m, i) => {
            const isMe = m.from === user?._id || m.from?._id === user?._id;
            return (
              <div key={i} className={`bubble${isMe ? ' me' : ''}`}>
                <div className="bubble-text">{m.message}</div>
              </div>
            );
          })}
      </div>
      <div className="chat-input-row">
        <textarea
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Type a message..."
        />
        <button className="send-btn" onClick={send}><Send size={18} /></button>
      </div>
    </div>
  );
}

export default function AdDetailPage() {
  const { pageExtra, navigate, user, apiFetch, showToast } = useApp();
  const listing = pageExtra.listing;

  if (!listing) return null;

  const isOwner = user?._id && (user._id === listing.sellerId || user._id === listing.seller?._id);

  return (
    <div>
      <div className="detail-back-bar">
        <button className="back-btn" onClick={() => navigate('my-ads')}><ArrowLeft size={18} /></button>
        <div className="detail-header-title">{listing.title}</div>
      </div>

      <div className="detail-layout">
        {/* Main column */}
        <div>
          <ImageCarousel images={listing.images} />

          <div className="detail-section">
            <div className="detail-price">₹{Number(listing.price).toLocaleString('en-IN')}</div>
            <div className="detail-title">{listing.title}</div>
            <div className="detail-tags">
              <div className="detail-tag"><Tag size={12} /> {listing.category}</div>
              {listing.subCategory && listing.subCategory !== 'General' && (
                <div className="detail-tag">{listing.subCategory}</div>
              )}
            </div>
            <div className="detail-meta">
              <div className="detail-meta-item"><MapPin size={14} /> {listing.location}</div>
              <div className="detail-meta-item"><Eye size={14} /> {listing.views} views</div>
              <div className="detail-meta-item"><Clock size={14} /> {listing.posted}</div>
            </div>
          </div>

          <div className="detail-section">
            <div className="section-title">Description</div>
            <div className="description-text">{listing.description || 'No description provided.'}</div>
          </div>

          {/* Move AiAnalytics to the bottom of main column */}
          {isOwner && <AiAnalytics listing={listing} apiFetch={apiFetch} />}
        </div>

        {/* Aside column */}
        <div>
          {/* Move AiSummary to the right column */}
          <AiSummary listing={listing} apiFetch={apiFetch} />

          {isOwner ? (
            <>
              <PriceInsights listing={listing} apiFetch={apiFetch} />
              <div className="seller-card">
                {listing.sellerPic
                  ? <img className="seller-avatar" src={listing.sellerPic} alt={listing.seller} />
                  : <div className="seller-avatar-fallback"><User size={20} /></div>}
                <div>
                  <div className="seller-label">Posted by</div>
                  <div className="seller-name">{listing.seller}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <DetailChatBox
                listing={listing}
                user={user}
                apiFetch={apiFetch}
                showToast={showToast}
                navigate={navigate}
              />
              <div className="seller-card">
                {listing.sellerPic
                  ? <img className="seller-avatar" src={listing.sellerPic} alt={listing.seller} />
                  : <div className="seller-avatar-fallback"><User size={20} /></div>}
                <div>
                  <div className="seller-label">Posted by</div>
                  <div className="seller-name">{listing.seller}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
