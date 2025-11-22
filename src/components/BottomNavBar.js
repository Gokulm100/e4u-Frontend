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
        <span className="bottom-nav__label">Chat</span>
      </button>
    </nav>
  );
};

export default BottomNavBar;
