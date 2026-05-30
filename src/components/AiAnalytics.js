import React, { useState } from 'react';
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
} from 'lucide-react';

const CARD_ACCENTS = ['#378cf6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

const FEATURES = [
  { label: 'Performance metrics', Icon: TrendingUp },
  { label: 'Market comparison', Icon: Award },
  { label: 'Actionable tips', Icon: Tag },
];

function accentStyle(index) {
  return { '--aa-accent': CARD_ACCENTS[index % CARD_ACCENTS.length] };
}

function AnalyticsHeader({ onRefresh, showRefresh }) {
  return (
    <div className="aa-header">
      <div className="ai-header">
        <span className="ai-icon" aria-hidden>✦</span>
        <span className="ai-header-text">AI Analytics</span>
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

function MetricExplorer({ insights }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = insights[selectedIdx];

  if (!insights.length) {
    return <p className="aa-muted">No metrics available yet.</p>;
  }

  const scrollable = insights.length > 4;

  return (
    <div className="aa-metrics">
      <div className={scrollable ? 'aa-metric-scroll-wrap' : undefined}>
        <div className={`aa-metric-grid${scrollable ? ' aa-metric-grid--scroll' : ''}`}>
          {insights.map((insight, idx) => (
            <button
              key={idx}
              type="button"
              className={`aa-metric-tile${selectedIdx === idx ? ' active' : ''}`}
              style={accentStyle(idx)}
              onClick={() => setSelectedIdx(idx)}
            >
              <span className="aa-metric-label">{insight.title}</span>
              <span className="aa-metric-value">{insight.value}</span>
            </button>
          ))}
        </div>
      </div>
      {selected && (
        <div className="aa-metric-detail" style={accentStyle(selectedIdx)}>
          <div className="aa-metric-detail-value">{selected.value}</div>
          <div className="aa-metric-detail-title">{selected.title}</div>
          {!!selected.description && (
            <p className="aa-metric-detail-desc">{selected.description}</p>
          )}
        </div>
      )}
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
      <div className="detail-section aa-analytics">
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
      </div>
    );
  }

  if (loading) {
    return (
      <div className="detail-section aa-analytics">
        <AnalyticsHeader />
        <div className="ai-loading aa-loading-block">
          <div className="spinner" style={{ width: 22, height: 22 }} />
          <span>Analyzing your listing…</span>
        </div>
        <p className="aa-muted aa-loading-hint">
          Checking market trends and optimization opportunities.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-section aa-analytics">
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
      </div>
    );
  }

  const segments = [
    { key: 'metrics', label: 'Metrics', count: insights.length },
    { key: 'tips', label: 'Tips', count: suggestions.length },
  ];
  const headlineMetric = insights[0];

  return (
    <div className="detail-section aa-analytics">
      <AnalyticsHeader onRefresh={handleGenerate} showRefresh />

      {headlineMetric && (
        <div className="aa-highlight">
          <span className="aa-highlight-label">At a glance</span>
          <div className="aa-highlight-value">{headlineMetric.value}</div>
          <p className="aa-highlight-meta">
            {headlineMetric.title}
            {insights.length > 1 && ` · ${insights.length - 1} more metric${insights.length > 2 ? 's' : ''}`}
            {suggestions.length > 0 && ` · ${suggestions.length} tip${suggestions.length > 1 ? 's' : ''}`}
          </p>
        </div>
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
    </div>
  );
}
