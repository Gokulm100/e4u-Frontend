import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  TrendingUp,
  Award,
  Tag,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  Clock,
  IndianRupee,
  BarChart3,
} from 'lucide-react';
import {
  GeminiSparkles,
  GeminiGradientText,
  AnalyticsCard,
  GeminiScoreBar,
  GeminiMetricMeter,
} from './geminiBrand';

const CARD_ACCENTS = ['#4285f4', '#9b72cb', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

const FEATURES = [
  { label: 'Performance metrics', Icon: TrendingUp },
  { label: 'Market comparison', Icon: Award },
  { label: 'Actionable tips', Icon: Tag },
];

const STATUS_CLASS = {
  strong: 'aa-glance-status--strong',
  good: 'aa-glance-status--good',
  fair: 'aa-glance-status--fair',
  low: 'aa-glance-status--low',
};

function accentStyle(index) {
  return { '--aa-accent': CARD_ACCENTS[index % CARD_ACCENTS.length] };
}

function parseMetricNumber(value) {
  if (value == null || value === '') return null;
  const s = String(value).trim();
  const pct = s.match(/([\d.]+)\s*%/);
  if (pct) return { num: parseFloat(pct[1]), max: 100 };
  const cleaned = s.replace(/[,₹\s]/g, '');
  const numMatch = cleaned.match(/([\d.]+)/);
  if (numMatch) {
    const num = parseFloat(numMatch[1]);
    if (!Number.isFinite(num)) return null;
    return { num, max: null };
  }
  return null;
}

function scoreFromValue(value) {
  const parsed = parseMetricNumber(value);
  if (parsed) {
    const cap = parsed.max ?? Math.max(parsed.num * 1.15, parsed.num);
    if (!Number.isFinite(cap) || cap <= 0) return 8;
    const score = (parsed.num / cap) * 100;
    if (!Number.isFinite(score)) return 8;
    return Math.min(100, Math.max(8, score));
  }
  const lower = String(value).toLowerCase();
  if (/excellent|outstanding|high|strong|great|good|fast/.test(lower)) return 88;
  if (/medium|average|moderate|fair|normal/.test(lower)) return 55;
  if (/low|poor|weak|bad|slow/.test(lower)) return 28;
  let h = 0;
  for (let i = 0; i < lower.length; i += 1) h = (h + lower.charCodeAt(i) * 7) % 45;
  return 42 + h;
}

function getMetricStatus(score) {
  if (score >= 75) return { label: 'Strong', tone: 'strong', color: '#10b981' };
  if (score >= 50) return { label: 'Good', tone: 'good', color: '#378cf6' };
  if (score >= 30) return { label: 'Fair', tone: 'fair', color: '#f59e0b' };
  return { label: 'Needs work', tone: 'low', color: '#ef4444' };
}

function getOverallMessage(score) {
  if (score >= 75) return 'Your listing is performing well overall.';
  if (score >= 50) return 'Solid start — a few tweaks could help you sell faster.';
  return 'There’s room to improve — check the tips below.';
}

function pickMetricIcon(title) {
  const t = String(title || '').toLowerCase();
  if (/price|cost|₹|rupee|value/.test(t)) return IndianRupee;
  if (/view|traffic|reach|impression|click/.test(t)) return Eye;
  if (/time|speed|day|hour|posted|duration/.test(t)) return Clock;
  if (/compet|market|compare|rank|demand/.test(t)) return Award;
  if (/trend|growth|performance/.test(t)) return TrendingUp;
  return BarChart3;
}

function buildGlanceMetrics(insights) {
  return insights.map((insight, idx) => {
    const score = Math.round(scoreFromValue(insight.value));
    return {
      title: insight.title,
      value: insight.value,
      description: insight.description,
      accent: CARD_ACCENTS[idx % CARD_ACCENTS.length],
      score,
      status: getMetricStatus(score),
      Icon: pickMetricIcon(insight.title),
    };
  });
}

function scoreLevel(score) {
  if (score >= 75) return 4;
  if (score >= 50) return 3;
  if (score >= 30) return 2;
  return 1;
}

function LevelMeter({ score }) {
  const level = scoreLevel(score);
  const status = getMetricStatus(score);

  return (
    <div className="aa-level-meter" role="img" aria-label={`${status.label} performance`}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`aa-level-seg aa-level-seg--${status.tone}${i < level ? ' aa-level-seg--on' : ''}`}
        />
      ))}
    </div>
  );
}

