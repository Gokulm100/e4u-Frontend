import React, { useState, useEffect } from 'react';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const isMobile = typeof window !== 'undefined' ? window.innerWidth < 600 : false;

const tabStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: isMobile ? '8px' : '32px',
  marginBottom: isMobile ? '16px' : '32px',
  justifyContent: 'flex-start',
  alignItems: 'center',
  borderBottom: '1.5px solid #e5e7eb',
  background: 'transparent',
};
const tabBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: isMobile ? '1rem' : '1.15rem',
  padding: isMobile ? '10px 0' : '14px 0',
  cursor: 'pointer',
  color: '#374151',
  fontWeight: 500,
  outline: 'none',
  borderBottom: '2.5px solid transparent',
  transition: 'color 0.2s, border-bottom 0.2s',
};
const activeTabStyle = {
  ...tabBtnStyle,
  color: '#2563eb',
  borderBottom: '2.5px solid #2563eb',
  fontWeight: 700,
};
const cardStyle = {
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  alignItems: isMobile ? 'flex-start' : 'center',
  textAlign: 'left',
  background: '#fff',
  borderRadius: isMobile ? '8px' : '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  padding: isMobile ? '10px' : '16px',
  marginBottom: isMobile ? '10px' : '16px',
  cursor: 'pointer',
  transition: 'box-shadow 0.2s',
};
const avatarStyle = {
  width: isMobile ? '40px' : '48px',
  height: isMobile ? '40px' : '48px',
  borderRadius: '50%',
  marginRight: isMobile ? '10px' : '18px',
  marginBottom: isMobile ? '8px' : '0',
  objectFit: 'cover',
};
const infoStyle = {
  flex: 1,
  minWidth: 0,
};
const itemStyle = {
  fontWeight: 500,
  color: '#2563eb',
  marginBottom: '4px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: isMobile ? 'normal' : 'nowrap',
  maxWidth: isMobile ? '100%' : '250px',
};
const nameStyle = {
  fontWeight: 600,
  fontSize: isMobile ? '15px' : '17px',
  marginBottom: '2px',
};
const messageStyle = {
  color: '#374151',
  marginBottom: '2px',
  fontSize: isMobile ? '14px' : 'inherit',
};
const timeStyle = {
  color: '#6b7280',
  fontSize: isMobile ? '12px' : '13px',
  textAlign: 'right',
  marginTop: isMobile ? '6px' : '0',
};

const MessagesPage = () => {
  const [activeTab, setActiveTab] = useState('selling');
  const [sellingChats, setSellingChats] = useState([]);
  const [buyingChats, setBuyingChats] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
     const storedToken = localStorage.getItem("authToken");
    if (user) {
      fetch(`${API_BASE_URL}/api/ads/getSellingMessages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
        }
      })
      .then(res => res.json())
      .then(data => {
        // Try to use data.messages or data as array
        if (Array.isArray(data.filteredMessages)) {
          console.log(data.filteredMessages);
          setSellingChats(data.filteredMessages);
        } else {
          setSellingChats([]);
        }
      })
      .catch(() => setSellingChats([]));
     fetch(`${API_BASE_URL}/api/ads/getBuyingMessages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
        }
      })
      .then(res => res.json())
      .then(data => {
        // Try to use data.messages or data as array
        if (Array.isArray(data.filteredMessages)) {
          console.log(data.filteredMessages);
          setBuyingChats(data.filteredMessages);
        } else {
          setBuyingChats([]);
        }
      })
      .catch(() => setBuyingChats([]));
    }
  }, []);
  return (
    <div style={{
      maxWidth: isMobile ? '100%' : 600,
      margin: isMobile ? '0' : '40px auto',
      padding: isMobile ? '0 4px' : '0 16px',
      minHeight: '100vh',
      background: isMobile ? '#f8fafc' : 'transparent',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: isMobile ? '12px' : '18px',
        boxShadow: isMobile ? '0 2px 8px rgba(37,99,235,0.08)' : '0 4px 24px rgba(37,99,235,0.10)',
        padding: isMobile ? '18px 8px' : '32px 24px',
        minHeight: isMobile ? 'auto' : '480px',
      }}>
        <h2 style={{ fontSize: isMobile ? '1.3rem' : '2rem', fontWeight: 700, marginBottom: isMobile ? '18px' : '32px', color: '#2563eb', textAlign: 'center' }}>Messages</h2>
        <div style={tabStyle}>
          <button
            style={activeTab === 'selling' ? activeTabStyle : tabBtnStyle}
            onClick={() => setActiveTab('selling')}
          >
            Selling
          </button>
          <button
            style={activeTab === 'buying' ? activeTabStyle : tabBtnStyle}
            onClick={() => setActiveTab('buying')}
          >
            Buying
          </button>
        </div>
        <div>
          {activeTab === 'selling' && (
            <div>
              {sellingChats.map(chat => (
                <div key={chat.id} style={cardStyle} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.12)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}>
                  <img src={chat.avatar} alt={chat.buyerName} style={avatarStyle} />
                  <div style={infoStyle}>
                    <div style={nameStyle}>{chat.buyerName}</div>
                    <div style={itemStyle}>{chat.item}</div>
                    <div style={messageStyle}>{chat.lastMessage}</div>
                  </div>
                  <div style={timeStyle}>{chat.time}</div>
                </div>
              ))}
              {sellingChats.length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No selling chats yet.</div>}
            </div>
          )}
          {activeTab === 'buying' && (
            <div>
              {buyingChats.map(chat => (
                <div key={chat.id} style={cardStyle} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.12)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}>
                  <img src={chat.avatar} alt={chat.sellerName} style={avatarStyle} />
                  <div style={infoStyle}>
                    <div style={nameStyle}>{chat.sellerName}</div>
                    <div style={itemStyle}>{chat.item}</div>
                    <div style={messageStyle}>{chat.lastMessage}</div>
                  </div>
                  <div style={timeStyle}>{chat.time}</div>
                </div>
              ))}
              {buyingChats.length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No buying chats yet.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
