import React from 'react';
import { Shield } from 'lucide-react';

const BADGE_STYLES = {
  trusted: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  established: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  new: { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
  caution: { bg: '#fff1f2', color: '#dc2626', border: '#fecaca' },
};

export default function TrustBadge({ badges = [], trustScore, size = 'md', showScore = false }) {
  const badge = badges?.[0];
  if (!badge && trustScore == null) return null;

  const style = badge ? (BADGE_STYLES[badge.level] || BADGE_STYLES.new) : BADGE_STYLES.new;
  const compact = size === 'sm';

  return (
    <span className="trust-badge-wrap">
      {badge && (
        <span
          className={`trust-badge trust-badge-${badge.level}${compact ? ' trust-badge-sm' : ''}`}
          style={{
            background: style.bg,
            color: style.color,
            borderColor: style.border,
          }}
        >
          {badge.level === 'caution' && <Shield size={compact ? 11 : 12} />}
          {badge.label}
        </span>
      )}
      {showScore && trustScore != null && (
        <span className={`trust-score-text${compact ? ' trust-score-sm' : ''}`}>
          Trust {trustScore}/100
        </span>
      )}
    </span>
  );
}
