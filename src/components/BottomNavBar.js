import React from 'react';
import { Home, Star, Megaphone, MessageCircle, Plus } from 'lucide-react';

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
  return (
    <nav className="bottom-nav">
      <button   onClick={() => setView('home')} className="bottom-nav__item">
        <Home />
        <span className="bottom-nav__label">Home</span>
      </button>
      <button  onClick={() => setView('favorites')} className="bottom-nav__item">
        <Star />
        <span className="bottom-nav__label">Favorites</span>
      </button>
            <button  onClick={() => setView('post')} className="bottom-nav__item">
        <Plus />
        <span className="bottom-nav__label">Post Ad</span>
      </button>
      <button  onClick={() => setView('myads')} className="bottom-nav__item">
        <Megaphone />
        <span className="bottom-nav__label">My Ads</span>
      </button>
      <button  onClick={() => setView('messages')} className="bottom-nav__item">
        <MessageCircle />
                  <span style={{
                    position: 'absolute',
                    top: 7,
                    right:15,
                    display: messageCountNavBar> 0? 'visible':'visible',
                    background: messageCountNavBar > 0 ? '#2563eb' : '#d1d5db',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    minWidth: '8px',
                    textAlign: 'center',
                    zIndex: 2,
                    opacity: messageCountNavBar >= 0 ? 1 : 0
                  }}>{messageCountNavBar}</span>
                
        <span className="bottom-nav__label">Chat</span>
      </button>
    </nav>
  );
};

export default BottomNavBar;
