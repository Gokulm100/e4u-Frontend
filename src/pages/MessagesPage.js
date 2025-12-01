import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSwipeable } from 'react-swipeable';
import Chat from './chat';
import ChatFullScreen from './ChatFullScreen';

// Helper to get initials from a name string ("First Last" or just "First")
function getInitials(name) {
  if (!name || typeof name !== 'string') return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Simple loader overlay component
const ChatLoading = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(255,255,255,0.7)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{

    }}>
      <div className="loader" style={{
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #2563eb',
        borderRadius: '50%',
        width: 40,
        height: 40,
        animation: 'spin 1s linear infinite',
      }} />
      <span style={{ color: '#2563eb', fontWeight: 600 }}></span>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);
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
  padding: isMobile ? '10px 0px 10px' : '14px 0',
  cursor: 'pointer',
  color: '#374151',
  fontWeight: 500,
  textAlign:'left',
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
  width: isMobile ? 40 : 48,
  height: isMobile ? 40 : 48,
  borderRadius: '50%',
  marginRight: isMobile ? 10 : 18,
  // Remove marginBottom to avoid oval effect
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#3182ba',
  color: '#ffffff',
  fontWeight: 700,
  fontSize: 18,
  objectFit: 'contain',
  flexShrink: 0,
  overflow: 'hidden',
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
  width: isMobile ? '100%' : '350px',
  fontSize: isMobile ? '14px' : 'inherit',
};
const timeStyle = {
  color: '#6b7280',
  width: isMobile ? '100%' : 'auto',
  fontSize: isMobile ? '12px' : '13px',
  textAlign: 'right',
  marginTop: isMobile ? '6px' : '0',
};

