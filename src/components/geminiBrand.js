import React, { useId } from 'react';
import { Sparkles } from 'lucide-react';

export const GEMINI = {
  blue: '#4285f4',
  purple: '#9b72cb',
  rose: '#d96570',
  border: 'rgba(155, 114, 203, 0.18)',
  rowBorder: 'rgba(155, 114, 203, 0.1)',
};

export function GeminiGradientDefs({ ids, prefix = 'gemini' }) {
  const fallback = useGeminiGradients(prefix);
  const g = ids || fallback;

  return (
    <svg width="0" height="0" className="gemini-gradient-defs" aria-hidden>
      <defs>
        <linearGradient id={g.brand} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GEMINI.blue} />
          <stop offset="48%" stopColor={GEMINI.purple} />
          <stop offset="100%" stopColor={GEMINI.rose} />
        </linearGradient>
        <linearGradient id={g.horizontal} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={GEMINI.blue} />
          <stop offset="50%" stopColor={GEMINI.purple} />
          <stop offset="100%" stopColor={GEMINI.rose} />
        </linearGradient>
        <linearGradient id={g.accent} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={GEMINI.blue} stopOpacity="0.9" />
          <stop offset="50%" stopColor={GEMINI.purple} />
          <stop offset="100%" stopColor={GEMINI.rose} stopOpacity="0.85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function useGeminiGradients(prefix = 'gemini') {
  const uid = useId().replace(/:/g, '');
  const base = `${prefix}-${uid}`;
  return {
    brand: `${base}-brand`,
    horizontal: `${base}-h`,
    accent: `${base}-accent`,
  };
}

export function GeminiSparkles({ gradId, size = 18, className = '' }) {
  return (
    <Sparkles
      size={size}
      strokeWidth={2.25}
      className={`gemini-sparkles-icon ${className}`.trim()}
      stroke={`url(#${gradId})`}
      aria-hidden
    />
  );
}

export function GeminiGradientText({ as: Tag = 'span', className = '', children }) {
  return (
    <Tag className={`gemini-gradient-text ${className}`.trim()}>
      {children}
    </Tag>
  );
}

export function GeminiCard({ className = '', children }) {
  return (
    <div className={`gemini-card aa-analytics detail-section ${className}`.trim()}>
      {children}
    </div>
  );
}

export function GeminiScoreBar({ score, className = '' }) {
  const pct = Math.min(100, Math.max(0, score));
  return (
    <div className={`gemini-score-bar ${className}`.trim()} role="presentation">
      <div className="gemini-score-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function GeminiMetricMeter({ score, className = '' }) {
  const pct = Math.min(100, Math.max(0, score));
  return (
    <div className={`gemini-metric-meter ${className}`.trim()} aria-hidden>
      <div className="gemini-metric-meter-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function GeminiWaveAnimation({ className = '' }) {
  return (
    <div className={`gemini-wave ${className}`.trim()} aria-hidden>
      <svg className="gemini-wave-layer gemini-wave-layer--1" viewBox="0 0 288 40" preserveAspectRatio="none">
        <path
          d="M0 22 C24 14, 24 30, 48 22 C72 14, 72 30, 96 22 C120 14, 120 30, 144 22 C168 14, 168 30, 192 22 C216 14, 216 30, 240 22 C264 14, 264 30, 288 22"
          fill="none"
          stroke="url(#gemini-wave-shared)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <svg className="gemini-wave-layer gemini-wave-layer--2" viewBox="0 0 288 40" preserveAspectRatio="none">
        <path
          d="M0 18 C24 10, 24 26, 48 18 C72 10, 72 26, 96 18 C120 10, 120 26, 144 18 C168 10, 168 26, 192 18 C216 10, 216 26, 240 18 C264 10, 264 26, 288 18"
          fill="none"
          stroke="url(#gemini-wave-shared)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
      <svg className="gemini-wave-layer gemini-wave-layer--3" viewBox="0 0 288 40" preserveAspectRatio="none">
        <path
          d="M0 26 C24 18, 24 34, 48 26 C72 18, 72 34, 96 26 C120 18, 120 34, 144 26 C168 18, 168 34, 192 26 C216 18, 216 34, 240 26 C264 18, 264 34, 288 26"
          fill="none"
          stroke="url(#gemini-wave-shared)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>
      <svg width="0" height="0" aria-hidden>
        <defs>
          <linearGradient id="gemini-wave-shared" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={GEMINI.blue} stopOpacity="0.35" />
            <stop offset="50%" stopColor={GEMINI.purple} />
            <stop offset="100%" stopColor={GEMINI.rose} stopOpacity="0.45" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function GeminiAnalyzingVisual({ gradId }) {
  return (
    <div className="gemini-analyze-visual" aria-hidden>
      <div className="gemini-analyze-wash">
        <span className="gemini-analyze-wash-layer gemini-analyze-wash-layer--blue" />
        <span className="gemini-analyze-wash-layer gemini-analyze-wash-layer--purple" />
        <span className="gemini-analyze-wash-layer gemini-analyze-wash-layer--rose" />
      </div>
      <span className="gemini-twinkle-star gemini-twinkle-star--1" />
      <span className="gemini-twinkle-star gemini-twinkle-star--2" />
      <span className="gemini-twinkle-star gemini-twinkle-star--3" />
      <span className="gemini-twinkle-star gemini-twinkle-star--4" />
      <GeminiSparkles gradId={gradId} size={26} className="gemini-analyze-sparkles" />
    </div>
  );
}
