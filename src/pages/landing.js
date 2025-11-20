import AiTextArea from '../components/aiTextArea';
/* global google */
import React, { useState, useEffect, useRef } from 'react';
import MyAds from './myads';
import Favorites from './favorites';
import MessagesPage from './MessagesPage';
// import Chat from './chat';
// import { MapPin, Heart, Eye } from 'lucide-react';
import AdDetail from './adDetail';
import ChatFullScreen from './ChatFullScreen';
import Navbar from '../components/navbar';
import AllAds from './allads';
import { jwtDecode } from "jwt-decode";
import styles from '../pages/styles';
import ConsentModal from '../components/consent';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
// Removed unused tempImageUrls
// Loader overlay component
function LoaderOverlay() {
  return (
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
      justifyContent: 'center'
    }}>
      <div style={{
        width: 30,
        height: 30,
        border: '3px solid #d7ddd9ff',
        borderTop: '3px solid #3f4e6fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
    </div>
  );
}

const Landing = () => {
  // Ref for MessagesPage
  const messagesPageRef = useRef();
  // Refetch user messages for navbar badge and to pass to MessagesPage
  function refetchUserMessages() {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");
    if (storedUser && storedToken) {
      const userObj = JSON.parse(storedUser);
      if (userObj && userObj._id) {
        fetch(`${API_BASE_URL}/api/ads/getUserMessages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: userObj._id })
        })
          .then(res => res.json())
          .then(msgData => {
            setMessageCountNavBar(Array.isArray(msgData) ? msgData.length : (msgData.count || 0));
          })
          .catch(() => {
            setMessageCountNavBar(0);
          });
      }
    }
  }
  // Listen for service worker postMessage to open chat modal
  useEffect(() => {
    function handleSWMessage(event) {
      refetchUserMessages();
      if (messagesPageRef.current && typeof messagesPageRef.current.refreshChats === 'function') {
        messagesPageRef.current.refreshChats();
      }
      if (event.data && event.data.type === 'OPEN_CHAT') {
        setView('messages');
        setChatOpen(true);
      }
    }
    navigator.serviceWorker && navigator.serviceWorker.addEventListener('message', handleSWMessage);
    return () => {
      navigator.serviceWorker && navigator.serviceWorker.removeEventListener('message', handleSWMessage);
    };
  }, []);
  // Message count for detailed ad view
  const [messageCount, setMessageCount] = useState(0);
  // State declarations needed for useEffect below
  const [selectedListing, setSelectedListing] = useState(null);
  // Image carousel state for details view
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  // Reset image index when selectedListing changes
  useEffect(() => { setCurrentImageIdx(0); }, [selectedListing]);
  const [user, setUser] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  // Responsive check for mobile view
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  // Messages collapsible state and handler
  // Removed unused messagesCollapsed state
  // Removed unused adMessages state
  // Message count badge state for navbar
  const [messageCountNavBar, setMessageCountNavBar] = useState(0);
  // Loader state
  const [loading, setLoading] = useState(false);
  // Fetch message count for detailed ad view
  useEffect(() => {
    if (selectedListing && user) {
      fetch(`${API_BASE_URL}/api/ads/chat?adId=${selectedListing.id || selectedListing._id}&&sellerId=${selectedListing.sellerId || selectedListing.seller?._id}&buyerId=${user._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          setMessageCount(Array.isArray(data) ? data.length : 0);
        })
        .catch(() => setMessageCount(0));
    } else {
      setMessageCount(0);
    }
  }, [selectedListing, user, chatOpen]);
  // Removed unused handleMessagesClick function
  // Chat window state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  // Track selected message for chat modal
  const [selectedMessage, setSelectedMessage] = useState(null);
  // Edit ad API call (must be inside component)
  const handleEditAd = () => {
    if (!editAd.title || !editAd.price || !editAd.location || !editAd.description || !editAd.category) {
      alert('Please fill in all required fields');
      return;
    }
    if (editAd.description.length < 150) {
      alert('Description must be at least 150 characters long.');
      return;
    }
    const formData = new FormData();
    formData.append('id', editAd.id);
    formData.append('title', editAd.title);
    formData.append('price', editAd.price);
    formData.append('location', editAd.location);
    // Find the category id if a name is stored
    let categoryId = editAd.category;
    // if (categories && categories.length && typeof editAd.category === 'string') {
    //   const found = categories.find(cat => cat.name === editAd.category);
    //   if (found && found.id) categoryId = found.id;
    // }
    formData.append('category', categoryId);
    formData.append('subCategory', editAd.subCategory);
    formData.append('description', editAd.description);
    formData.append('seller', editAd.seller);
    if (editAd.image && typeof editAd.image !== 'string') {
      if (Array.isArray(editAd.image)) {
        editAd.image.forEach((file) => {
          formData.append('images', file);
        });
      } else if (editAd.image) {
        formData.append('images', editAd.image);
      }
    }
    fetch(`${API_BASE_URL}/api/ads/edit/${editAd.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setEditMode(false);
        setEditAd(null);
  // if (user && user._id) fetchMyAds(user._id); // removed, handled in MyAds
        alert('Ad updated successfully!');
      })
      .catch(() => {
        alert('Failed to update ad.');
      });
  };
  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editAd, setEditAd] = useState(null);
  const [listings, setListings] = useState([]);
  // myAds state moved to MyAds component
  const [locations, setLocations] = useState([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const [view, setView] = useState('home');
  // Removed unused searchQuery and selectedCategory state
  const [favorites, setFavorites] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState(['All']);
  const [lastListView, setLastListView] = useState('home');
  const observerTarget = useRef(null);
  useEffect(() => {
    // Fetch locations and categories only once on mount
    fetch(`https://api.countrystatecity.in/v1/countries/IN/states/KL/cities`, {
      headers: { 'X-CSCAPI-KEY': 'NTJPRVA2dFdZTWl6ZUhCSXRzVmdWem5BRk1tdE1VbE5KUlBubGVPQg==' }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLocations(data.map(city => ({ id: city.id, name: city.name })));
        }
      })
      .catch(() => {
        throw new Error('Failed to fetch locations');
      });

    fetch(`${API_BASE_URL}/api/ads/listCategories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const categoryObjs = data.map(cat => ({
            id: cat._id,
            name: cat.name,
            subCategories: cat.subCategory || []
          }));
          setCategories([{ id: 'all', name: 'All' }, ...categoryObjs]);
        }
      })
      .catch(() => {
        throw new Error('Failed to fetch categories');
      });
  }, []);

  // Fetch listings every time page changes
  // Removed obsolete IntersectionObserver useEffect for infinite scroll
  const [newListing, setNewListing] = useState({
    title: '',
    price: '',
    location: '', // Will hold the location id
    locationName: '', // Will hold the location name
    category: '', // Will hold the category id
    subCategory: '', // Will hold the subcategory id
    description: '',
    seller: '',
    image: null // Will hold the File object
  });

  // Removed unused filteredListings state


// Removed unused subCategories and selectedSubCategory state

// Subcategory bar styles for mobile responsiveness and horizontal scroll
const subCategoryBarStyle = {
  display: 'flex',
  gap: '8px',
  marginBottom: '24px',
  overflowX: 'auto',
  padding: '8px 0',
  animation: 'fadeIn 0.3s',
  scrollbarWidth: 'thin',
  scrollbarColor: '#c1c1c1 #f7f7f7',
};

const responsiveSubCategoryButton = {
  padding: '8px 14px',
  borderRadius: '20px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px',
  background: 'linear-gradient(90deg, #f7f7f7 0%, #e0eafc 100%)',
  color: '#333',
  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
  transition: 'background 0.2s, color 0.2s',
  whiteSpace: 'nowrap',
  width: 'auto'
};

const responsiveSubCategoryButtonActive = {
  ...responsiveSubCategoryButton,
  background: 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)',
  color: '#2563eb',
};

// Update responsiveTagStyle to show full text and cover it
const responsiveTagStyle = {
  display: 'inline-block',
  padding: '2px 12px',
  borderRadius: '12px',
  fontSize: '13px',
  fontWeight: 600,
  background: 'linear-gradient(90deg, #ffd6e0 0%, #f7f7f7 100%)',
  color: '#333',
  letterSpacing: 0.5,
  minWidth: 'fit-content',
  maxWidth: '100%',
  textAlign: 'center',
  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
  whiteSpace: 'nowrap',
  overflow: 'visible',
  textOverflow: 'clip',
};


  const [hasConsented, setHasConsented] = useState(() => {
    return localStorage.getItem('userConsent') === 'true';
  });

  useEffect(() => {
    if (!hasConsented) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [hasConsented]);

  function handleConsent() {
    localStorage.setItem('userConsent', 'true');
    setHasConsented(true);
  }

  function handleDecline() {
    localStorage.setItem('userConsent', 'false');
    setHasConsented(false);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    window.location.reload();
  }
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    if(storedUser && !hasConsented) return;
    // Dynamically load Google Identity script if not present
    if (!window.google || !window.google.accounts) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        // Now safe to call google.accounts.id.initialize
        google.accounts.id.initialize({
          client_id: "556452370430-fd5caae668lq9468hbseas0kr3o1a01g.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });
        // Desktop sign-in button
        const desktopDiv = document.getElementById("googleSignInDiv");
        if (desktopDiv) {
          google.accounts.id.renderButton(
            desktopDiv,
            { theme: "outline", size: "large" }
          );
        }
        // Mobile menu sign-in button
        const mobileDiv = document.getElementById("googleSignInDivMobile");
        if (mobileDiv) {
          google.accounts.id.renderButton(
            mobileDiv,
            { theme: "filled_blue", size: "small",shape: "pill" }
          );
        }
      };
      document.body.appendChild(script);
      return;
    }
    // If script is already loaded, proceed as before
    google.accounts.id.initialize({
      client_id: "556452370430-fd5caae668lq9468hbseas0kr3o1a01g.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    const storedToken = localStorage.getItem("authToken");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);
      // Fetch user messages for navbar badge on page load
      if (storedToken && userObj && userObj._id) {
        fetch(`${API_BASE_URL}/api/ads/getUserMessages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: userObj._id })
        })
          .then(res => res.json())
          .then(msgData => {
            console.log("User messages:", msgData);
            setMessageCountNavBar(Array.isArray(msgData) ? msgData.length : (msgData.count || 0));
          })
          .catch(() => {
            setMessageCountNavBar(0);
          });
      }
    } else {
      // Desktop sign-in button
      const desktopDiv = document.getElementById("googleSignInDiv");
      if (desktopDiv) {
        google.accounts.id.renderButton(
          desktopDiv,
          { theme: "filled_blue",size: "large",shape: "pill" }
        );
      }
      // Mobile menu sign-in button
      const mobileDiv = document.getElementById("googleSignInDivMobile");
      if (mobileDiv) {
        google.accounts.id.renderButton(
          mobileDiv,
          { theme: "filled_blue",size: "large",shape: "pill" }
        );
      }
    }
  }, [menuOpen, hasConsented]);
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
  // setMyAds([]); // removed, handled in MyAds
    setSelectedMessage(null);
    setFavorites([]);
    window.location.reload();
    // Optionally, redirect to login
  };

  const handleCredentialResponse = (response) => {
    setLoading(true);
    const token = response.credential;
    const userInfo = jwtDecode(token);
    console.log("Google user:", userInfo);

    fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // If user has not consented, open consent modal
        if (data.user && data.user.isConsented === false) {
          setLoading(false);
          localStorage.removeItem('userConsent');
          setHasConsented(false);
                  window.location.reload();
        } else {
          window.location.reload();
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // fetchMyAds moved to MyAds component
  const handlePostAd = () => {
    if (!newListing.title || !newListing.price || !newListing.location || !newListing.description || !newListing.category) {
      alert('Please fill in all required fields');
      return;
    }
    if (newListing.description.length < 150) {
      alert('Description must be at least 150 characters long.');
      return;
    }

    const formData = new FormData();
    formData.append('title', newListing.title);
    formData.append('price', newListing.price);
    formData.append('location', newListing.locationName);
    formData.append('category', newListing.category);
    if (newListing.subCategory) {
      formData.append('subCategory', newListing.subCategory);
    }
    formData.append('description', newListing.description);
    if (newListing.image) {
      if (Array.isArray(newListing.image)) {
        newListing.image.forEach((file) => {
          formData.append('images', file);
        });
      } else if (newListing.image) {
        formData.append('images', newListing.image);
      }
    }

    fetch(`${API_BASE_URL}/api/ads/postAdd`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setListings([data, ...listings]);
        setNewListing({
          title: '',
          price: '',
          location: '',
          category: '',
          subCategory: '',
          description: '',
          seller: '',
          image: null
        });
        setView('home');
        window.location.href = "/";
      });
  };

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };




  return (
    <div style={styles.app}>
      {/* Consent Modal and overlay if not consented */}
      {!localStorage.getItem('userConsent') && (
        <>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(255,255,255,0.85)',
            zIndex: 2000
          }} />
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ConsentModal onConsent={handleConsent} onDecline={handleDecline} />
          </div>
        </>
      )}

      <Navbar
        styles={styles}
        user={user}
        favorites={favorites}
        messageCountNavBar={messageCountNavBar}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        handleLogout={handleLogout}
        setView={setView}
        setEditMode={setEditMode}
        setEditAd={setEditAd}
        setMenuOpen={setMenuOpen}
        menuOpen={menuOpen}
      />

      {view === 'home' && (
        <AllAds
          styles={styles}
          setLastListView={setLastListView}
          setSelectedListing={setSelectedListing}
          setView={setView}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          responsiveTagStyle={responsiveTagStyle}
          subCategoryBarStyle={subCategoryBarStyle}
          responsiveSubCategoryButton={responsiveSubCategoryButton}
          responsiveSubCategoryButtonActive={responsiveSubCategoryButtonActive}
        />
      )}

      {view === 'detail' && selectedListing && (
        <AdDetail
          styles={styles}
          selectedListing={selectedListing}
          lastListView={lastListView}
          setView={setView}
          currentImageIdx={currentImageIdx}
          setCurrentImageIdx={setCurrentImageIdx}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          messageCount={messageCount}
          user={user}
          setChatOpen={setChatOpen}
          chatOpen={chatOpen}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          selectedMessage={selectedMessage}
          setSelectedMessage={setSelectedMessage}
          API_BASE_URL={API_BASE_URL}
        />
      )}

      {view === 'post' && (
        <div style={styles.formContainer}>
          <button style={styles.backButton} onClick={() => setView('home')}>
            ← Back
          </button>

          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Post Your Ad</h2>

            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  placeholder="e.g., iPhone 13 Pro Max"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category *</label>
                <select
                  style={styles.select}
                  value={newListing.category}
                  onChange={e => {
                    setNewListing({ ...newListing, category: e.target.value, subCategory: '' });
                  }}
                >
                  <option key='' value=''>-- Select Category --</option>
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              {/* Subcategory dropdown for Add Ad form */}
              {(() => {
                const selectedCat = categories.find(c => c.id === newListing.category);
                if (selectedCat && Array.isArray(selectedCat.subCategories) && selectedCat.subCategories.length > 0) {
                  return (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Subcategory</label>
                      <select
                        style={styles.select}
                        value={newListing.subCategory || ''}
                        onChange={e => setNewListing({ ...newListing, subCategory: e.target.value })}
                      >
                        <option key='' value=''>-- Select Subcategory --</option>
                        {selectedCat.subCategories.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  );
                }
                return null;
              })()}

              <div style={styles.formGroup}>
                <label style={styles.label}>Price (₹) *</label>
                <input
                  type="number"
                  style={styles.input}
                  value={newListing.price}
                  onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                  placeholder="15000"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Location *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder="Search city..."
                    value={locationSearch}
                    onChange={e => {
                      setLocationSearch(e.target.value);
                      setNewListing({ ...newListing, location: '', locationName: '' });
                      setShowLocationDropdown(true);
                    }}
                    autoComplete="off"
                    onFocus={() => setShowLocationDropdown(true)}
                  />
                  {showLocationDropdown && locationSearch && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#fff',
                      border: '1px solid #d1d5db',
                      borderTop: 'none',
                      maxHeight: 200,
                      overflowY: 'auto',
                      zIndex: 10,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                      {locations
                        .filter(loc => loc.name.toLowerCase().includes(locationSearch.toLowerCase()))
                        .map((loc, idx) => (
                          <div
                            key={loc.id || idx}
                            style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                            onClick={() => {
                              setNewListing({ ...newListing, location: loc.id, locationName: loc.name });
                              setLocationSearch(loc.name);
                              setShowLocationDropdown(false);
                            }}
                          >
                            {loc.name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description *</label>
                <AiTextArea
                  value={newListing.description}
                  onChange={e => setNewListing({ ...newListing, description: e.target.value })}
                  category={(() => {
                    const selectedCat = categories.find(c => c.id === newListing.category);
                    return selectedCat ? selectedCat.name : undefined;
                  })()}
                  subcategory={newListing.subCategory}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Image Upload (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={styles.input}
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                      setNewListing({ ...newListing, image: files });
                    }
                  }}
                />
                {Array.isArray(newListing.image) && newListing.image.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {newListing.image.map((file, idx) => (
                      <img key={idx} src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} style={{ maxWidth: 100, maxHeight: 100, borderRadius: 8 }} />
                    ))}
                  </div>
                )}
              </div>

              <button onClick={handlePostAd} style={styles.submitButton}>
                Post Ad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move myads block inside main return's <div> */}
      {view === 'myads' && (
        <MyAds
          styles={styles}
          editMode={editMode}
          editAd={editAd}
          setEditMode={setEditMode}
          setEditAd={setEditAd}
          categories={categories}
          setLastListView={setLastListView}
          setSelectedListing={setSelectedListing}
          setView={setView}
          handleEditAd={handleEditAd}
          observerTarget={observerTarget}
          user={user}
        />
      )}
      {view === 'favorites' && (
        <Favorites
          styles={styles}
          favorites={favorites}
          listings={listings}
          setLastListView={setLastListView}
          setSelectedListing={setSelectedListing}
          setView={setView}
          toggleFavorite={toggleFavorite}
        />
      )}
      {/* Add missing closing div for main app container */}
      {view === 'messages' && (
        <MessagesPage ref={messagesPageRef} refetchUserMessages={refetchUserMessages} />
      )}
      {/* Full-screen chat for mobile only */}
      {chatOpen && isMobile && (
        <ChatFullScreen
          selectedListing={selectedListing}
          selectedMessage={selectedMessage}
          user={user}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          setChatOpen={setChatOpen}
          chatOpen={chatOpen}
          API_BASE_URL={API_BASE_URL}
        />
      )}
      {loading && <LoaderOverlay />}
    </div>
  );
};



export default Landing