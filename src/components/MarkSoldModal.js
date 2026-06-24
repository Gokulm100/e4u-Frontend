import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MarkSoldModal({ ad, open, onClose, onSold }) {
  const { apiFetch, showToast } = useApp();
  const [buyers, setBuyers] = useState([]);
  const [loadingBuyers, setLoadingBuyers] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState('');
  const [soldAmount, setSoldAmount] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !ad?.id) return;
    setSelectedBuyer('');
    setSoldAmount(String(ad.price ?? ''));
    setDropdownOpen(false);
    setLoadingBuyers(true);
    apiFetch('/api/ads/getUsersInterestedInAd', {
      method: 'POST',
      body: JSON.stringify({ adId: ad.id }),
    })
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.users || []);
        setBuyers(list);
      })
      .catch(() => setBuyers([]))
      .finally(() => setLoadingBuyers(false));
  }, [open, ad?.id, ad?.price, apiFetch]);

  if (!open || !ad) return null;

  const selected = buyers.find((u) => u._id === selectedBuyer);

  const confirm = async () => {
    if (!soldAmount.trim()) {
      showToast('Please enter the sale amount.', 'error');
      return;
    }
    if (!selectedBuyer) {
      showToast('Please select the buyer.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/api/ads/markAdAsSold', {
        method: 'POST',
        body: JSON.stringify({
          adId: ad.id,
          buyerId: selectedBuyer,
          amount: soldAmount.trim(),
        }),
      });
      onSold({
        adId: ad.id,
        adTitle: ad.title,
        revieweeName: selected?.name || selected?.email || 'Buyer',
        revieweePic: selected?.profilePic || null,
        counterpartyName: selected?.name || selected?.email || 'Buyer',
        saleAmount: soldAmount.trim(),
      });
      onClose();
    } catch (err) {
      showToast(err.message || 'Could not mark ad as sold.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal report-modal mark-sold-modal">
        <button type="button" className="report-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="mark-sold-celebration">🎉</div>
        <div className="modal-title">Mark as Sold</div>
        <div className="modal-sub">Congratulations! Tell us who bought &quot;{ad.title}&quot;.</div>

        <div className="mark-sold-label">Select Buyer</div>
        {loadingBuyers ? (
          <div className="report-modal-state"><div className="spinner" style={{ width: 22, height: 22 }} /></div>
        ) : (
          <div className="mark-sold-dropdown-wrap">
            <button
              type="button"
              className="mark-sold-dropdown-btn"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <span>{selected ? (selected.name || selected.email) : 'Select the person who bought this'}</span>
              <span>{dropdownOpen ? '▲' : '▼'}</span>
            </button>
            {dropdownOpen && (
              <div className="mark-sold-dropdown-list">
                {buyers.length === 0 ? (
                  <div className="mark-sold-empty">No recent interactions found</div>
                ) : (
                  buyers.map((u) => (
                    <button
                      key={u._id}
                      type="button"
                      className={`mark-sold-buyer${selectedBuyer === u._id ? ' selected' : ''}`}
                      onClick={() => {
                        setSelectedBuyer(u._id);
                        setDropdownOpen(false);
                      }}
                    >
                      {u.name || u.email || 'Unknown buyer'}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        <div className="mark-sold-label">Final Sale Amount</div>
        <input
          type="number"
          className="mark-sold-amount-input"
          placeholder="Enter amount ₹"
          value={soldAmount}
          onChange={(e) => setSoldAmount(e.target.value)}
          min="0"
        />

        <button
          type="button"
          className="review-submit-btn"
          onClick={confirm}
          disabled={submitting || !selectedBuyer || !soldAmount.trim() || loadingBuyers}
        >
          {submitting ? 'Saving…' : 'Confirm & Complete Sale'}
        </button>
      </div>
    </div>
  );
}
