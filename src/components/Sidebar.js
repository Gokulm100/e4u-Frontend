import React from 'react';
import { Home, MessageCircle, PlusCircle, Volume2, User, Lock, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'messages', label: 'Messages', Icon: MessageCircle, badge: true },
  { id: 'post', label: 'Post Ad', Icon: PlusCircle },
  { id: 'my-ads', label: 'My Ads', Icon: Volume2 },
  { id: 'profile', label: 'Profile', Icon: User },
];

export default function Sidebar() {
  const { user, currentPage, navigate, messageCount, adminPendingCount } = useApp();
  const isAdmin = !!(user?.isAdmin);

  return (
    <nav className="sidebar">
      <div className="sidebar-nav">
        {navItems.map(({ id, label, Icon, badge }) => (
          <button
            key={id}
            className={`nav-item${currentPage === id ? ' active' : ''}`}
            onClick={() => navigate(id)}
          >
            <Icon size={18} />
            {label}
            {badge && messageCount > 0 && (
              <span className="nav-badge">{messageCount}</span>
            )}
          </button>
        ))}
        {isAdmin && (
          <button
            type="button"
            className={`nav-item nav-item-admin${currentPage === 'admin' ? ' active' : ''}`}
            onClick={() => navigate('admin')}
          >
            <Shield size={18} />
            Admin
            {adminPendingCount > 0 && (
              <span className="nav-badge">{adminPendingCount}</span>
            )}
          </button>
        )}
      </div>
      <div className="sidebar-footer">
        <button
          className={`nav-item${currentPage === 'consent' ? ' active' : ''}`}
          onClick={() => navigate('consent')}
        >
          <Lock size={18} /> Privacy & Terms
        </button>
      </div>
    </nav>
  );
}
