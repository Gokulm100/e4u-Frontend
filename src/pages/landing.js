import React, { useState } from 'react';
import { Search, Plus, MapPin, Heart, User, Menu, X } from 'lucide-react';

const Landing = () => {
  const [listings, setListings] = useState([
    {
      id: 1,
      title: 'iPhone 13 Pro Max',
      price: 45000,
      location: 'Mumbai, Maharashtra',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&h=300&fit=crop',
      description: 'Excellent condition, 256GB, with box and accessories',
      seller: 'John Doe',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Royal Enfield Classic 350',
      price: 125000,
      location: 'Delhi, NCR',
      category: 'Vehicles',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop',
      description: '2020 model, single owner, well maintained',
      seller: 'Rajesh Kumar',
      posted: '1 day ago'
    },
    {
      id: 3,
      title: '2BHK Apartment for Rent',
      price: 18000,
      location: 'Bangalore, Karnataka',
      category: 'Real Estate',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      description: 'Spacious apartment with parking, near metro',
      seller: 'Priya Sharma',
      posted: '3 hours ago'
    },
    {
      id: 4,
      title: 'Gaming Laptop HP Omen',
      price: 75000,
      location: 'Pune, Maharashtra',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop',
      description: 'RTX 3060, 16GB RAM, 512GB SSD',
      seller: 'Amit Patel',
      posted: '1 week ago'
    },
    {
      id: 5,
      title: 'Sofa Set 5 Seater',
      price: 22000,
      location: 'Chennai, Tamil Nadu',
      category: 'Furniture',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
      description: 'L-shaped sofa, leather finish, like new',
      seller: 'Lakshmi Iyer',
      posted: '4 days ago'
    },
    {
      id: 6,
      title: 'Mountain Bike Firefox',
      price: 12000,
      location: 'Hyderabad, Telangana',
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop',
      description: '21 speed gears, barely used',
      seller: 'Vikram Reddy',
      posted: '5 days ago'
    }
  ]);

  const [view, setView] = useState('home');
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const categories = ['All', 'Electronics', 'Vehicles', 'Real Estate', 'Furniture', 'Sports'];

  const [newListing, setNewListing] = useState({
    title: '',
    price: '',
    location: '',
    category: 'Electronics',
    description: '',
    seller: '',
    image: ''
  });

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePostAd = () => {
    if (!newListing.title || !newListing.price || !newListing.location || !newListing.description || !newListing.seller) {
      alert('Please fill in all required fields');
      return;
    }

    const newAd = {
      id: listings.length + 1,
      ...newListing,
      price: parseInt(newListing.price),
      posted: 'Just now',
      image: newListing.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    };
    setListings([newAd, ...listings]);
    setNewListing({
      title: '',
      price: '',
      location: '',
      category: 'Electronics',
      description: '',
      seller: '',
      image: ''
    });
    setView('home');
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
              MarketPlace
            </h1>

            <div style={{display: 'flex', alignItems: 'center', gap: '32px'}}>
              <nav style={{...styles.nav, display: window.innerWidth < 768 ? 'none' : 'flex'}}>
                <button style={styles.navButton} onClick={() => setView('home')}>
                  Browse
                </button>
                <button style={styles.navButton} onClick={() => setView('favorites')}>
                  <Heart style={{width: '16px', height: '16px'}} />
                  Favorites ({favorites.length})
                </button>
              </nav>

              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <button style={styles.postButton} onClick={() => setView('post')}>
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
                onClick={() => { setView('home'); setMenuOpen(false); }}
              >
                Browse
              </button>
              <button 
                style={styles.mobileMenuItem}
                onClick={() => { setView('favorites'); setMenuOpen(false); }}
              >
                <Heart style={{width: '16px', height: '16px'}} />
                Favorites ({favorites.length})
              </button>
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
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  ...styles.categoryButton,
                  ...(selectedCategory === cat ? styles.categoryButtonActive : styles.categoryButtonInactive)
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={styles.grid}>
            {filteredListings.map(listing => (
              <div
                key={listing.id}
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
                <div style={styles.detailLocation}>
                  <MapPin style={{width: '20px', height: '20px'}} />
                  {selectedListing.location}
                </div>
                <p style={{color: '#6b7280'}}>Posted {selectedListing.posted}</p>
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
                    <p style={styles.sellerName}>{selectedListing.seller}</p>
                    <p style={{fontSize: '14px', color: '#6b7280'}}>Member since 2023</p>
                  </div>
                </div>
                <button style={styles.contactButton}>
                  Contact Seller
                </button>
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
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
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
                <input
                  type="text"
                  style={styles.input}
                  value={newListing.location}
                  onChange={(e) => setNewListing({...newListing, location: e.target.value})}
                  placeholder="e.g., Mumbai, Maharashtra"
                />
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
                <label style={styles.label}>Your Name *</label>
                <input
                  type="text"
                  style={styles.input}
                  value={newListing.seller}
                  onChange={(e) => setNewListing({...newListing, seller: e.target.value})}
                  placeholder="Your name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Image URL (optional)</label>
                <input
                  type="url"
                  style={styles.input}
                  value={newListing.image}
                  onChange={(e) => setNewListing({...newListing, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <button onClick={handlePostAd} style={styles.submitButton}>
                Post Ad
              </button>
            </div>
          </div>
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
                .map(listing => (
                  <div
                    key={listing.id}
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
    </div>
  );
};

export default Landing