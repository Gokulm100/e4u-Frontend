import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Star, User, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AdCard from '../components/AdCard';
import SellerTrustLine from '../components/SellerTrustLine';

function ReviewCard({ review }) {
  const reviewerName = review.reviewer?.name || 'User';
  const adTitle = review.ad?.title || 'Listing';
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <div className="seller-review-card">
      <div className="seller-review-header">
        <div className="seller-review-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              fill={star <= review.rating ? '#f59e0b' : 'transparent'}
              color={star <= review.rating ? '#f59e0b' : '#cbd5e1'}
            />
          ))}
        </div>
        <span className="seller-review-date">{date}</span>
      </div>
      <div className="seller-review-author">{reviewerName}</div>
      <div className="seller-review-ad">{adTitle}</div>
      {review.text && <p className="seller-review-text">{review.text}</p>}
      {review.tags?.length > 0 && (
        <div className="seller-review-tags">
          {review.tags.map((tag) => (
            <span key={tag} className="seller-review-tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SellerProfilePage() {
  const { pageExtra, navigate, apiFetch, mapListing } = useApp();
  const {
    sellerId,
    sellerName,
    sellerPic,
    sellerSince,
    returnTo = 'home',
    listing: returnListing,
    adReturnTo = 'home',
  } = pageExtra;

  const [ads, setAds] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!sellerId) return;
    setLoading(true);
    try {
      const [adsRes, reviewsRes] = await Promise.all([
        apiFetch('/api/ads/listUserAds', {
          method: 'POST',
          body: JSON.stringify({ id: sellerId, limit: 50 }),
        }),
        apiFetch(`/api/reviews/user/${sellerId}?limit=5`),
      ]);
      const list = Array.isArray(adsRes) ? adsRes : (adsRes?.ads || []);
      setAds(list.map(mapListing));
      setReputation(reviewsRes.user);
      setReviews(reviewsRes.reviews || []);
    } catch {
      setAds([]);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [sellerId, apiFetch, mapListing]);

  useEffect(() => {
    load();
  }, [load]);

  if (!sellerId) {
    return (
      <div className="seller-profile-page">
        <button type="button" className="back-btn" onClick={() => navigate(returnTo)}>
          <ArrowLeft size={18} />
        </button>
        <div className="empty-state">
          <span className="empty-title">Seller not found</span>
        </div>
      </div>
    );
  }

  const ratingAvg = reputation?.ratingAvg || 0;
  const reviewCount = reputation?.reviewCount || 0;
  const completedSales = reputation?.completedSales || 0;
  const memberSince = reputation?.createdAt
    ? new Date(reputation.createdAt).getFullYear()
    : (sellerSince || null);

  return (
    <div className="seller-profile-page">
      <div className="seller-profile-topbar">
        <button
          type="button"
          className="back-btn"
          onClick={() => {
            if ((returnTo === 'ad-detail' || returnTo === 'detail') && returnListing) {
              navigate(returnTo, { listing: returnListing, returnTo: adReturnTo });
            } else {
              navigate(returnTo);
            }
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="seller-profile-heading">Seller Profile</h1>
      </div>

      <div className="seller-profile-card">
        {sellerPic ? (
          <img className="seller-profile-avatar" src={sellerPic} alt={sellerName} />
        ) : (
          <div className="seller-profile-avatar-fallback">
            <User size={36} />
          </div>
        )}
        <div className="seller-profile-info">
          <div className="seller-profile-name-row">
            <h2 className="seller-profile-name">{sellerName || 'Seller'}</h2>
            <span className="seller-profile-verified" title="Verified with Google">
              <CheckCircle size={14} />
            </span>
          </div>
          {memberSince && (
            <p className="seller-profile-since">Member since {memberSince}</p>
          )}
          <SellerTrustLine
            ratingAvg={ratingAvg}
            reviewCount={reviewCount}
            completedSales={completedSales}
            badges={reputation?.badges || []}
            trustScore={reputation?.trustScore ?? 50}
            size="md"
            showScore
          />
          <div className="seller-profile-stats">
            <div className="seller-profile-stat">
              <span className="seller-profile-stat-num">{ads.length}</span>
              <span className="seller-profile-stat-label">Ads</span>
            </div>
            <div className="seller-profile-stat-divider" />
            <div className="seller-profile-stat">
              <span className="seller-profile-stat-num">{completedSales}</span>
              <span className="seller-profile-stat-label">Sales</span>
            </div>
            <div className="seller-profile-stat-divider" />
            <div className="seller-profile-stat">
              <span className="seller-profile-stat-num">{reviewCount}</span>
              <span className="seller-profile-stat-label">Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {reviews.length > 0 && (
        <section className="seller-profile-section">
          <h3 className="seller-profile-section-title">Recent Reviews</h3>
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </section>
      )}

      <section className="seller-profile-section">
        <h3 className="seller-profile-section-title">Ads by this Seller</h3>
        {loading ? (
          <div className="empty-state"><div className="spinner" /></div>
        ) : ads.length === 0 ? (
          <div className="empty-state">
            <span className="empty-sub">No ads posted yet</span>
          </div>
        ) : (
          <div className="ads-grid seller-profile-ads">
            {ads.map((listing) => (
              <AdCard
                key={listing.id}
                listing={listing}
                onClick={(l) => navigate('ad-detail', {
                  listing: l,
                  returnTo: 'seller-profile',
                  sellerId,
                  sellerName,
                  sellerPic,
                  sellerSince,
                  adReturnTo,
                })}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
