import React from 'react';
import Chat from './chat';

// This page is only for mobile full-screen chat
const ChatFullScreen = ({
  selectedListing,
  selectedMessage,
  user,
  chatMessages,
  setChatMessages,
  chatInput,
  setChatInput,
  setChatOpen,
  chatOpen,
  API_BASE_URL
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#fff',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
        borderRadius: 0,
        boxShadow: 'none',
        overflow: 'hidden',
      }}
    >
      <Chat
        selectedListing={selectedListing}
        selectedMessage={selectedMessage || { user: user?._id }}
        user={user}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        setChatOpen={setChatOpen}
        chatOpen={chatOpen}
        API_BASE_URL={API_BASE_URL}
        isMobile={true}
      />
    </div>
  );
};

export default ChatFullScreen;