function StatusPill({ tone, label }) {
  return (
    <span className={`aa-status-pill ${STATUS_CLASS[tone] || STATUS_CLASS.good}`}>
      {label}
    </span>
  );
}

function GlancePreviewCard({ metric }) {
  const { Icon, title, value, score, status, accent } = metric;
  return (
    <div className="aa-glance-preview-card" style={{ '--aa-preview-accent': accent }}>
      <div className="aa-glance-preview-head">
        <span className="aa-glance-preview-icon" aria-hidden>
          <Icon size={16} strokeWidth={2.25} />
        </span>
        <span className={`aa-glance-preview-badge aa-glance-status aa-glance-status--${status.tone}`}>
          {status.label}
        </span>
      </div>
      <span className="aa-glance-preview-title">{title}</span>
      <span className="aa-glance-preview-value">{value}</span>
      <GeminiMetricMeter score={score} className="aa-glance-preview-meter" />
    </div>
  );
}

function AtAGlancePanel({ insights, suggestions }) {
  const metrics = buildGlanceMetrics(insights);
  const validScores = metrics.map((m) => m.score).filter((s) => Number.isFinite(s));
  const overallScore = validScores.length
    ? Math.round(validScores.reduce((sum, s) => sum + s, 0) / validScores.length)
    : 0;
  const overallStatus = getMetricStatus(overallScore);
  const previewMetrics = metrics.slice(0, 3);

  return (
    <section className="aa-glance-panel" aria-label="At a glance summary">
      <div className="aa-glance-accent" aria-hidden />

      <div className="aa-glance-panel-header">
        <span className="aa-glance-panel-label">
          <GeminiSparkles size={15} />
          <GeminiGradientText className="aa-glance-panel-title">At a glance</GeminiGradientText>
        </span>
        <StatusPill tone={overallStatus.tone} label={overallStatus.label} />
      </div>

      <div className="aa-glance-hero">
        <div className="aa-glance-score-cluster">
          <GeminiGradientText className="aa-glance-score-num">{overallScore}</GeminiGradientText>
          <span className="aa-glance-score-caption">Overall score</span>
        </div>
        <div className="aa-glance-hero-copy">
          <p className="aa-glance-summary-msg">{getOverallMessage(overallScore)}</p>
          <GeminiScoreBar score={overallScore} className="aa-glance-hero-bar" />
        </div>
      </div>

      {previewMetrics.length > 0 && (
        <div className="aa-glance-preview">
          {previewMetrics.map((metric, idx) => (
            <GlancePreviewCard key={`${metric.title}-${idx}`} metric={metric} />
          ))}
        </div>
      )}

      <p className="aa-glance-footer">
        {suggestions.length > 0
          ? `Explore each metric below · ${suggestions.length} tip${suggestions.length > 1 ? 's' : ''} ready`
          : 'Explore each metric below for the full breakdown'}
      </p>
    </section>
  );
}

function GlanceLegend() {
  return (
    <div className="aa-glance-legend" aria-label="Score legend">
      <span className="aa-glance-legend-item">
        <span className="aa-glance-legend-dot aa-glance-status--strong" /> Strong
      </span>
      <span className="aa-glance-legend-item">
        <span className="aa-glance-legend-dot aa-glance-status--good" /> Good
      </span>
      <span className="aa-glance-legend-item">
        <span className="aa-glance-legend-dot aa-glance-status--fair" /> Fair
      </span>
      <span className="aa-glance-legend-item">
        <span className="aa-glance-legend-dot aa-glance-status--low" /> Needs work
      </span>
    </div>
  );
}

function MetricGlanceCard({ metric, onClick, active }) {
  const { Icon, title, value, accent, score, status } = metric;
  const className = [
    'aa-glance-card',
    onClick ? 'aa-glance-card--btn' : '',
    active ? 'active' : '',
  ].filter(Boolean).join(' ');

  const inner = (
    <>
      <div className="aa-glance-card-head">
        <span className="aa-glance-card-icon" aria-hidden>
          <Icon size={18} strokeWidth={2.25} />
        </span>
        <div className="aa-glance-card-copy">
          <div className="aa-glance-card-title">{title}</div>
          <div className="aa-glance-card-value">{value}</div>
        </div>
        <LevelMeter score={score} />
      </div>
      <div className="aa-glance-card-meta">
        <span className={`aa-glance-status aa-glance-status--${status.tone}`}>
          {status.label}
        </span>
      </div>
      <GeminiMetricMeter score={score} />
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        style={{ '--aa-accent': accent }}
        onClick={onClick}
        aria-pressed={active}
        aria-label={`${title}: ${value}. ${active ? 'Selected' : 'View details'}`}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className={className} style={{ '--aa-accent': accent }}>
      {inner}
    </div>
  );
}

