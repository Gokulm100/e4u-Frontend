import React from 'react';
import { ShieldCheck } from 'lucide-react';

// Smoothing keeps brand-new ads (very few views) from being tanked by a
// single report. As views grow, the score converges to the literal
// reports-over-views ratio.
const SMOOTHING = 10;

export function computeGenuineness(views = 0, reports = 0) {
  const v = Math.max(0, Number(views) || 0);
  const r = Math.max(0, Number(reports) || 0);
  const ratio = r / (v + SMOOTHING);
  const score = Math.round(Math.max(0, Math.min(1, 1 - ratio)) * 100);

  let level, label;
  if (score >= 80) { level = 'high'; label = 'Likely genuine'; }
  else if (score >= 60) { level = 'good'; label = 'Mostly genuine'; }
  else if (score >= 40) { level = 'caution'; label = 'Use caution'; }
  else { level = 'low'; label = 'High risk'; }

  return { score, level, label, lowData: v < 5, views: v, reports: r };
}

export default function GenuinityMeter({ views = 0, reports = 0, embedded = false }) {
  const { score, level, label, lowData, reports: r, views: v } = computeGenuineness(views, reports);

  return (
    <div className={embedded ? 'genuinity-embed' : 'genuinity-card'}>
      <div className="genuinity-header">
        <div className="genuinity-title-row">
          <ShieldCheck size={16} />
          <span className="genuinity-title">Genuineness</span>
        </div>
        <span className={`genuinity-badge ${level}`}>{label}</span>
      </div>

      <div className="genuinity-bar">
        <div className={`genuinity-fill ${level}`} style={{ width: `${score}%` }} />
      </div>

      <div className="genuinity-meta">
        <span className={`genuinity-score ${level}`}>{score}%</span>
        <span className="genuinity-sub">
          {lowData
            ? 'Not enough views yet for a reliable score'
            : `Based on ${r} report${r === 1 ? '' : 's'} across ${v} view${v === 1 ? '' : 's'}`}
        </span>
      </div>
    </div>
  );
}
