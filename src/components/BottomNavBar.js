import React from 'react';
import { Home, Star, Megaphone, MessageCircle, Plus } from 'lucide-react';

import './BottomNavBar.css';

const BottomNavBar = () => {
  return (
    <nav className="bottom-nav">
      <a href="/" className="bottom-nav__item">
        <Home />
        <span className="bottom-nav__label"></span>
      </a>
      <a href="/favorites" className="bottom-nav__item">
        <Star />
        <span className="bottom-nav__label">Favorites</span>
      </a>
            <a href="/myads" className="bottom-nav__item">
        <Plus />
        <span className="bottom-nav__label">Post Ad</span>
      </a>
      <a href="/myads" className="bottom-nav__item">
        <Megaphone />
        <span className="bottom-nav__label">My Ads</span>
      </a>
      <a href="/chat" className="bottom-nav__item">
        <MessageCircle />
        <span className="bottom-nav__label">Chat</span>
      </a>
    </nav>
  );
};

export default BottomNavBar;
