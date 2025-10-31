import React from 'react';

const mockSellingChats = [
  {
    id: 1,
    buyerName: 'Alice',
    item: 'iPhone 13 Pro Max',
    lastMessage: 'Is it still available?',
    time: '2 hours ago',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    buyerName: 'Bob',
    item: 'Mountain Bike',
    lastMessage: 'Can I see more photos?',
    time: '1 day ago',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
   {
    id: 1,
    buyerName: 'Alice',
    item: 'iPhone 13 Pro Max',
    lastMessage: 'Is it still available?',
    time: '2 hours ago',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    buyerName: 'Bob',
    item: 'Mountain Bike',
    lastMessage: 'Can I see more photos?',
    time: '1 day ago',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  }, {
    id: 1,
    buyerName: 'Alice',
    item: 'iPhone 13 Pro Max',
    lastMessage: 'Is it still available?',
    time: '2 hours ago',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    buyerName: 'Bob',
    item: 'Mountain Bike',
    lastMessage: 'Can I see more photos?',
    time: '1 day ago',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
];

const mockBuyingChats = [
  {
    id: 3,
    sellerName: 'Charlie',
    item: 'MacBook Air',
    lastMessage: 'Price negotiable?',
    time: '3 hours ago',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 4,
    sellerName: 'Diana',
    item: 'Guitar',
    lastMessage: 'When can I pick up?',
    time: '2 days ago',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
];

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
  const [activeTab, setActiveTab] = React.useState('selling');

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
              {mockSellingChats.map(chat => (
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
              {mockSellingChats.length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No selling chats yet.</div>}
            </div>
          )}
          {activeTab === 'buying' && (
            <div>
              {mockBuyingChats.map(chat => (
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
              {mockBuyingChats.length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No buying chats yet.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
