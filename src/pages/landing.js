/* global google */
import React, { useState, useEffect } from 'react';
import MessagesPage from './MessagesPage';
import Chat from './chat';
import { Search, Plus, MapPin, Heart, Menu, X, Eye } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

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
        width: 60,
        height: 60,
        border: '6px solid #c1f7d3',
        borderTop: '6px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
    </div>
  );
}

const Landing = () => {
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
      fetch(`${API_BASE_URL}/api/ads/chat?adId=${selectedListing.id || selectedListing._id}&userId=${user._id}`, {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState(['All']);
  const [lastListView, setLastListView] = useState('home');

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
            name: cat.name,
            subCategories: cat.subCategory || []
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
              images: Array.isArray(listing.images) && listing.images.length > 0
                ? listing.images.map(img => `${API_BASE_URL}/${img}`)
                : ['https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg'],
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
    subCategory: '', // Will hold the subcategory id
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


const [subCategories, setSubCategories] = useState([]);
const [selectedSubCategory, setSelectedSubCategory] = useState('');

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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
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
            { theme: "outline", size: "large" }
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
        window.location.reload();
      })
      .catch(() => {
        setLoading(false);
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
    if (newListing.description.length < 150) {
      alert('Description must be at least 150 characters long.');
      return;
    }

    const formData = new FormData();
    formData.append('title', newListing.title);
    formData.append('price', newListing.price);
    formData.append('location', newListing.locationName);
    formData.append('category', newListing.category);
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
    subCategoryButton: {
      padding: '8px 18px',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '15px',
      transition: 'all 0.2s'
    },
    subCategoryButtonActive: {
      background: 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)',
      color: '#2563eb'
    },
    subCategoryButtonInactive: {
      background: 'linear-gradient(90deg, #f7f7f7 0%, #e0eafc 100%)',
      color: '#333'
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
      textAlign: 'left',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    cardCategory: {
      color: '#2563eb',
      fontWeight: 500,
      fontSize: 14,
      margin: '4px 0',
      textAlign: 'left'
    },
    cardPrice: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '15px'
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <nav style={{ ...styles.nav, display: window.innerWidth < 768 ? 'none' : 'flex' }}>
                <button style={styles.navButton} onClick={() => setView('favorites')}>
                  <Heart style={{ width: '16px', height: '16px' }} />
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
                  if (user && user._id) {
                    fetchMyAds(user._id);
                  }
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
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSubCategories(cat['subCategories'] || []);
                  setSelectedSubCategory('');
                }}
                style={{
                  ...styles.categoryButton,
                  ...(selectedCategory === cat.name ? styles.categoryButtonActive : styles.categoryButtonInactive)
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Render subcategory bar below category bar */}
          {selectedCategory && subCategories && subCategories.length > 0 && (
  <div style={subCategoryBarStyle}>
    {subCategories.map((sub, idx) => (
      <button
        key={sub}
        onClick={() => setSelectedSubCategory(sub)}
        style={selectedSubCategory === sub ? responsiveSubCategoryButtonActive : responsiveSubCategoryButton}
      >
        {sub}
      </button>
    ))}
  </div>
)}

          <div style={styles.grid}>
            {filteredListings.map((listing, idx) => (
              <div
                key={listing.id || idx}
                style={styles.card}
                onClick={() => {
                  setLastListView('home');
                  setSelectedListing(listing);
                  setView('detail');
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
              >
                <div style={styles.cardImageWrapper}>
                  <img
                    src={Array.isArray(listing.images) ? listing.images[0] : listing.image}
                    alt={listing.title}
                    style={styles.cardImage}
                    onError={(e) => { e.target.src = 'https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg'; e.target.alt = 'Image not found'; }}
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
                  <p style={{ margin: '4px 0', textAlign: 'left' }}>
                    <span style={responsiveTagStyle}>{listing.category}</span>
                  </p>
                  <p style={styles.cardPrice}>₹{listing.price.toLocaleString()}</p>
                  <div style={styles.cardLocation}>
                    <MapPin style={{ width: '16px', height: '16px' }} />
                    {listing.location}
                                            <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', color: '#6b7280', fontSize: 14 }}>
                          <Eye style={{ width: 16, height: 20, marginRight: 4 }} />
                          {typeof listing.views === 'number' ? listing.views : 0}
                        </span>
                  </div>
                      <p style={styles.cardPosted}>
                        {listing.posted}

                      </p>
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
          <button style={styles.backButton} onClick={() => setView(lastListView)}>
            ← Back to listings
          </button>

          <div style={styles.detailCard}>
            {/* Image carousel logic (hooks at top level) */}
            {(() => {
              const images = Array.isArray(selectedListing.images) && selectedListing.images.length > 0
                ? selectedListing.images
                : selectedListing.image
                  ? [selectedListing.image]
                  : [];
              const fallback = 'https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg';
              return (
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  {images.length > 1 && (
                    <button
                      style={{
                        position: 'absolute',
                        left: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        fontSize: 28,
                        cursor: 'pointer',
                        zIndex: 2,
                        boxShadow: '0 2px 8px rgba(37,99,235,0.18)'
                      }}
                      onClick={() => setCurrentImageIdx(idx => (idx === 0 ? images.length - 1 : idx - 1))}
                      aria-label="Previous image"
                    >&#8592;</button>
                  )}
                  <img
                    src={images.length > 0 ? images[currentImageIdx] : fallback}
                    alt={selectedListing.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      objectFit: 'contain',
                      display: 'block',
                      margin: '32px auto',
                      background: '#f7f7f7',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                    onError={e => { e.target.src = fallback; e.target.alt = 'Image not found'; }}
                  />
                  {images.length > 1 && (
                    <button
                      style={{
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        fontSize: 28,
                        cursor: 'pointer',
                        zIndex: 2,
                        boxShadow: '0 2px 8px rgba(37,99,235,0.18)'
                      }}
                      onClick={() => setCurrentImageIdx(idx => (idx === images.length - 1 ? 0 : idx + 1))}
                      aria-label="Next image"
                    >&#8594;</button>
                  )}
                  {/* Image index indicator */}
                  {images.length > 1 && (
                    <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: '#2563eb', borderRadius: 12, padding: '4px 16px', fontSize: 16, color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
                      {currentImageIdx + 1} / {images.length}
                    </div>
                  )}
                </div>
              );
            })()}

            <div style={styles.detailContent}>
              <div style={styles.detailHeader}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                  <h2 style={{ ...styles.detailTitle, marginBottom: 0, textAlign: 'left' }}>{selectedListing.title}</h2>
                  <p style={{ ...styles.detailPrice, marginTop: 4, marginBottom: 0, textAlign: 'left' }}>
                    ₹{selectedListing.price.toLocaleString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={myAds.some(ad => ad.id === selectedListing.id || ad._id === selectedListing.id || ad.id === selectedListing._id) ? undefined : () => toggleFavorite(selectedListing.id)}
                    style={{
                      ...styles.favoriteButton,
                      position: 'relative',
                      top: 0,
                      right: 0,
                      opacity: myAds.some(ad => ad.id === selectedListing.id || ad._id === selectedListing.id || ad.id === selectedListing._id) ? 0.5 : 1,
                      cursor: myAds.some(ad => ad.id === selectedListing.id || ad._id === selectedListing.id || ad.id === selectedListing._id) ? 'not-allowed' : 'pointer',
                    }}
                    disabled={myAds.some(ad => ad.id === selectedListing.id || ad._id === selectedListing.id || ad.id === selectedListing._id)}
                  >
                    <Heart
                      style={{
                        width: '24px',
                        height: '24px',
                        ...(favorites.includes(selectedListing.id) ? styles.favoriteIconActive : styles.favoriteIconInactive),
                        opacity: myAds.some(ad => ad.id === selectedListing.id || ad._id === selectedListing.id || ad.id === selectedListing._id) ? 0.5 : 1,
                      }}
                    />
                  </button>
                  <button
                    onClick={myAds.some(ad => ad.id === selectedListing.id || ad._id === selectedListing.id || ad.id === selectedListing._id) ? undefined : () => {
                      if (user) { setChatOpen(true); } else { alert('Please login to contact the seller.'); }
                    }}
                    style={{
                      ...styles.favoriteButton,
                      position: 'relative',
                      top: 0,
                      right: 0,
                      opacity: myAds.some(ad => ad.id === selectedListing.id || ad._id === selectedListing.id || ad.id === selectedListing._id) ? 0.5 : 1,
                      cursor: myAds.some(ad => ad.id === selectedListing.id || ad._id === selectedListing.id || ad.id === selectedListing._id) ? 'not-allowed' : 'pointer',
                    }}
                    disabled={myAds.some(ad => ad.id === selectedListing.id || ad._id === selectedListing.id || ad.id === selectedListing._id)}
                    title="Messages"
                  >
                    <div style={{ position: 'relative', display: 'inline-block', opacity: myAds.some(ad => ad.id === selectedListing.id || ad._id === selectedListing.id || ad.id === selectedListing._id) ? 0.5 : 1 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#909090ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                      {messageCount > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          background: '#2563eb',
                          color: '#fff',
                          borderRadius: '50%',
                          padding: '2px 6px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          minWidth: '8px',
                          textAlign: 'center',
                          zIndex: 2,
                          opacity: myAds.some(ad => ad.id === selectedListing.id || ad._id === selectedListing.id || ad.id === selectedListing._id) ? 0.5 : 1,
                        }}>{messageCount}</span>
                      )}
                    </div>
                  </button>
                </div>
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
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin style={{ width: '20px', height: '20px' }} />
                    {selectedListing.location}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '14px', display: 'inline-flex', alignItems: 'center' }}>
                    Posted {selectedListing.posted}
                    <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center' }}>
                      <Eye style={{ width: 16, height: 16, marginRight: 4 }} />
                      {typeof selectedListing.views === 'number' ? selectedListing.views : 0}
                    </span>
                  </span>
                </div>
              </div>

              <div style={styles.descriptionSection}>
                <h3 style={styles.sectionTitle}>Description</h3>
                <p style={{ color: '#374151', lineHeight: '1.6', textAlign: 'justify' }}>{selectedListing.description}</p>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />

              <div style={{ margin: '32px 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Seller Information</h3>
                <div style={{ fontWeight: 600, fontSize: '1.08rem', color: '#111', marginBottom: '6px' }}>
                  {typeof selectedListing.seller === 'object' && selectedListing.seller !== null ? selectedListing.seller.name : selectedListing.seller}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '0' }}>Member since 2023</div>
                {myAds.some(ad => ad.id === selectedListing.id || ad._id === selectedListing.id || ad.id === selectedListing._id) ? (
                  <></>
                ) : (
                  <button style={styles.contactButton} onClick={() => { if (user) { setChatOpen(true) } else { alert('Please login to contact the seller.'); } }}>
                    Contact Seller
                  </button>
                )}
                {chatOpen && (
                  <Chat
                    selectedListing={selectedListing}
                    selectedMessage={selectedMessage || { user: user?._id }}
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
              {newListing.category &&
  (() => {
    const selectedCat = categories.find(c => c.id === newListing.category);
    if (selectedCat && Array.isArray(selectedCat.subCategory) && selectedCat.subCategory.length > 0) {
      return (
        <div style={styles.formGroup}>
          <label style={styles.label}>Subcategory</label>
          <select
            style={styles.select}
            value={newListing.subCategory || ''}
            onChange={e => setNewListing({ ...newListing, subCategory: e.target.value })}
          >
            <option key='' value=''>-- Select Subcategory --</option>
            {selectedCat.subCategory.map(sub => (
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
                <textarea
                  style={styles.textarea}
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  placeholder="Describe your item..."
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
        <div style={styles.container}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>My Ads</h2>
          {(!myAds || myAds.length === 0) ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No ads posted yet</p>
              <button style={{ ...styles.backButton, marginTop: '16px' }} onClick={() => setView('home')}>
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
                          onChange={e => {
                            setEditAd({ ...editAd, category: e.target.value, subCategory: '' });
                          }}
                        >
                          {categories.filter(c => c.id !== 'all').map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      {editAd.category &&
  (() => {
    const selectedCat = categories.find(c => c.id === editAd.category);
    if (selectedCat && Array.isArray(selectedCat.subCategory) && selectedCat.subCategory.length > 0) {
      return (
        <div style={styles.formGroup}>
          <label style={styles.label}>Subcategory</label>
          <select
            style={styles.select}
            value={editAd.subCategory || ''}
            onChange={e => setEditAd({ ...editAd, subCategory: e.target.value })}
          >
            <option key='' value=''>-- Select Subcategory --</option>
            {selectedCat.subCategory.map(sub => (
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
                          multiple
                          style={styles.input}
                          onChange={e => {
                            const files = Array.from(e.target.files);
                            if (files.length > 0) {
                              setEditAd({ ...editAd, image: files });
                            }
                          }}
                        />
                        {Array.isArray(editAd.image) && editAd.image.length > 0 && (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                            {editAd.image.map((file, idx) => (
                              <img key={idx} src={typeof file === 'string' ? file : URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} style={{ maxWidth: 100, maxHeight: 100, borderRadius: 8 }} />
                            ))}
                          </div>
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
                        setLastListView('myads');
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
                          onError={(e) => { e.target.src = 'https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg'; e.target.alt = 'Image not found'; }}
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
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0     1 3 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                      </button>
                      <div style={styles.cardContent}>
                        <h3 style={styles.cardTitle}>{listing.title}</h3>
                        <p style={{ margin: '4px 0', textAlign: 'left' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 10px',
                            borderRadius: '12px',
                            fontSize: 13,
                            fontWeight: 600,
                            background: getCategoryGradient(listing.category),
                            color: '#333',
                            letterSpacing: 0.5,
                            minWidth: 60,
                            textAlign: 'center',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.07)'
                          }}>{listing.category}</span>
                        </p>
                        <p style={styles.cardPrice}>₹{listing.price.toLocaleString()}</p>
                        <div style={styles.cardLocation}>
                          <MapPin style={{ width: '16px', height: '16px' }} />
                          {listing.location}
                        </div>
                        <p style={styles.cardPosted}>
                          {listing.posted}
                          <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', color: '#6b7280', fontSize: 14 }}>
                            <Eye style={{ width: 16, height: 16, marginRight: 4 }} />
                            {typeof listing.views === 'number' ? listing.views : 0}
                          </span>
                        </p>
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
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>My Favorites</h2>
          {favorites.length === 0 ? (
            <div style={styles.emptyState}>
              <Heart style={{ width: '64px', height: '64px', color: '#d1d5db', margin: '0 auto 16px' }} />
              <p style={styles.emptyText}>No favorites yet</p>
              <button style={{ ...styles.backButton, marginTop: '16px' }} onClick={() => setView('home')}>
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
                      setLastListView('favorites');
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
                        onError={(e) => { e.target.src = 'https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg'; e.target.alt = 'Image not found'; }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(listing.id);
                        }}
                        style={styles.favoriteButton}
                      >
                        <Heart style={{ ...styles.favoriteIcon, ...styles.favoriteIconActive }} />
                      </button>
                    </div>
                    <div style={styles.cardContent}>
                      <h3 style={styles.cardTitle}>{listing.title}</h3>
                      <p style={{ margin: '4px 0', textAlign: 'left' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: '12px',
                          fontSize: 13,
                          fontWeight: 600,
                          background: getCategoryGradient(listing.category),
                          color: '#333',
                          letterSpacing: 0.5,
                          minWidth: 60,
                          textAlign: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.07)'
                        }}>{listing.category}</span>
                      </p>
                      <p style={styles.cardPrice}>₹{listing.price.toLocaleString()}</p>
                      <div style={styles.cardLocation}>
                        <MapPin style={{ width: '16px', height: '16px' }} />
                        {listing.location}
                      </div>
                        <p style={styles.cardPosted}>
                          {listing.posted}
                          <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', color: '#6b7280', fontSize: 14 }}>
                            <Eye style={{ width: 16, height: 16, marginRight: 4 }} />
                            {typeof listing.views === 'number' ? listing.views : 0}
                          </span>
                        </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
      {/* Add missing closing div for main app container */}
      {view === 'messages' && (
        <MessagesPage />
      )}
      {loading && <LoaderOverlay />}
      </div>
  );
};

// Helper function for unique pastel gradient backgrounds
function getCategoryGradient(category) {
  const gradients = {
    Electronics: 'linear-gradient(90deg, #a4d3f9ff 0%, #f7f7f7 100%)', // pastel pink
    Furniture: 'linear-gradient(90deg, #c1f7d3 0%, #f7f7f7 100%)',   // pastel green
    Vehicles: 'linear-gradient(90deg, #ffe5b4 0%, #f7f7f7 100%)',    // pastel orange
    RealEstate: 'linear-gradient(90deg, #4af2b5ff 0%, #f3acacff 100%)',  // pastel teal
    Services: 'linear-gradient(90deg, #d0bdf4 0%, #f7f7f7 100%)',    // pastel purple
    Games: 'linear-gradient(90deg, #fac3ecff 0%, #f7f7f7 100%)',        // pastel magenta
    Uncategorized: 'linear-gradient(90deg, #f7cac9 0%, #f7f7f7 100%)'// pastel rose
  };
  return gradients[category] || 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)';
}

export default Landing