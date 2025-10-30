import React, { useState ,useEffect} from 'react';
import { Search, Plus, MapPin, Heart, User, Menu, X } from 'lucide-react';
import {jwtDecode} from "jwt-decode";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// ChatModal component for chat window
const ChatModal = ({ selectedListing, selectedMessage, user, chatMessages, setChatMessages, chatInput, setChatInput, setChatOpen }) => {
  useEffect(() => {
    // Fetch chat messages from /api/ads/chat with adId and userId as query params
    if (selectedListing && user) {
      fetch(`${API_BASE_URL}/api/ads/chat?adId=${selectedListing.id || selectedListing._id}&userId=${selectedMessage.user}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          setChatMessages(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          setChatMessages([]);
        });
    }
    // eslint-disable-next-line
  }, [selectedListing, user]);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const modalStyle = isMobile
    ? {
        position: 'fixed',
        left: '50%',
        bottom: 24,
        transform: 'translateX(-50%)',
        width: '90vw',
        maxWidth: 350,
        minWidth: 260,
        background: '#fff',
        borderRadius: 10,
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        zIndex: 9999,
        padding: 16,
        margin: '0 auto',
        boxSizing: 'border-box'
      }
    : {
        position: 'fixed',
        right: 40,
        bottom: 40,
        width: 350,
        background: '#fff',
        borderRadius: 10,
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        zIndex: 9999,
        padding: 16,
        boxSizing: 'border-box'
      };
  return (
    <div style={modalStyle}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h3 style={{margin: 0}}>
            {selectedListing?.title || 'Chat'}
            {/* Show the name of the 'from' person from the clicked message card, not the ad seller name */}
            {selectedMessage && selectedMessage.from && (
              <span style={{fontWeight: 400, fontSize: 14, marginLeft: 8, color: '#2563eb'}}>
                — {selectedMessage.from?.name || selectedMessage.from || 'Unknown User'}
              </span>
            )}
        </h3>
        <button style={{background: 'none', border: 'none', fontSize: 18, cursor: 'pointer'}} onClick={() => setChatOpen(false)}>×</button>
      </div>
      <div style={{height: 180, overflowY: 'auto', margin: '12px 0', background: '#f7f7f7', borderRadius: 6, padding: 8}}>
        {chatMessages.length === 0 ? (
          <div style={{color: '#888'}}>No messages yet.</div>
        ) : (
          chatMessages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: 8,
                textAlign: (msg.from?._id === user?._id) ? 'right' : 'left'
              }}
            >
              <span
                style={{
                  background: (msg.from?._id === user?._id) ? '#2563eb' : '#eee',
                  color: (msg.from?._id === user?._id) ? '#fff' : '#333',
                  borderRadius: 6,
                  padding: '6px 12px',
                  display: 'inline-block'
                }}
              >
                {msg.message}
              </span>
              <div style={{fontSize: 12, color: '#2563eb', marginTop: 2}}>
                {msg.from?.name || msg.sender || 'Unknown User'}
                {msg.createdAt && (
                  <span style={{color: '#888', marginLeft: 8}}>
                    {typeof msg.createdAt === 'string' ? new Date(msg.createdAt).toLocaleString() : msg.createdAt.toLocaleString() }
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={e => {
        e.preventDefault();
        if (chatInput.trim()) {
          // Add message locally
          setChatMessages([...chatMessages, { sender: 'me', message: chatInput ,createdAt: new Date().toISOString(), from: { _id: user?._id, name: user?.name }}]);
          // Determine recipient
          let toId = '';
          if (user?._id !== selectedListing?.sellerId) {
            // If logged-in user is not the seller, send to seller
            toId = selectedListing?.sellerId;
          } else if (selectedMessage && selectedMessage.user) {
            // If logged-in user is the seller, send to user from message list
            toId = selectedMessage.user;
          }
          fetch(`${API_BASE_URL}/api/ads/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
              adId: selectedListing?.id || selectedListing?._id,
              message: chatInput,
              to: toId,
              from: user?._id || ''
            })
          })
            .then(res => res.json())
            .then(data => {
              // Optionally handle response, e.g., update chatMessages with server data
            })
            .catch(() => {
              // Optionally handle error
            });
          setChatInput("");
        }
      }} style={{display: 'flex', gap: 8}}>
        <input
          type="text"
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          style={{flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd'}}
          placeholder="Type your message..."
        />
        <button type="submit" style={{background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer'}}>Send</button>
      </form>
    </div>
  );
};
const Landing = () => {
  // Messages collapsible state and handler
  const [messagesCollapsed, setMessagesCollapsed] = useState(false);
  const [adMessages, setAdMessages] = useState([]);
  const handleMessagesClick = async () => {
    if (!selectedListing) return;
    setMessagesCollapsed(prev => !prev);
    if (!messagesCollapsed) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ads/latestMessages`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ adId: selectedListing.id, userId: user._id })
        });
        const data = await res.json();
        setAdMessages(Array.isArray(data) ? data : []);
      } catch {
        setAdMessages([]);
      }
    }
  };
  // Chat window state
  const [chatOpen, setChatOpen] = useState(false);
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
    formData.append('description', editAd.description);
    formData.append('seller', editAd.seller);
    if (editAd.image && typeof editAd.image !== 'string') {
      formData.append('image', editAd.image);
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
        if (user && user._id) fetchMyAds(user._id);
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
  const [myAds, setMyAds] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const [view, setView] = useState('home');
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
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
            name: cat.name
          }));
          setCategories([{ id: 'all', name: 'All' }, ...categoryObjs]);
        }
      })
      .catch(() => {
        throw new Error('Failed to fetch categories');
      });
    fetch(`${API_BASE_URL}/api/ads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const listingObjs = data.map(listing => {
            let posted = 'Unknown';
            if (listing.createdAt) {
              const created = new Date(listing.createdAt);
              const now = new Date();
              const diffMs = now - created;
              const diffMin = Math.floor(diffMs / 1000 / 60);
              const diffHr = Math.floor(diffMin / 60);
              const diffDay = Math.floor(diffHr / 24);
              if (diffMin < 1) {
                posted = 'moments ago';
              } else if (diffMin < 60) {
                posted = `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
              } else if (diffHr < 24) {
                posted = `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
              } else if (diffDay < 7) {
                posted = `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
              } else {
                posted = created.toLocaleDateString();
              }
            }
            return {
              id: listing._id,
              title: listing.title,
              price: listing.price,
              location: listing.location,
              category: listing?.category?.name ? listing?.category?.name : 'Uncategorized',
              description: listing.description,
              seller: listing.seller ? listing.seller.name : 'Unknown',
              sellerId: listing.seller ? listing.seller._id : null,
              posted,
              image: Array.isArray(listing.images) && listing.images.length > 0
                ? `${API_BASE_URL}/${listing.images[0]}`
                : 'https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg',
            };
          });
          setListings(listingObjs);
        }
      })
      .catch(() => {
        throw new Error('Failed to fetch categories');
      });
  }, []);

  const [newListing, setNewListing] = useState({
  title: '',
  price: '',
  location: '', // Will hold the location id
  locationName: '', // Will hold the location name
  category: '', // Will hold the category id
  description: '',
  seller: '',
  image: null // Will hold the File object
  });

  const filteredListings = listings.filter(listing => {
    // Exclude logged-in user's ads from home page
    // Use seller id for matching
    if (user && (
      (listing.seller && typeof listing.seller === 'object' && listing.seller._id === user._id) ||
      (listing.sellerId && listing.sellerId === user._id)
    )) {
      return false;
    }
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

   useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    /* global google */
    google.accounts.id.initialize({
      client_id: "556452370430-fd5caae668lq9468hbseas0kr3o1a01g.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    if (!storedUser) {
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
          { theme: "outline", size: "large" }
        );
      }
    }
  }, [menuOpen]);
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    setMyAds([]);
    setSelectedMessage(null);
    setFavorites([]);
    window.location.reload();
    // Optionally, redirect to login
  };

  const handleCredentialResponse = (response) => {
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
        window.location.href = "/";
      });
  };

  // Fetch user's ads
  const fetchMyAds = (userId) => {
    fetch(`${API_BASE_URL}/api/ads/listUserAds`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: userId })
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const listingObjs = data.map(listing => {
            let posted = 'Unknown';
            if (listing.createdAt) {
              const created = new Date(listing.createdAt);
              const now = new Date();
              const diffMs = now - created;
              const diffSec = Math.floor(diffMs / 1000);
              const diffMin = Math.floor(diffSec / 60);
              const diffHr = Math.floor(diffMin / 60);
              const diffDay = Math.floor(diffHr / 24);
              if (diffMin < 1) {
                posted = 'moments ago';
              } else if (diffMin < 60) {
                posted = `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
              } else if (diffHr < 24) {
                posted = `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
              } else if (diffDay < 7) {
                posted = `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
              } else {
                posted = created.toLocaleDateString();
              }
            }
            return {
              id: listing._id,
              title: listing.title,
              price: listing.price,
              location: listing.location,
              category: listing?.category?.name ? listing?.category?.name : 'Uncategorized',
              description: listing.description,
              seller: listing.seller ? listing.seller.name : 'Unknown',
              sellerId: listing.seller ? listing.seller._id : null,
              posted,
              image: Array.isArray(listing.images) && listing.images.length > 0
                ? `${API_BASE_URL}/${listing.images[0]}`
                : 'https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg',
            };
          });
          setMyAds(listingObjs);
        }
      })
      .catch(() => {
        setMyAds([]);
      });
  };
  const handlePostAd = () => {
    if (!newListing.title || !newListing.price || !newListing.location || !newListing.description || !newListing.category) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', newListing.title);
    formData.append('price', newListing.price);
    formData.append('location', newListing.locationName);
    formData.append('category', newListing.category);
    formData.append('description', newListing.description);
    if (newListing.image) {
      formData.append('image', newListing.image);
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

  const styles = {
    app: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    headerContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '16px',
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2563eb',
      cursor: 'pointer',
      margin: 0
    },
    nav: {
      display: 'flex',
      gap: '24px',
      alignItems: 'center'
    },
    navButton: {
      background: 'none',
      border: 'none',
      color: '#374151',
      cursor: 'pointer',
      fontSize: '16px',
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    postButton: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      cursor: 'pointer',
      fontSize: '16px'
    },
    menuButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'none'
    },
    mobileMenu: {
      marginTop: '16px',
      paddingBottom: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    mobileMenuItem: {
      width: '100%',
      textAlign: 'left',
      padding: '12px 16px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '8px',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '24px 16px'
    },
    searchBar: {
      backgroundColor: '#ffffff',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    },
    searchInputWrapper: {
      position: 'relative'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '12px',
      color: '#9ca3af'
    },
    searchInput: {
      width: '100%',
      padding: '10px 10px 10px 40px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    categories: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      overflowX: 'auto',
      paddingBottom: '8px'
    },
    categoryButton: {
      padding: '10px 16px',
      borderRadius: '24px',
      border: 'none',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      fontSize: '15px',
      transition: 'all 0.2s'
    },
    categoryButtonActive: {
      backgroundColor: '#2563eb',
      color: '#ffffff'
    },
    categoryButtonInactive: {
      backgroundColor: '#ffffff',
      color: '#374151'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s'
    },
    cardImageWrapper: {
      position: 'relative'
    },
    cardImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    favoriteButton: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      backgroundColor: '#ffffff',
      border: 'none',
      padding: '8px',
      borderRadius: '50%',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    cardContent: {
      padding: '16px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    cardPrice: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '8px'
    },
    cardLocation: {
      display: 'flex',
      alignItems: 'center',
      color: '#6b7280',
      fontSize: '14px',
      marginBottom: '4px',
      gap: '4px'
    },
    cardPosted: {
      color: '#9ca3af',
      fontSize: '12px'
    },
    detailContainer: {
      maxWidth: '1024px',
      margin: '0 auto',
      padding: '24px 16px'
    },
    backButton: {
      background: 'none',
      border: 'none',
      color: '#2563eb',
      cursor: 'pointer',
      fontSize: '16px',
      marginBottom: '16px',
      padding: '8px 0'
    },
    detailCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    detailImage: {
      width: '100%',
      height: '400px',
      objectFit: 'cover'
    },
    detailContent: {
      padding: '24px'
    },
    detailHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    detailTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    detailPrice: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#2563eb'
    },
    detailSection: {
      borderTop: '1px solid #e5e7eb',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 0',
      margin: '16px 0'
    },
    detailLocation: {
      display: 'flex',
      alignItems: 'center',
      color: '#374151',
      marginBottom: '8px',
      gap: '8px'
    },
    descriptionSection: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    sellerCard: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '8px'
    },
    sellerInfo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px'
    },
    sellerAvatar: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '12px'
    },
    sellerName: {
      fontWeight: '600',
      marginBottom: '4px'
    },
    contactButton: {
      width: '100%',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      padding: '12px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600'
    },
    formContainer: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '24px 16px'
    },
    formCard: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '24px'
    },
    formTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '24px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '10px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '10px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '10px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box',
      minHeight: '100px',
      fontFamily: 'inherit',
      resize: 'vertical'
    },
    submitButton: {
      width: '100%',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      padding: '12px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600'
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 0'
    },
    emptyText: {
      color: '#6b7280',
      fontSize: '18px'
    },
    favoriteIcon: {
      width: '20px',
      height: '20px'
    },
    favoriteIconActive: {
      fill: '#ef4444',
      color: '#ef4444'
    },
    favoriteIconInactive: {
      color: '#6b7280'
    }
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.headerTop}>
            <h1 style={styles.logo} onClick={() => setView('home')}>
              e4you.com
            </h1>

            <div style={{display: 'flex', alignItems: 'center', gap: '32px'}}>
              <nav style={{...styles.nav, display: window.innerWidth < 768 ? 'none' : 'flex'}}>
                <button style={styles.navButton} onClick={() => setView('favorites')}>
                  <Heart style={{width: '16px', height: '16px'}} />
                  Favorites ({favorites.length})
                </button>
                <button style={styles.navButton} onClick={() => {
                  if (user && user._id) {
                    fetchMyAds(user._id);
                  }
                  setView('myads');
                }}>
                  My Ads
                </button>
{user ? (
        <div style={{ position: "relative" }}>
          {/* Profile Avatar */}
          <img
            src={user.profilePic}
            alt={user.name}
            style={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer" }}
            onClick={() => setShowDropdown(!showDropdown)}
          />

          {/* Dropdown */}
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
   <div id="googleSignInDiv"></div>  // Google Sign-In button

  )}
              </nav>

              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <button style={styles.postButton} onClick={() =>{
                  if(!user) {
                    alert('Please login to post an ad.');
                  } else {
                    setView('post');
                  }
                }}>
                  <Plus style={{width: '20px', height: '20px'}} />
                  <span style={{display: window.innerWidth < 640 ? 'none' : 'inline'}}>Post Ad</span>
                </button>

                <button 
                  style={{...styles.menuButton, display: window.innerWidth < 768 ? 'block' : 'none'}}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? <X style={{width: '24px', height: '24px'}} /> : <Menu style={{width: '24px', height: '24px'}} />}
                </button>
              </div>
            </div>
          </div>

          {menuOpen && (
            <div style={styles.mobileMenu}>
              <button 
                style={styles.mobileMenuItem}
                onClick={() => { setView('favorites'); setMenuOpen(false); }}
              >
                <Heart style={{width: '16px', height: '16px'}} />
                Favorites ({favorites.length})
              </button>
              <button
                style={styles.mobileMenuItem}
                onClick={() => {
                  if (user && user._id) {
                    fetchMyAds(user._id);
                  }
                  setView('myads');
                  setMenuOpen(false);
                }}
              >
                My Ads
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
                <div style={{padding: '12px 16px', width: '30%'}}>
                  <div id="googleSignInDivMobile"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {view === 'home' && (
        <div style={styles.container}>
          <div style={styles.searchBar}>
            <div style={styles.searchInputWrapper}>
              <Search style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search for products, services and more..."
                style={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.categories}>
              {categories.map((cat, idx) => (
                <button
                  key={cat.id || idx}
                  onClick={() => setSelectedCategory(cat.name)}
                  style={{
                    ...styles.categoryButton,
                    ...(selectedCategory === cat.name ? styles.categoryButtonActive : styles.categoryButtonInactive)
                  }}
                >
                  {cat.name}
                </button>
              ))}
          </div>

          <div style={styles.grid}>
            {filteredListings.map((listing, idx) => (
              <div
                key={listing.id || idx}
                style={styles.card}
                onClick={() => {
                  setSelectedListing(listing);
                  setView('detail');
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
              >
                <div style={styles.cardImageWrapper}>
                  <img
                    src={listing.image}
                    alt={listing.title}
                    style={styles.cardImage}
                      onError={(e) => { e.target.src='https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg'; e.target.alt='Image not found'; }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(listing.id);
                    }}
                    style={styles.favoriteButton}
                  >
                    <Heart
                      style={{
                        ...styles.favoriteIcon,
                        ...(favorites.includes(listing.id) ? styles.favoriteIconActive : styles.favoriteIconInactive)
                      }}
                    />
                  </button>
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{listing.title}</h3>
                  <p style={styles.cardPrice}>₹{listing.price.toLocaleString()}</p>
                  <div style={styles.cardLocation}>
                    <MapPin style={{width: '16px', height: '16px'}} />
                    {listing.location}
                  </div>
                  <p style={styles.cardPosted}>{listing.posted}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No listings found</p>
            </div>
          )}
        </div>
      )}

      {view === 'detail' && selectedListing && (
        <div style={styles.detailContainer}>
          <button style={styles.backButton} onClick={() => setView('home')}>
            ← Back to listings
          </button>
          
          <div style={styles.detailCard}>
            <img
              src={selectedListing.image}
              alt={selectedListing.title}
              style={styles.detailImage}
            />
            
            <div style={styles.detailContent}>
              <div style={styles.detailHeader}>
                <div>
                  <h2 style={styles.detailTitle}>{selectedListing.title}</h2>
                  <p style={styles.detailPrice}>₹{selectedListing.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(selectedListing.id)}
                  style={{...styles.favoriteButton, position: 'relative', top: 0, right: 0}}
                >
                  <Heart
                    style={{
                      width: '24px',
                      height: '24px',
                      ...(favorites.includes(selectedListing.id) ? styles.favoriteIconActive : styles.favoriteIconInactive)
                    }}
                  />
                </button>
              </div>

              <div style={styles.detailSection}>
                <div style={{
                  ...styles.detailLocation,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: 0
                }}>
                  <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <MapPin style={{width: '20px', height: '20px'}} />
                    {selectedListing.location}
                  </span>
                  <span style={{color: '#6b7280', fontSize: '14px'}}>Posted {selectedListing.posted}</span>
                </div>
              </div>

              <div style={styles.descriptionSection}>
                <h3 style={styles.sectionTitle}>Description</h3>
                <p style={{color: '#374151', lineHeight: '1.6'}}>{selectedListing.description}</p>
              </div>

              <div style={styles.sellerCard}>
                <h3 style={styles.sectionTitle}>Seller Information</h3>
                <div style={styles.sellerInfo}>
                  <div style={styles.sellerAvatar}>
                    <User style={{width: '24px', height: '24px'}} />
                  </div>
                  <div>
                    <p style={styles.sellerName}>{typeof selectedListing.seller === 'object' && selectedListing.seller !== null ? selectedListing.seller.name : selectedListing.seller}</p>
                    <p style={{fontSize: '14px', color: '#6b7280'}}>Member since 2023</p>
                  </div>
                </div>
                {myAds.some(ad => ad.id === selectedListing.id || ad._id === selectedListing.id || ad.id === selectedListing._id) ? (
                  <>
                    <button style={styles.contactButton} onClick={handleMessagesClick}>
                      Messages {messagesCollapsed ? '▲' : '▼'}
                    </button>
                    {messagesCollapsed && (
                      <div style={{marginTop: 16, background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 16}}>
                        <h3 style={{marginTop: 0, marginBottom: 16}}>Messages for "{selectedListing?.title}"</h3>
                        {adMessages.length === 0 ? (
                          <div style={{color: '#888'}}>No messages found for this ad.</div>
                        ) : (
                          <ul style={{listStyle: 'none', padding: 0}}>
                            {adMessages.map((msg, idx) => {
                              console.log('Message:', msg);
                              const isFromCurrentUser = (msg.from?._id || msg.from) === (user?._id);
                              let otherName = 'Unknown User';
                              if (isFromCurrentUser) {
                                otherName = msg.to?.name || msg.to || 'Unknown User';
                              } else {
                                otherName = msg.from?.name || msg.from || 'Unknown User';
                              }
                              return (
                                <li
                                  key={idx}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    background: '#f0f9fcff',
                                    borderRadius: '12px',
                                    marginBottom: '12px',
                                    padding: '12px 16px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    border: 'none',
                                    textAlign: 'left'
                                  }}
                                  onClick={() => {
                                    setSelectedMessage(msg);
                                    setChatOpen(false);
                                    setTimeout(() => setChatOpen(true), 0);
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = '#dcf2f9ff'}
                                  onMouseLeave={e => e.currentTarget.style.background = '#f0f9fcff'}
                                >
                                  <div style={{fontWeight: 600, color: '#2563eb', marginBottom: 4}}>{otherName}</div>
                                  <div style={{color: '#374151', fontSize: 15, marginBottom: 4, textAlign: 'left'}}>{msg.text || msg.message}</div>
                                  <div style={{fontSize: 12, color: '#888', textAlign: 'left'}}>{msg.date ? new Date(msg.date).toLocaleString() : ''}</div>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <button style={styles.contactButton} onClick={() => { if (user) { setChatOpen(true) }else { alert('Please login to contact the seller.'); }}}>
                    Contact Seller
                  </button>
                )}
                {chatOpen && (
                  <ChatModal
                    selectedListing={selectedListing}
                    selectedMessage={selectedMessage || { user: user?._id }}
                    user={user}
                    chatMessages={chatMessages}
                    setChatMessages={setChatMessages}
                    chatInput={chatInput}
                    setChatInput={setChatInput}
                    setChatOpen={setChatOpen}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
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
                  onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                  placeholder="e.g., iPhone 13 Pro Max"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category *</label>
                <select
                  style={styles.select}
                  value={newListing.category}
                  onChange={(e) => setNewListing({...newListing, category: e.target.value})}
                >
                   <option key='' value=''>-- Select Category --</option>
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Price (₹) *</label>
                <input
                  type="number"
                  style={styles.input}
                  value={newListing.price}
                  onChange={(e) => setNewListing({...newListing, price: e.target.value})}
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
                <textarea
                  style={styles.textarea}
                  value={newListing.description}
                  onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                  placeholder="Describe your item..."
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Image Upload (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  style={styles.input}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewListing({ ...newListing, image: file });
                    }
                  }}
                />
                {newListing.image && (
                  <img src={URL.createObjectURL(newListing.image)} alt="Preview" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
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
        <div style={styles.container}>
          <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '24px'}}>My Ads</h2>
          {(!myAds || myAds.length === 0) ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No ads posted yet</p>
              <button style={{...styles.backButton, marginTop: '16px'}} onClick={() => setView('home')}>
                Start browsing
              </button>
            </div>
          ) : (
            <>
              {editMode ? (
                <div style={styles.formContainer}>
                  <button style={styles.backButton} onClick={() => { setEditMode(false); setEditAd(null); }}>
                    ← Cancel Edit
                  </button>
                  <div style={styles.formCard}>
                    <h2 style={styles.formTitle}>Edit Your Ad</h2>
                    <div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Title *</label>
                        <input
                          type="text"
                          style={styles.input}
                          value={editAd.title}
                          onChange={e => setEditAd({ ...editAd, title: e.target.value })}
                          placeholder="e.g., iPhone 13 Pro Max"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Category *</label>
                        <select
                          style={styles.select}
                          value={editAd.category}
                          onChange={e => setEditAd({ ...editAd, category: e.target.value })}
                        >
                          {categories.filter(c => c.id !== 'all').map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Price (₹) *</label>
                        <input
                          type="number"
                          style={styles.input}
                          value={editAd.price}
                          onChange={e => setEditAd({ ...editAd, price: e.target.value })}
                          placeholder="15000"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Location *</label>
                        <input
                          type="text"
                          style={styles.input}
                          value={editAd.location}
                          onChange={e => setEditAd({ ...editAd, location: e.target.value })}
                          placeholder="City name"
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Description *</label>
                        <textarea
                          style={styles.textarea}
                          value={editAd.description}
                          onChange={e => setEditAd({ ...editAd, description: e.target.value })}
                          placeholder="Describe your item..."
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Image Upload (optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          style={styles.input}
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              setEditAd({ ...editAd, image: file });
                            }
                          }}
                        />
                        {editAd.image && (
                          typeof editAd.image === 'string'
                            ? <img src={editAd.image} alt="Preview" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
                            : <img src={URL.createObjectURL(editAd.image)} alt="Preview" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
                        )}
                      </div>
                      <button
                        style={styles.submitButton}
                        onClick={e => {
                          e.preventDefault();
                          handleEditAd();
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={styles.grid}>
                  {myAds.map((listing, idx) => (
                    <div
                      key={listing.id || idx}
                      style={{ ...styles.card, position: 'relative' }}
                      onClick={() => {
                        setSelectedListing(listing);
                        setView('detail');
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                    >
                      <div style={styles.cardImageWrapper}>
                        <img
                          src={listing.image}
                          alt={listing.title}
                          style={styles.cardImage}
                          onError={(e) => { e.target.src='https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg'; e.target.alt='Image not found'; }}
                        />
                      </div>
                      <button
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          background: '#fff',
                          border: 'none',
                          padding: '6px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          zIndex: 2
                        }}
                        title="Edit Ad"
                        onClick={e => {
                          e.stopPropagation();
                          setEditMode(true);
                          // Always set category to id for edit form
                          let catId = listing.category;
                          if (categories && categories.length) {
                            const found = categories.find(cat => cat.name === listing.category);
                            if (found && found.id) catId = found.id;
                          }
                          setEditAd({ ...listing, category: catId });
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                      </button>
                      <div style={styles.cardContent}>
                        <h3 style={styles.cardTitle}>{listing.title}</h3>
                        <p style={styles.cardPrice}>₹{listing.price.toLocaleString()}</p>
                        <div style={styles.cardLocation}>
                          <MapPin style={{width: '16px', height: '16px'}} />
                          {listing.location}
                        </div>
                        <p style={styles.cardPosted}>{listing.posted}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
      {view === 'favorites' && (
        <div style={styles.container}>
          <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '24px'}}>My Favorites</h2>
          {favorites.length === 0 ? (
            <div style={styles.emptyState}>
              <Heart style={{width: '64px', height: '64px', color: '#d1d5db', margin: '0 auto 16px'}} />
              <p style={styles.emptyText}>No favorites yet</p>
              <button style={{...styles.backButton, marginTop: '16px'}} onClick={() => setView('home')}>
                Start browsing
              </button>
            </div>
          ) : (
            <div style={styles.grid}>
              {listings
                .filter(listing => favorites.includes(listing.id))
                .map((listing, idx) => (
                  <div
                    key={listing.id || idx}
                    style={styles.card}
                    onClick={() => {
                      setSelectedListing(listing);
                      setView('detail');
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                  >
                    <div style={styles.cardImageWrapper}>
                      <img
                        src={listing.image}
                        alt={listing.title}
                        style={styles.cardImage}
                        onError={(e) => { e.target.src='https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg'; e.target.alt='Image not found'; }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(listing.id);
                        }}
                        style={styles.favoriteButton}
                      >
                        <Heart style={{...styles.favoriteIcon, ...styles.favoriteIconActive}} />
                      </button>
                    </div>
                    <div style={styles.cardContent}>
                      <h3 style={styles.cardTitle}>{listing.title}</h3>
                      <p style={styles.cardPrice}>₹{listing.price.toLocaleString()}</p>
                      <div style={styles.cardLocation}>
                        <MapPin style={{width: '16px', height: '16px'}} />
                        {listing.location}
                      </div>
                      <p style={styles.cardPosted}>{listing.posted}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
      {/* Add missing closing div for main app container */}
    </div>
  );
};

export default Landing