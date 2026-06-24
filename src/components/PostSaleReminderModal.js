import React from 'react';
import { Star, X } from 'lucide-react';

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

  const formattedAmount = saleAmount
    ? `₹${Number(String(saleAmount).replace(/,/g, '')).toLocaleString('en-IN')}`
    : null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal report-modal post-sale-reminder-modal">
        <button type="button" className="report-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="post-sale-reminder-icon">🎉</div>
        <div className="modal-title">Sale complete!</div>
        <div className="modal-sub post-sale-reminder-sub">
          {formattedAmount ? (
            <>
              <strong>{adTitle}</strong> was marked as sold to{' '}
              <strong>{counterpartyName || revieweeName}</strong> for {formattedAmount}.
            </>
          ) : (
            <>
              <strong>{adTitle}</strong> was marked as sold to{' '}
              <strong>{counterpartyName || revieweeName}</strong>.
            </>
          )}
        </div>

        <div className="post-sale-reminder-card">
          <div className="post-sale-reminder-card-title">
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            Rate {revieweeName}
          </div>
          <p className="post-sale-reminder-card-text">
            Your feedback helps build trust on Dealr and helps other users make safer decisions.
          </p>
        </div>

        {counterpartyName && (
          <p className="post-sale-reminder-note">
            We also asked {counterpartyName} to review their experience.
          </p>
        )}

        <button type="button" className="review-submit-btn" onClick={onRateNow}>
          Rate now
        </button>
        <button type="button" className="post-sale-reminder-later" onClick={onClose}>
          Remind me later
        </button>
        <p className="post-sale-reminder-footnote">
          You can leave a review anytime from Profile → Pending Reviews.
        </p>
      </div>
    </div>
  );
}
