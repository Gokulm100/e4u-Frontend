import React from 'react';
import { Home, MessageCircle, PlusCircle, Volume2, User, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'messages', label: 'Messages', Icon: MessageCircle, badge: true },
  { id: 'post', label: 'Post', Icon: PlusCircle, red: true },
  { id: 'my-ads', label: 'My Ads', Icon: Volume2 },
  { id: 'profile', label: 'Profile', Icon: User },
];

export default function MobileNav() {
  const { user, currentPage, navigate, messageCount, adminPendingCount } = useApp();
  const isAdmin = !!(user?.isAdmin);

  return (
    <nav className="mobile-nav">
      {navItems.map(({ id, label, Icon, badge, red }) => (
        <button
          key={id}
          className={`mobile-nav-item${currentPage === id ? ' active' : ''}`}
          onClick={() => navigate(id)}
          style={red ? { color: 'var(--error)' } : undefined}
        >
          <Icon size={22} />
          {label}
          {badge && messageCount > 0 && (
            <span className="mob-badge">{messageCount}</span>
          )}
        </button>
      ))}
      {isAdmin && (
        <button
          type="button"
          className={`mobile-nav-item${currentPage === 'admin' ? ' active' : ''}`}
          onClick={() => navigate('admin')}
        >
          <Shield size={22} />
          Admin
          {adminPendingCount > 0 && (
            <span className="mob-badge">{adminPendingCount}</span>
          )}
        </button>
      )}
    </nav>
  );
}
