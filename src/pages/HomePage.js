import React from 'react';
import { Activity } from 'lucide-react';
import AdCard from '../components/AdCard';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const {
    categories, selectedCategory, setSelectedCategory,
    subCategories, setSubCategories,
    selectedSubCategory, setSelectedSubCategory,
    selectedCategoryId, setSelectedCategoryId,
    listings, loading, hasMore, page, setPage, searchQuery,
    fetchListings, navigate,
  } = useApp();

  const handleCategoryClick = (cat) => {
    if (cat === 'All') {
      setSelectedCategory('All');
      setSelectedCategoryId('');
      setSubCategories([]);
      setSelectedSubCategory('');
    } else {
      const catObj = categories.find(c => c.name === cat);
      setSelectedCategory(cat);
      setSelectedCategoryId(catObj?.id || '');
      setSubCategories(catObj?.subCategories || []);
      setSelectedSubCategory('');
    }
    setPage(1);
  };

  const handleSubCategoryClick = (sub) => {
    setSelectedSubCategory(prev => prev === sub ? '' : sub);
    setPage(1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const next = page + 1;
      setPage(next);
      fetchListings(next, false);
    }
  };

  const allCats = ['All', ...categories.map(c => c.name)];

  return (
    <div>
      <div className="filter-bar">
        <div className="pills-row">
          {allCats.map(cat => (
            <button
              key={cat}
              className={`pill${selectedCategory === cat ? ' active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        {subCategories.length > 0 && (
          <div className="sub-pills-row">
            {subCategories.map(sub => {
              const name = typeof sub === 'string' ? sub : sub.name;
              return (
                <button
                  key={name}
                  className={`pill sub${selectedSubCategory === name ? ' active' : ''}`}
                  onClick={() => handleSubCategoryClick(name)}
                >
                  {name}
                </button>
              );
            })}
          </div>
        )}
        {searchQuery && (
          <div className="results-label">Results for "{searchQuery}"</div>
        )}
      </div>

      <div className="ads-grid">
        {loading && listings.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="spinner" />
            <span className="empty-sub">Loading ads...</span>
          </div>
        ) : listings.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <Activity size={48} style={{ color: 'var(--border)' }} />
            <span className="empty-title">No ads found</span>
            <span className="empty-sub">Try a different search or category</span>
          </div>
        ) : (
          listings.map(listing => (
            <AdCard
              key={listing.id}
              listing={listing}
              onClick={(l) => navigate('detail', { listing: l })}
            />
          ))
        )}
      </div>

      {hasMore && listings.length > 0 && (
        <div className="load-more-wrap">
          <button className="load-more-btn" onClick={loadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