function AnalyzingState() {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    'Reviewing price signals',
    'Reading market demand',
    'Preparing your insights',
  ];

  useEffect(() => {
    const copyTimer = setInterval(() => {
      setStepIndex((idx) => (idx + 1) % steps.length);
    }, 3200);
    return () => clearInterval(copyTimer);
  }, [steps.length]);

  return (
    <div className="aa-analyze">
      <div className="aa-analyze-icon-wrap" aria-hidden>
        <GeminiSparkles size={28} />
      </div>
      <div className="aa-analyze-copy">
        <GeminiGradientText as="h3" className="aa-analyze-title">
          Analyzing your listing
        </GeminiGradientText>
        <p className="aa-analyze-sub" key={stepIndex}>{steps[stepIndex]}</p>
        <div className="aa-analyze-progress" aria-hidden>
          <span className="aa-analyze-progress-fill" />
        </div>
      </div>
    </div>
  );
}

function AnalyticsHeader({ onRefresh, showRefresh }) {
  return (
    <div className="aa-header">
      <div className="ai-header">
        <GeminiSparkles />
        <GeminiGradientText className="ai-header-text">AI Analytics</GeminiGradientText>
      </div>
      {showRefresh && (
        <button
          type="button"
          className="aa-refresh"
          onClick={onRefresh}
          aria-label="Refresh analytics"
          title="Refresh"
        >
          <RefreshCw size={16} strokeWidth={2.25} />
        </button>
      )}
    </div>
  );
}

