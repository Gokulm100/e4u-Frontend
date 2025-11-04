import React, { useEffect, useRef } from 'react';

const Chat = ({
  user,
  chatOpen,
  setChatOpen,
  selectedListing,
  selectedMessage,
  chatMessages,
  setChatMessages,
  chatInput,
  setChatInput,
  API_BASE_URL,
}) => {
  // You can move all chat-related login and chat modal logic here
  // Example: fetch messages, send messages, handle chat UI

  useEffect(() => {
    if (chatOpen && selectedListing && user) {
      // Fetch chat messages for the selected listing and user
      fetch(`${API_BASE_URL}/api/ads/chat?adId=${selectedListing.id || selectedListing._id}&userId=${user._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          // Try to use data.messages or data as array
          if (Array.isArray(data)) {
            setChatMessages(data);
          } else if (Array.isArray(data.messages)) {
            setChatMessages(data.messages);
          } else {
            setChatMessages([]);
          }
        })
        .catch(() => setChatMessages([]));
    }
  }, [chatOpen, selectedListing, user, API_BASE_URL, setChatMessages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    // Use the correct payload structure as in landing.js
    fetch(`${API_BASE_URL}/api/ads/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        adId: selectedListing.id || selectedListing._id,
        message: chatInput.trim(),
        to: selectedListing.sellerId || selectedListing.seller?._id,
        from: user._id
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.message) {
            setChatMessages(prev => [
            ...prev,
            {
              _id: data._id,
              adId: data.adId,
              message: data.message,
              seenAt: data.seenAt,
              to: data.to,
              from: { _id: user._id }, // assuming sender is current user
              createdAt: data.createdAt
            }
            ]);
        }
        setChatInput('');
      })
      .catch(() => {
        setChatInput('');
      });
  };

  // Ref for auto-scroll
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, width: "auto", maxWidth: 'auto', background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', borderRadius: 16, zIndex: 10000, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ padding: '12px 18px', borderBottom: '1px solid #f0f0f0', fontWeight: 600, fontSize: 16, background: 'linear-gradient(90deg, #f7f7f7 0%, #e0eafc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{ fontWeight: 700, color: '#222', fontSize: 15, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 'auto' }}>{selectedListing?.title || 'Ad'}</span>
          <span style={{
            background: 'linear-gradient(90deg, #dbeafe 0%, #f0f9ff 100%)',
            color: '#2563eb',
            fontWeight: 600,
            fontSize: 12,
            borderRadius: 8,
            padding: '2px 8px',
            marginTop: 2,
            boxShadow: '0 1px 4px rgba(37,99,235,0.07)',
            display: 'inline-block',
            letterSpacing: 0.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign:'left',
            width: `calc(${(selectedListing?.seller || 'Seller').length}ch + 16px)`
          }}>{selectedListing?.seller || 'Seller'}</span>
        </div>
        <button style={{ background: 'none', border: 'none', fontSize: 20, color: '#888', cursor: 'pointer', marginLeft: 8 }} onClick={() => setChatOpen(false)} aria-label="Close chat">&times;</button>
      </div>
      <div style={{ flex: 1, minHeight: 220, maxHeight: 320, overflowY: 'auto', padding: '18px 24px', background: '#fafbfc' }}>
        {chatMessages && chatMessages.length > 0 ? (() => {
          let lastDate = '';
          return chatMessages.map((msg, idx) => {
            const dateObj = msg.createdAt ? new Date(msg.createdAt) : null;
            const msgDate = dateObj ? `${dateObj.getDate().toString().padStart(2, '0')}-${dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase()}-${dateObj.getFullYear()}` : '';
            const showDate = msgDate !== lastDate;
            lastDate = msgDate;
            return (
              <React.Fragment key={msg._id || idx}>
                {showDate && (
                  <div style={{ textAlign: 'center', color: '#a2a3a4ff', fontWeight: 600, fontSize: 12, margin: '12px 0 8px 0', letterSpacing: 0.5 }}>
                    {msgDate}
                  </div>
                )}
                <div style={{ marginBottom: 14, textAlign: msg.from?._id === user._id ? 'right' : 'left' }}>
                  <span style={{ background: msg.from?._id === user._id ? 'linear-gradient(90deg, #e0eafc 0%, #c2e9fb 100%)' : '#f7f7f7', padding: '8px 16px', borderRadius: 14, display: 'inline-block', fontSize: 14, color: '#222', boxShadow: msg.from?._id === user._id ? '0 2px 8px rgba(37,99,235,0.08)' : '0 1px 3px rgba(0,0,0,0.04)' }}>
                    {msg.message}
                  </span>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2, marginLeft: msg.from?._id === user._id ? 0 : 4, marginRight: msg.from?._id === user._id ? 4 : 0 }}>
                    {dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              </React.Fragment>
            );
          });
        })() : (
          <div style={{ color: '#bbb', textAlign: 'center', fontSize: 14 }}>No messages yet.</div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', background: '#fff', display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid #e0eafc', fontSize: 15, background: '#f7f7f7', outline: 'none', boxShadow: 'none' }}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} style={{ background: '#346feeff', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px rgba(37,99,235,0.08)', transition: 'background 0.2s' }}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
