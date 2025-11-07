import React from 'react';
import { Heart, Plus, Menu, X } from 'lucide-react';

const Navbar = ({
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
}) => (
  <header style={styles.header}>
    <div style={styles.headerContainer}>
      <div style={styles.headerTop}>
        <h1 style={styles.logo} onClick={() => setView('home')}>
          e4you.com
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <nav style={{ ...styles.nav, display: window.innerWidth < 768 ? 'none' : 'flex' }}>
            <button style={styles.navButton} onClick={() => setView('favorites')}>
              <Heart style={{ width: '16px', height: '16px' }} />
              Favorites ({favorites.length})
            </button>
            <button style={styles.navButton} onClick={() => {
              setEditMode(false);
              setEditAd(null);
              setView('myads');
            }}>
              My Ads
            </button>
            <button style={{ ...styles.postButton, background: 'transparent', color: '#2563eb' }} onClick={() => setView('messages')} title="Messages">Messages
              <div style={{position: 'relative', display: 'inline-block'}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                <span style={{
                  position: 'absolute',
                  top: -6,
                  right: -10,
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
              </div>
            </button>
            {user ? (
              <div style={{ position: "relative" }}>
                <img
                  src={user.profilePic}
                  alt={user.name}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer" }}
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50px",
                      right: 0,
                      background: "#fff",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                      borderRadius: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      style={{
                        padding: "10px 20px",
                        width: "100%",
                        border: "none",
                        background: "white",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div id="googleSignInDiv"></div>
            )}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={styles.postButton} onClick={() => {
              if (!user) {
                alert('Please login to post an ad.');
              } else {
                setView('post');
              }
            }}>
              <Plus style={{ width: '20px', height: '20px' }} />
              <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>Post Ad</span>
            </button>
            <button
              style={{ ...styles.menuButton, display: window.innerWidth < 768 ? 'block' : 'none' }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
            </button>
          </div>
        </div>
      </div>
    </div>
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <button
            style={styles.mobileMenuItem}
            onClick={() => { setView('favorites'); setMenuOpen(false); }}
          >
            <Heart style={{ width: '16px', height: '16px' }} />
            Favorites ({favorites.length})
          </button>
          <button
            style={styles.mobileMenuItem}
            onClick={() => {
              setEditMode(false);
              setEditAd(null);
              setView('myads');
              setMenuOpen(false);
            }}
          >
            My Ads
          </button>
          <button
            style={styles.mobileMenuItem}
            onClick={() => {
              setView('messages');
              setMenuOpen(false);
            }}
            title="Messages"
          >
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#595a5bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              <span style={{
                position: 'absolute',
                top: -6,
                right: -10,
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
            </div>
            Messages
          </button>
          {user ? (
            <button
              style={styles.mobileMenuItem}
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <div style={{ padding: '12px 16px', width: '30%' }}>
              <div id="googleSignInDivMobile"></div>
            </div>
          )}
        </div>
      )}
  </header>
);

export default Navbar;