function SegmentTabs({ segments, activeKey, onChange }) {
  return (
    <div className="aa-tabs" role="tablist">
      {segments.map((seg) => {
        const active = activeKey === seg.key;
        return (
          <button
            key={seg.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={`aa-tab${active ? ' active' : ''}`}
            onClick={() => onChange(seg.key)}
          >
            {seg.label}
            {seg.count > 0 && <span className="aa-tab-badge">{seg.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

function MetricDetailPopover({ insight, metric, style }) {
  return (
    <div
      className="aa-metric-popover"
      style={style}
      role="dialog"
      aria-label={`${insight.title} analysis`}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="aa-metric-popover-caret" aria-hidden />
      <span className={`aa-metric-detail-badge aa-glance-status aa-glance-status--${metric.status.tone}`}>
        {metric.status.label}
      </span>
      <div className="aa-metric-detail-value">{insight.value}</div>
      <div className="aa-metric-detail-title">{insight.title}</div>
      {!!insight.description && (
        <p className="aa-metric-detail-desc">{insight.description}</p>
      )}
    </div>
  );
}

function MetricExplorer({ insights }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const gridRef = useRef(null);
  const metrics = buildGlanceMetrics(insights);

  useEffect(() => {
    if (selectedIdx === null) return undefined;

    const onPointerDown = (e) => {
      if (gridRef.current?.contains(e.target)) return;
      setSelectedIdx(null);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedIdx(null);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedIdx]);

  if (!insights.length) {
    return <p className="aa-muted">No metrics available yet.</p>;
  }

  return (
    <div className="aa-metrics">
      <p className="aa-glance-grid-label">Key metrics</p>
      <p className="aa-metrics-hint">Click a card to open its analysis. Click outside or press Esc to close.</p>
      <div className="aa-glance-grid aa-metrics-grid" ref={gridRef}>
        {metrics.map((metric, idx) => {
          const open = selectedIdx === idx;
          const insight = insights[idx];
          return (
            <div key={`${metric.title}-${idx}`} className={`aa-metric-card-wrap${open ? ' aa-metric-card-wrap--open' : ''}`}>
              <MetricGlanceCard
                metric={metric}
                active={open}
                onClick={() => setSelectedIdx((prev) => (prev === idx ? null : idx))}
              />
              {open && insight && (
                <MetricDetailPopover
                  insight={insight}
                  metric={metric}
                  style={accentStyle(idx)}
                />
              )}
            </div>
          );
        })}
      </div>
      <GlanceLegend />
    </div>
  );
}

function TipsList({ suggestions }) {
  const [expandedIdx, setExpandedIdx] = useState(0);

  if (!suggestions.length) return null;

  return (
    <div className="aa-tips-list">
      {suggestions.map((tip, idx) => {
        const open = expandedIdx === idx;
        return (
          <div
            key={idx}
            className={`aa-tip${open ? ' open' : ''}`}
            style={accentStyle(idx)}
          >
            <button
              type="button"
              className="aa-tip-toggle"
              onClick={() => setExpandedIdx(open ? -1 : idx)}
            >
              <span className={`aa-tip-badge${idx === 0 ? ' high' : ''}`}>
                {idx === 0 ? 'High impact' : 'Recommended'}
              </span>
              <span className="aa-tip-title">{tip.title}</span>
              {open ? (
                <ChevronDown size={18} className="aa-tip-chevron" />
              ) : (
                <ChevronRight size={18} className="aa-tip-chevron" />
              )}
            </button>
            {open && !!tip.description && (
              <p className="aa-tip-body">{tip.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AiAnalytics({ ad, listing, apiFetch: apiFetchProp }) {
  const { apiFetch: ctxApiFetch } = useApp();
  const apiFetch = apiFetchProp || ctxApiFetch;
  const item = ad || listing;
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [insights, setInsights] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('metrics');

  const handleGenerate = async () => {
    if (!item || !apiFetch) return;
    setLoading(true);
    setGenerated(true);
    setError(null);
    try {
      const res = await apiFetch('/api/ai/provideAiAnalytics', {
        method: 'POST',
        body: JSON.stringify({
          adId: item.id || item._id || '',
          category: item.categoryId || item.category || '',
          subCategory: item.subCategory || '',
        }),
      });
      const payload = res.data ?? res;
      setInsights(Array.isArray(payload?.analysis) ? payload.analysis : []);
      setSuggestions(Array.isArray(payload?.recommendations) ? payload.recommendations : []);
      setActiveTab('metrics');
    } catch {
      setError('Could not load AI analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!generated) {
    return (
      <AnalyticsCard>
        <AnalyticsHeader />
        <p className="aa-lead">
          See how your listing compares and get smart suggestions to sell faster.
        </p>
        <ul className="aa-features">
          {FEATURES.map(({ label, Icon }) => (
            <li key={label} className="aa-feature">
              <span className="aa-feature-icon">
                <Icon size={16} strokeWidth={2.25} />
              </span>
              {label}
            </li>
          ))}
        </ul>
        <button type="button" className="aa-generate-btn" onClick={handleGenerate}>
          <Sparkles size={16} strokeWidth={2.25} />
          Generate insights
        </button>
      </AnalyticsCard>
    );
  }

  if (loading) {
    return (
      <AnalyticsCard>
        <AnalyticsHeader />
        <AnalyzingState />
      </AnalyticsCard>
    );
  }

  if (error) {
    return (
      <AnalyticsCard>
        <AnalyticsHeader onRefresh={handleGenerate} showRefresh />
        <div className="aa-error">
          <AlertCircle size={20} strokeWidth={2} />
          <div>
            <p className="aa-error-title">Couldn&apos;t load analytics</p>
            <p className="aa-muted">{error}</p>
          </div>
        </div>
        <button type="button" className="aa-generate-btn aa-generate-btn--secondary" onClick={handleGenerate}>
          <RefreshCw size={16} strokeWidth={2.25} />
          Try again
        </button>
      </AnalyticsCard>
    );
  }

  const segments = [
    { key: 'metrics', label: 'Metrics', count: insights.length },
    { key: 'tips', label: 'Tips', count: suggestions.length },
  ];

  return (
    <AnalyticsCard>
      <AnalyticsHeader onRefresh={handleGenerate} showRefresh />

      {insights.length > 0 && (
        <AtAGlancePanel insights={insights} suggestions={suggestions} />
      )}

      <SegmentTabs segments={segments} activeKey={activeTab} onChange={setActiveTab} />

      <div className="aa-panel">
        {activeTab === 'metrics' ? (
          <MetricExplorer insights={insights} />
        ) : suggestions.length > 0 ? (
          <TipsList suggestions={suggestions} />
        ) : (
          <p className="aa-muted">No tips for this listing right now.</p>
        )}
      </div>
    </AnalyticsCard>
  );
}