const MessagesPage = forwardRef(({ refetchUserMessages }, ref) => {
  // Swipe handlers for chat modal (mobile only)
  const chatSwipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (isMobile && chatOpen) setChatOpen(false);
    },
    delta: 50,
    trackTouch: true,
    trackMouse: false,
  });
  const [activeTab, setActiveTab] = useState('selling');
  const [sellingChats, setSellingChats] = useState([]);
  const [buyingChats, setBuyingChats] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [fraudRecommendations, setFraudRecommendations] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [user, setUser] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);

  // Listen for service worker postMessage to open a specific chat
  useEffect(() => {
    function handleSWMessage(event) {
      if (event.data && event.data.type === 'OPEN_CHAT') {
        // Try to find the chat by adId or chatId from the notification payload
        const { adId, chatId } = event.data.data || {};
        let foundChat = null;
        if (adId) {
          foundChat = sellingChats.concat(buyingChats).find(chat => chat.adId === adId);
        } else if (chatId) {
          foundChat = sellingChats.concat(buyingChats).find(chat => chat.id === chatId);
        }
        if (foundChat) {
          setSelectedChat(foundChat);
          setChatOpen(true);
        } else {
          // If not found, just open the messages page
          setChatOpen(false);
        }
      }
    }
    navigator.serviceWorker && navigator.serviceWorker.addEventListener('message', handleSWMessage);
    return () => {
      navigator.serviceWorker && navigator.serviceWorker.removeEventListener('message', handleSWMessage);
    };
  }, [sellingChats, buyingChats]);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

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
  const markMessagesAsSeen = (chat) => {
    if (user && chat) {
      if(user._id === chat.lastMessageFrom) 
        {
          refreshChats();
           refetchUserMessages();

          return; // Don't mark as seen if the user is the sender
        }
      fetch(`${API_BASE_URL}/api/ads/markMessagesAsSeen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ adId: chat.adId, reader: user._id, sender: chat.lastMessageFrom })
      })
      .then(res => {
        if (res.ok) {
          refreshChats();
           refetchUserMessages();

        }
      });
    }
  };
  // Function to refresh both selling and buying chats
  const refreshChats = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('authToken');
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
            if (Array.isArray(data.filteredMessages)) {
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
          if (Array.isArray(data.filteredMessages)) {
            setBuyingChats(data.filteredMessages);
          } else {
            setBuyingChats([]);
          }
        })
        .catch(() => setBuyingChats([]));
    }
  };

  useImperativeHandle(ref, () => ({
    refreshChats
  }));

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
        minHeight: isMobile ? 'inherit' : '480px',
      }}>
        <h2 style={{ fontSize: isMobile ? '1.3rem' : '2rem', fontWeight: 700, marginBottom: isMobile ? '18px' : '32px', color: '#2563eb', textAlign: 'center' }}>Messages</h2>
        <div style={tabStyle}>
          <button
            style={activeTab === 'selling' ? activeTabStyle : tabBtnStyle}
            onClick={() => { setActiveTab('selling'); refreshChats(); }}
          >
            Selling
          </button>
          <button
            style={activeTab === 'buying' ? activeTabStyle : tabBtnStyle}
            onClick={() => { setActiveTab('buying'); refreshChats(); }}
          >
            Buying
          </button>
        </div>
        <div>
          {activeTab === 'selling' && (
            <div>
              {sellingChats.map(chat => (
                <div
                  key={chat.id}
                  style={cardStyle}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
                  onClick={async () => {
                    setChatLoading(true);
                    setSelectedChat(chat);
                    markMessagesAsSeen(chat);
                    setChatOpen(true);
                    // Fetch messages before opening modal
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/ads/chat?adId=${chat.adId}&sellerId=${chat.sellerId}&buyerId=${chat.buyerId}`);
                      if (res.ok) {
                        const data = await res.json();
                        setChatMessages(data.chats || []);
                        console.log(data.fraudCheck.recommendations);
                        if (data && data.fraudCheck && data.fraudCheck.recommendations) {
                          setFraudRecommendations(data.fraudCheck.recommendations);
                        } else {
                          setFraudRecommendations(null);
                        }
                      } else {
                        setChatMessages([]);
                        setFraudRecommendations(null);
                      }
                    } catch {
                      setChatMessages([]);
                      setFraudRecommendations(null);
                    }
                    setChatLoading(false);
                  }}
                >
                  <div style={infoStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={avatarStyle}>
                        {getInitials(
                          (activeTab === 'selling'
                            ? chat.sellerName || chat.buyerName
                            : chat.buyerName || chat.sellerName
                          ) || chat.name || chat.fullName || (chat.firstName + ' ' + chat.lastName) || chat.email || 'U')}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={nameStyle}>{chat.buyerName}</span>
                        <span style={itemStyle}>{chat.item}</span>
                      <span style={messageStyle}>
                        {chat.lastMessage && chat.lastMessage.length > 30
                        ? chat.lastMessage.slice(0, 30) + ' ...'
                        : chat.lastMessage}
                      </span>
                      </div>
                      {!chat.isSeen && chat.lastMessageFrom !== user?._id && (
                        <span style={{
                          display: 'inline-block',
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: '#2563eb',
                          marginLeft: 2
                        }} />
                      )}
                    </div>
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
                <div
                  key={chat.id}
                  style={cardStyle}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
                  onClick={async () => {
                    setChatLoading(true);
                    setSelectedChat(chat);
                    markMessagesAsSeen(chat);
                    setChatOpen(true);
                    // Fetch messages before opening modal
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/ads/chat?adId=${chat.adId}&buyerId=${chat.buyerId}&sellerId=${chat.sellerId}`);
                      if (res.ok) {
                        const data = await res.json();
                        setChatMessages(data.chats || []);
                        if (data && data.fraudCheck && data.fraudCheck.recommendations) {
                          setFraudRecommendations(data.fraudCheck.recommendations);
                        } else {
                          setFraudRecommendations(null);
                        }
                      } else {
                        setChatMessages([]);
                        setFraudRecommendations(null);
                      }
                    } catch {
                      setChatMessages([]);
                      setFraudRecommendations(null);
                    }
                    setChatLoading(false);
                  }}
                >
                    <div style={infoStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={avatarStyle}>
                        {getInitials(
                          (activeTab === 'selling'
                            ? chat.sellerName || chat.buyerName
                            : chat.buyerName || chat.sellerName
                          ) || chat.name || chat.fullName || (chat.firstName + ' ' + chat.lastName) || chat.email || 'U')}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={nameStyle}>{chat.buyerName}</span>
                      <span style={itemStyle}>{chat.item}</span>
                      <span style={messageStyle}>
                        {chat.lastMessage && chat.lastMessage.length > 30
                        ? chat.lastMessage.slice(0, 30) + ' ...'
                        : chat.lastMessage}
                      </span>
                      </div>
                      {!chat.isSeen && chat.lastMessageFrom !== user?._id && (
                      <span style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#2563eb',
                        marginLeft: 2
                      }} />
                      )}
                    </div>
                    </div>
                    <div style={timeStyle}>{chat.time}</div>
                  </div>
                  ))}
                  {buyingChats.length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No buying chats yet.</div>}
                </div>
                )}
                {/* Chat modal overlay (moved outside tab blocks) */}
          {/* Loader overlay when loading chat (only for mobile) */}
          {isMobile && chatOpen && chatLoading && <ChatLoading />}
          {chatOpen && selectedChat && (!chatLoading || !isMobile) && (
            isMobile ? (
              <div {...chatSwipeHandlers} style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 10001, background: 'rgba(30,41,59,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChatFullScreen
                  selectedListing={{
                    id: selectedChat.adId,
                    title: selectedChat.item,
                    sellerId: activeTab === 'selling' ? user?._id : selectedChat.sellerId,
                    buyerId: activeTab === 'selling' ? selectedChat.buyerId : user?._id,
                    seller: selectedChat.sellerName,
                    buyer: selectedChat.buyerName
                  }}
                  selectedMessage={null}
                  user={user}
                  chatLoading={chatLoading}
                  chatMessages={chatMessages}
                  setChatMessages={setChatMessages}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  setChatOpen={setChatOpen}
                  chatOpen={chatOpen}
                  API_BASE_URL={API_BASE_URL}
                />
              </div>
            ) : (
              <Chat
                user={user}
                chatOpen={chatOpen}
                chatLoading={chatLoading}
                setChatOpen={(open) => {
                  setChatOpen(open);
                }}
                selectedListing={{
                  id: selectedChat.adId,
                  title: selectedChat.item,
                  sellerId: activeTab === 'selling' ? user?._id : selectedChat.sellerId,
                  buyerId: activeTab === 'selling' ? selectedChat.buyerId : user?._id,
                  seller: selectedChat.sellerName,
                  buyer: selectedChat.buyerName
                }}
                selectedMessage={null}
                chatMessages={chatMessages}
                setChatMessages={setChatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                API_BASE_URL={API_BASE_URL}
                disableAutoFetch={true}
                to={selectedChat.sellerId || selectedChat.buyerId}
                refreshChats={refreshChats}
                fraudRecommendations={fraudRecommendations}
              />
            )
          )}
          {/* (Removed duplicate refreshChats function) */}
        </div>
      </div>
    </div>
  );
});

export default MessagesPage;
