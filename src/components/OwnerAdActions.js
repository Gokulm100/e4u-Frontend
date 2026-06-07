import React, { useState } from 'react';
import { Edit, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MarkSoldModal from './MarkSoldModal';
import ReviewModal from './ReviewModal';

export default function OwnerAdActions({ ad, onAdUpdated }) {
  const { navigate, apiFetch, showToast, showModal } = useApp();
  const [soldOpen, setSoldOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!ad) return null;

  if (ad.isSold) {
    return (
      <div className="owner-ad-sold-banner">
        <CheckCircle size={18} />
        <span>This ad is marked as sold</span>
      </div>
    );
  }

  const toggleActive = () => {
    const disabling = ad.isActive !== false;
    showModal(
      disabling ? 'Disable Ad' : 'Enable Ad',
      disabling
        ? `"${ad.title}" will no longer be visible to others.`
        : `"${ad.title}" will be visible to everyone again.`,
      disabling ? '🚫' : '✅',
      async () => {
        setBusy(true);
        try {
          await apiFetch(disabling ? '/api/ads/disableAd' : '/api/ads/enableAd', {
            method: 'POST',
            body: JSON.stringify({ adId: ad.id }),
          });
          showToast(disabling ? 'Ad disabled.' : 'Ad enabled.', 'success');
          onAdUpdated?.({ ...ad, isActive: !disabling });
        } catch {
          showToast(`Failed to ${disabling ? 'disable' : 'enable'} ad.`, 'error');
        } finally {
          setBusy(false);
        }
      }
    );
  };

  const handleSold = (target) => {
    showToast('Marked as sold!', 'success');
    onAdUpdated?.({ ...ad, isSold: true, status: 'sold' });
    setReviewTarget(target);
  };

  const isDisabled = ad.isActive === false;

  return (
    <>
      <div className="owner-ad-actions">
        <div className="owner-ad-actions-title">Manage your ad</div>
        <div className="owner-ad-actions-row">
          <button
            type="button"
            className="owner-ad-btn owner-ad-btn-edit"
            onClick={() => navigate('post', { ad })}
            disabled={busy}
          >
            <Edit size={15} /> Edit
          </button>
          <button
            type="button"
            className={`owner-ad-btn ${isDisabled ? 'owner-ad-btn-enable' : 'owner-ad-btn-disable'}`}
            onClick={toggleActive}
            disabled={busy}
          >
            {isDisabled ? <Eye size={15} /> : <EyeOff size={15} />}
            {isDisabled ? 'Enable' : 'Disable'}
          </button>
          <button
            type="button"
            className="owner-ad-btn owner-ad-btn-sold"
            onClick={() => setSoldOpen(true)}
            disabled={busy}
          >
            <CheckCircle size={15} /> Mark Sold
          </button>
        </div>
      </div>

      <MarkSoldModal
        ad={ad}
        open={soldOpen}
        onClose={() => setSoldOpen(false)}
        onSold={handleSold}
      />

      {reviewTarget && (
        <ReviewModal
          adId={reviewTarget.adId}
          adTitle={reviewTarget.adTitle}
          revieweeName={reviewTarget.revieweeName}
          revieweePic={reviewTarget.revieweePic}
          onClose={() => setReviewTarget(null)}
          onSubmitted={() => showToast('Thank you! Your review helps keep Dealr safe.', 'success')}
        />
      )}
    </>
  );
}
