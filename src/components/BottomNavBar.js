import React, { useRef, useState } from 'react';
import { Home, User, Megaphone, MessageCircle, Plus } from 'lucide-react';

import './BottomNavBar.css';

const BottomNavBar = ({
  styles,
  user,
  favorites,
  messageCountNavBar,
  showDropdown,
  setShowDropdown,
  handleLogout,
  setView,
  setEditMode,
  setEditAd,
  setMenuOpen,
  menuOpen
}) => {
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const googleDivRef = useRef(null);

  // Render Google button when modal is open
  React.useEffect(() => {
    if (showGoogleModal && window.google && window.google.accounts && window.google.accounts.id && googleDivRef.current) {
      window.google.accounts.id.initialize({
        client_id: '556452370430-fd5caae668lq9468hbseas0kr3o1a01g.apps.googleusercontent.com',
        callback: (response) => {
          if (response && response.credential) {
            setShowGoogleModal(false);
            if (typeof window.handleCredentialResponse === 'function') {
              window.handleCredentialResponse(response);
            }
          }
        },
      });
      window.google.accounts.id.renderButton(googleDivRef.current, { theme: 'outline', size: 'large' });
    }
  }, [showGoogleModal]);

  return (
    <>
      <nav className="bottom-nav">
        <button onClick={() => setView('home')} className="bottom-nav__item">
          <Home />
          <span className="bottom-nav__label">Home</span>
        </button>
        <button onClick={() => setView('messages')} className="bottom-nav__item" style={{ position: 'relative' }}>
          <MessageCircle />
          {messageCountNavBar > 0 && (
            <span style={{
              position: 'absolute',
              top: -3,
              right: 14,
              background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(37, 99, 235))',
              color: '#fff',
              borderRadius: '50%',
              padding: '2px 7px',
              fontSize: '12px',
              fontWeight: 'bold',
              minWidth: '9px',
              textAlign: 'center',
              zIndex: 2,
              boxShadow: '0 1px 4px rgba(37,99,235,0.13)'
            }}>{messageCountNavBar}</span>
          )}
          <span className="bottom-nav__label">Chat</span>
        </button>
        <button onClick={() => setView('post')} className="bottom-nav__item">
          <Plus />
          <span className="bottom-nav__label">Post Ad</span>
        </button>
        <button onClick={() => setView('myads')} className="bottom-nav__item">
          <Megaphone />
          <span className="bottom-nav__label">My Ads</span>
        </button>
        <button
          onClick={() => {
            if (user) {
              handleLogout && handleLogout();
            } else {
              // Show modal with Google button
              if (window.google && window.google.accounts && window.google.accounts.id) {
                setShowGoogleModal(true);
              } else {
                if (!document.getElementById('google-signin-script')) {
                  const script = document.createElement('script');
                  script.src = 'https://accounts.google.com/gsi/client';
                  script.async = true;
                  script.id = 'google-signin-script';
                  script.onload = () => setShowGoogleModal(true);
                  document.body.appendChild(script);
                } else {
                  setTimeout(() => setShowGoogleModal(true), 500);
                }
              }
            }
          }}
          className="bottom-nav__item"
        >
          <User />
          <span className="bottom-nav__label">{user ? 'Logout' : 'Login'}</span>
        </button>
      </nav>
    {/* Google Sign-In Modal */}
    {showGoogleModal && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.3)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
        onClick={() => setShowGoogleModal(false)}
      >
        <div
          style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ textAlign: 'center', marginBottom: 16, fontWeight: 600, fontSize: 18 }}>Sign in</div>
          <div ref={googleDivRef} />
          <button style={{ marginTop: 24, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }} onClick={() => setShowGoogleModal(false)}>Cancel</button>
        </div>
      </div>
    )}
    </>
  );
};

export default BottomNavBar;
