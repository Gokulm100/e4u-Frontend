import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AdCard from './AdCard';

export default function SimilarAds({ listing, navigate, returnTo = 'home' }) {
  const { apiFetch, mapListing, categories } = useApp();

  const categoryId = listing.categoryId
    || categories.find((c) => c.name === listing.category)?.id
    || undefined;
  const [similarAds, setSimilarAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchSimilar = useCallback(async () => {
    if (!listing?.id) return;
    setLoading(true);
    setError(false);
    try {
      const result = await apiFetch('/api/ads', {
        method: 'POST',
        body: JSON.stringify({
          page: 1,
          limit: 24,
          category: categoryId,
          subCategory: listing.subCategory || undefined,
        }),
      });
      const ads = (result?.ads || [])
        .filter((item) => item._id !== listing.id)
        .map(mapListing);
      setSimilarAds(ads);
    } catch {
      setError(true);
      setSimilarAds([]);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, mapListing, listing, categoryId]);

  useEffect(() => {
    let cancelled = false;
    setSimilarAds([]);
    setError(false);

    const run = async () => {
      if (!listing?.id) return;
      setLoading(true);
      try {
        const result = await apiFetch('/api/ads', {
          method: 'POST',
          body: JSON.stringify({
            page: 1,
            limit: 24,
            category: categoryId,
            subCategory: listing.subCategory || undefined,
          }),
        });
        if (cancelled) return;
        const ads = (result?.ads || [])
          .filter((item) => item._id !== listing.id)
          .map(mapListing);
        setSimilarAds(ads);
      } catch {
        if (!cancelled) {
          setError(true);
          setSimilarAds([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [listing.id, categoryId, listing.subCategory, apiFetch, mapListing]);

  const hasCategory = Boolean(categoryId);

  return (
    <div className="similar-ads-section">
      <div className="similar-ads-head">
        <h2 className="section-title similar-ads-title">Similar listings</h2>
        {!loading && (
          <button
            type="button"
            className="similar-ads-refresh"
            onClick={fetchSimilar}
            aria-label="Refresh similar listings"
            title="Refresh"
          >
            <RefreshCw size={16} strokeWidth={2.25} />
          </button>
        )}
      </div>

      {!hasCategory && (
        <p className="similar-ads-muted">Category not available for similar listings.</p>
      )}

      {hasCategory && loading && (
        <div className="similar-ads-loading">
          <span className="spinner similar-ads-spinner" />
          <span>Loading similar ads…</span>
        </div>
      )}

      {hasCategory && error && !loading && (
        <p className="similar-ads-muted">
          Could not load similar ads.{' '}
          <button type="button" className="similar-ads-retry" onClick={fetchSimilar}>
            Try again
          </button>
        </p>
      )}

      {hasCategory && !loading && !error && similarAds.length === 0 && (
        <p className="similar-ads-muted">No similar ads in this category right now.</p>
      )}

      {hasCategory && !loading && similarAds.length > 0 && (
        <div className="similar-ads-rail-wrap">
          <div className="similar-ads-rail" role="list">
            {similarAds.map((item) => (
              <div key={item.id} className="similar-ads-item" role="listitem">
                <AdCard
                  listing={item}
                  onClick={(l) => navigate('detail', { listing: l, returnTo })}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
