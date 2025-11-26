import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Heart, Eye,Sparkles } from 'lucide-react';
import CardSkeleton from '../components/CardSkeleton';
import AiISearchButton from '../components/AISearchButton';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
const tempImageUrls = [
  'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&h=300&fit=crop'
];

const AllAds = ({ styles, setLastListView, setSelectedListing, setView, favorites, toggleFavorite, responsiveTagStyle, subCategoryBarStyle, responsiveSubCategoryButton, responsiveSubCategoryButtonActive ,isMobile}) => {
  const [categories, setCategories] = useState([{ id: 'all', name: 'All' }]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSearch, setAiSearch] = useState(false);

  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  useEffect(() => {
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
      });
  }, []);

  // Fetch listings from API when page, search, category, or subcategory changes
  useEffect(() => {
    const limit = 4;
    setLoading(true);
    let user = localStorage.getItem('user');
    let User = user ? JSON.parse(user) : {};
    console.log(User)
    fetch(`${API_BASE_URL}/api/ads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      body: JSON.stringify({
        page,
        limit,
        search: searchQuery || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        subCategory: selectedSubCategory || undefined,
        userId:User._id || undefined
      })
    })
      .then(res => res.json())
      .then(result => {
        let data = result?.ads || [];
        if (Array.isArray(data)) {
          setHasMore(data.length > 0);
          const listingObjs = data.map(listing => {
            let posted = 'Unknown';
            if (listing.createdAt) {
              const created = new Date(listing.createdAt);
              const now = new Date();
              const diffMs = now - created;
              const diffMin = Math.floor(diffMs / 1000 / 60);
              const diffHr = Math.floor(diffMin / 60);
              const diffDay = Math.floor(diffHr / 24);
              if (diffMin < 1) posted = 'moments ago';
              else if (diffMin < 60) posted = `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
              else if (diffHr < 24) posted = `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
              else if (diffDay < 7) posted = `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
              else posted = created.toLocaleDateString();
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
              views: listing.views || 0,
              subCategory: listing?.subCategory?.name ? listing?.subCategory?.name : 'General',
              posted,
              images: Array.isArray(listing.images) && listing.images.length > 0
                ? listing.images.map(img => `${API_BASE_URL}/${img}`)
                : ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&h=300&fit=crop'],
            };
          });
          if (page === 1) {
            setListings(listingObjs);
          } else {
            setListings((prev) => [...prev, ...listingObjs]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [page, searchQuery, selectedCategory, selectedSubCategory]);

  // Reset page and listings when filters/search change
  useEffect(() => {
    setPage(1);
    setListings([]);
  }, [searchQuery, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    // Disable infinite scroll when searching
    if (searchQuery) return;
    if (listings.length === 0) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, loading, listings.length, searchQuery]);

  return (
    <div style={styles.container}>
    <div style={styles.searchBar}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ ...styles.searchInputWrapper, flex: 1, minWidth: 0 }}>
          <Search style={styles.searchIcon} />
          <input
            type="text"
            placeholder={aiSearch ? "Ask AI about products, services and more… e.g., ‘Smartphone under 12,000 in Trivandrum’" : "Search for products, services and more..."}
            style={{ ...styles.searchInput, width: '100%', minWidth: 0, flex: 1 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Toggle switch for AI search */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginLeft: 8,
          userSelect: 'none',
          cursor: 'pointer',
        }}>
          <img src="https://img.icons8.com/fluency/48/bard.png" alt="bard ai icon" width="25" height="25" style={{ verticalAlign: 'middle'}} />
          <span style={{
            display: 'inline-block',
            width: 38,
            height: 22,
            background: aiSearch ? 'linear-gradient(to right, #9333ea, #2563eb)' : '#e5e7eb',
            borderRadius: 12,
            position: 'relative',
            transition: 'background 0.2s',
            verticalAlign: 'middle',
          }}>
            <input
              type="checkbox"
              checked={aiSearch}
              onChange={() => setAiSearch(v => !v)}
              style={{
                opacity: 0,
                width: 0,
                height: 0,
                position: 'absolute',
              }}
              aria-checked={aiSearch}
            />
            <span style={{
              position: 'absolute',
              left: aiSearch ? 18 : 2,
              top: 2,
              width: 18,
              height: 18,
              background: '#fff',
              borderRadius: '50%',
              boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
              transition: 'left 0.2s',
              border: '1px solid #d1d5db',
            }} />
          </span>
          <span style={{ fontSize: 13, color: aiSearch ? '#2563eb' : '#888', fontWeight: 500, marginLeft: 4 }}>{aiSearch ? 'On' : 'Off'}</span>
        </label>
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
            onClick={() => {
              setSelectedSubCategory(sub);
            }}
            style={selectedSubCategory === sub ? responsiveSubCategoryButtonActive : responsiveSubCategoryButton}
          >
            {sub}
          </button>
        ))}
      </div>
    )}
    <div style={styles.grid}>
      {listings.map((listing, idx) => (
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
              onError={(e) => {
                const randomIdx = Math.floor(Math.random() * tempImageUrls.length);
                e.target.src = tempImageUrls[randomIdx];
                e.target.alt = 'Image not found';
              }}
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
            <p style={styles.cardPosted}>{listing.posted}</p>
          </div>
        </div>
      ))}
      {/* Observer target for infinite scroll */}
      <div ref={observerTarget} style={{ height: 1 }} />
    </div>
    {listings.length === 0 && !loading ? (
      <div style={styles.emptyState}>
        <p style={styles.emptyText}>No listings found</p>
      </div>
    ) : null}
    {loading && (
      <div style={styles.loadingState}><CardSkeleton isMobile={isMobile}/></div>
    )}
    <AiISearchButton isMobile={isMobile}/>
  </div>
  );
};

export default AllAds;
