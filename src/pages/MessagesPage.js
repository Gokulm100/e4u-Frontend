import React, { useState, useEffect } from 'react';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const tabStyle = {
  display: 'flex',
  gap: '16px',
  marginBottom: '24px',
};
const activeTabStyle = {
  borderBottom: '3px solid #2563eb',
  color: '#2563eb',
  fontWeight: 600,
};
const cardStyle = {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'left',
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  padding: '16px',
  marginBottom: '16px',
  cursor: 'pointer',
  transition: 'box-shadow 0.2s',
};
const avatarStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  marginRight: '18px',
  objectFit: 'cover',
};
const infoStyle = {
  flex: 1,
};
const itemStyle = {
  fontWeight: 500,
  color: '#2563eb',
  marginBottom: '4px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  maxWidth: '250px',
};
const nameStyle = {
  fontWeight: 600,
  fontSize: '17px',
  marginBottom: '2px',
};
const messageStyle = {
  color: '#374151',
  marginBottom: '2px',
};
const timeStyle = {
  color: '#6b7280',
  fontSize: '13px',
  textAlign: 'right',
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
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px' }}>
      <div style={{
        background: '#fff',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(37,99,235,0.10)',
        padding: '32px 24px',
        minHeight: '480px',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '32px', color: '#2563eb', textAlign: 'center' }}>Messages</h2>
        <div style={tabStyle}>
          <button
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.1rem',
              padding: '8px 0',
              cursor: 'pointer',
              ...(activeTab === 'selling' ? activeTabStyle : {})
            }}
            onClick={() => setActiveTab('selling')}
          >
            Selling
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.1rem',
              padding: '8px 0',
              cursor: 'pointer',
              ...(activeTab === 'buying' ? activeTabStyle : {})
            }}
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
