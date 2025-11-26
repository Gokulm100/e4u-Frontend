import React, { useState } from 'react';
import { Sparkles, X, Search, Loader2 } from 'lucide-react';

export default function AISearchButton({ isMobile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate AI search with mock data
    setTimeout(() => {
      setResults([
        {
          id: 1,
          title: 'iPhone 13 Pro - Excellent Condition',
          price: '$699',
          location: 'New York',
          image: '📱',
          relevance: '95%'
        },
        {
          id: 2,
          title: 'Samsung Galaxy S21 Ultra',
          price: '$599',
          location: 'Los Angeles',
          image: '📱',
          relevance: '88%'
        },
        {
          id: 3,
          title: 'Google Pixel 7 Pro',
          price: '$549',
          location: 'Chicago',
          image: '📱',
          relevance: '82%'
        }
      ]);
      setIsSearching(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: isMobile ? '100px' : '30px',
          right: '30px',
          width: '50px',
          height: '50px',
          background: 'linear-gradient(to right, #9333ea, #2563eb)',
          borderRadius: '50%',
          border: 'none',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 50
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        }}
        aria-label="AI Search"
      >
        {isOpen ? (
          <X style={{ width: '24px', height: '24px', color: 'white' }} />
        ) : (
          <Sparkles style={{ width: '24px', height: '24px', color: 'white' }} />
        )}
      </button>

      {/* Search Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '384px',
            maxWidth: 'calc(100vw - 48px)',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            zIndex: 40,
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(to right, #9333ea, #2563eb)',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles style={{ width: '20px', height: '20px', color: 'white' }} />
              <h3 style={{ color: 'white', fontWeight: '600', fontSize: '18px', margin: 0 }}>
                AI Smart Search
              </h3>
            </div>
            <p style={{ color: '#e9d5ff', fontSize: '14px', margin: '4px 0 0 0' }}>
              Describe what you're looking for naturally
            </p>
          </div>

          {/* Search Input */}
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="E.g., 'iPhone under $700 in good condition'"
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#9333ea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#9333ea',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isSearching ? 'not-allowed' : 'pointer',
                  opacity: isSearching ? 0.5 : 1,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isSearching) e.currentTarget.style.backgroundColor = '#7e22ce';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#9333ea';
                }}
              >
                {isSearching ? (
                  <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Search style={{ width: '20px', height: '20px' }} />
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div style={{ maxHeight: '384px', overflowY: 'auto' }}>
            {results.length === 0 && !isSearching && (
              <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                <Sparkles style={{ width: '48px', height: '48px', margin: '0 auto 12px', color: '#9ca3af' }} />
                <p style={{ fontSize: '14px', margin: '0 0 8px 0' }}>Try searching with natural language</p>
                <p style={{ fontSize: '12px', margin: 0, color: '#9ca3af' }}>
                  "Latest smartphone under $500" or "Gaming laptop near me"
                </p>
              </div>
            )}

            {isSearching && (
              <div style={{ padding: '32px', textAlign: 'center' }}>
                <Loader2 style={{ width: '32px', height: '32px', margin: '0 auto 12px', color: '#9333ea', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Searching with AI...</p>
              </div>
            )}

            {results.map((result) => (
              <div
                key={result.id}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ fontSize: '36px' }}>{result.image}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <h4 style={{ fontWeight: '600', color: '#111827', fontSize: '14px', margin: 0 }}>
                        {result.title}
                      </h4>
                      <span
                        style={{
                          fontSize: '12px',
                          backgroundColor: '#dcfce7',
                          color: '#15803d',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          whiteSpace: 'nowrap',
                          marginLeft: '8px'
                        }}
                      >
                        {result.relevance}
                      </span>
                    </div>
                    <p style={{ color: '#9333ea', fontWeight: '700', margin: '4px 0', fontSize: '16px' }}>
                      {result.price}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '12px', margin: '4px 0 0 0' }}>
                      📍 {result.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            zIndex: 30
          }}
        />
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}