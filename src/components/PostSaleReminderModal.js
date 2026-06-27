import React from 'react';
import { Star, X, Sparkles } from 'lucide-react';

export default function PostSaleReminderModal({
  open,
  onClose,
  onRateNow,
  adTitle,
  revieweeName,
  counterpartyName,
  saleAmount,
}) {
  if (!open) return null;

  const buyerName = counterpartyName || revieweeName || 'Buyer';
  const formattedAmount = saleAmount
    ? `₹${Number(String(saleAmount).replace(/,/g, '')).toLocaleString('en-IN')}`
    : null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal post-sale-modal" role="dialog" aria-labelledby="post-sale-title">
        <div className="post-sale-backdrop" aria-hidden />

        <button type="button" className="post-sale-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="post-sale-hero">
          <div className="post-sale-hero-mark" aria-hidden>
            <span className="post-sale-hero-glow" />
            <span className="post-sale-hero-ring" />
            <span className="post-sale-hero-icon">
              <Sparkles size={22} strokeWidth={2} />
            </span>
          </div>
          <h2 id="post-sale-title" className="post-sale-title">Sale complete</h2>
          <p className="post-sale-lead">Your listing is marked sold. Nice work closing the deal.</p>
        </div>

        <div className="post-sale-summary">
          <div className="post-sale-summary-row">
            <span className="post-sale-summary-label">Listing</span>
            <span className="post-sale-summary-value" title={adTitle}>{adTitle}</span>
          </div>
          <div className="post-sale-summary-row">
            <span className="post-sale-summary-label">Buyer</span>
            <span className="post-sale-summary-value">{buyerName}</span>
          </div>
          {formattedAmount && (
            <div className="post-sale-summary-row post-sale-summary-row--amount">
              <span className="post-sale-summary-label">Sale amount</span>
              <span className="post-sale-summary-amount">{formattedAmount}</span>
            </div>
          )}
        </div>

        <div className="post-sale-review-block">
          <div className="post-sale-review-head">
            <div className="post-sale-review-icon" aria-hidden>
              <Star size={18} fill="currentColor" strokeWidth={0} />
            </div>
            <div>
              <p className="post-sale-review-title">Rate your experience</p>
              <p className="post-sale-review-copy">
                How was your deal with <strong>{revieweeName || buyerName}</strong>? Your review helps keep Dealr safe for everyone.
              </p>
            </div>
          </div>
          {counterpartyName && (
            <p className="post-sale-review-note">
              We also invited {counterpartyName} to share their experience.
            </p>
          )}
        </div>

        <button type="button" className="post-sale-review-btn" onClick={onRateNow}>
          Leave a review
        </button>
        <button type="button" className="post-sale-later-btn" onClick={onClose}>
          Maybe later
        </button>
        <p className="post-sale-footnote">
          You can review anytime from Profile → Pending reviews.
        </p>
      </div>
    </div>
  );
}
