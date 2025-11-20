import { Heart, Plus, Menu, X, Megaphone } from 'lucide-react';
import { useEffect } from 'react';


// Add animations
const addAnimations = () => {
  if (!document.querySelector('style[data-navbar-animations]')) {
    const styleSheet = document.createElement("style");
    styleSheet.setAttribute('data-navbar-animations', 'true');
    styleSheet.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
    `;
    document.head.appendChild(styleSheet);
  }
};

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
}) => {
  useEffect(() => {
    addAnimations();
  }, []);

  return (
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
                <Megaphone style={{ width: '16px', height: '16px', marginRight: 6, verticalAlign: 'middle' }} />
                My Ads
              </button>
              <button style={{ ...styles.messageButton, background: 'transparent', color: '#ffffffff' }} onClick={() => setView('messages')} title="Messages">
                Messages
                <div style={{position: 'relative', display: 'inline-block'}}>
                  <svg width="22" color="#ffffffff" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
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
                <div id="googleSignInDiv" key={user === null ? 'signin-visible' : 'signin-visible'}></div>
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
                <span style={{ display: window.innerWidth < 640 ? 'inline' : 'none' }}>Post Ad</span>
                <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>Post Ad</span>
              </button>
              <button
                style={{ ...styles.menuButton, display: window.innerWidth < 768 ? 'block' : 'none' }}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X style={{ width: '24px', height: '24px', color:"white" }} /> : <Menu style={{ width: '24px', height: '24px' ,color:"white"}} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {menuOpen && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 998,
              animation: 'fadeIn 0.3s ease-in-out'
            }}
            onClick={() => setMenuOpen(false)}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '280px',
            maxWidth: '80vw',
            backgroundColor: '#fff',
            boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.3s ease-in-out',
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>
            
            {user && (
              <div style={{
                padding: '20px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <img
                  src={user.profilePic}
                  alt={user.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '16px' }}>{user.name}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>{user.email}</div>
                </div>
              </div>
            )}
            
            <nav style={{ flex: 1, padding: '12px 0' }}>
              <button
                style={styles.mobileMenuItem}
                onClick={() => { setView('favorites'); setMenuOpen(false); }}
              >
                <Heart style={{ width: '20px', height: '20px' }} />
                <span>Favorites ({favorites.length})</span>
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
                                <Megaphone style={{ width: '16px', height: '16px', marginRight: 6, verticalAlign: 'middle' }} />

                <span>My Ads</span>
              </button>
              <button
                style={styles.mobileMenuItem}
                onClick={() => {
                  setView('messages');
                  setMenuOpen(false);
                }}
              >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {messageCountNavBar > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -4,
                      left: 12,
                      background: '#2563eb',
                      color: '#fff',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      minWidth: '18px',
                      textAlign: 'center'
                    }}>{messageCountNavBar}</span>
                  )}
                </div>
                <span>Messages</span>
              </button>
            </nav>
            
            <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
              {user ? (
                <button
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              ) : (
                <div id="googleSignInDivMobile"></div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;