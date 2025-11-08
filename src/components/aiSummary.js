import React, { useEffect, useState } from 'react';
import './aiSummary.css';

const AiSummary = ({ adTitle, category, subCategory, description, API_BASE_URL }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!adTitle || !category || !subCategory || !description) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/api/ads/summarizeAdUsingAi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adTitle, category, subCategory, description })
    })
      .then(res => res.json())
      .then(result => setSummary(result.data))
      .catch(() => setError('Failed to load AI summary.'))
      .finally(() => setLoading(false));
  }, [adTitle, category, subCategory, description, API_BASE_URL]);

  return (
    <div className="ai-summary-card">
      <div className="ai-summary-header">
        <span className="ai-icon ai-animated-icon" aria-label="AI">
          <img src="https://img.icons8.com/fluency/48/bard.png" alt="bard ai icon" width="28" height="28" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
        </span>
        <span>AI Summary</span>
      </div>
      {loading ? (
        <div className="ai-summary-loading">Analyzing description…</div>
      ) : error ? (
        <div className="ai-summary-empty">{error}</div>
      ) : summary && Object.keys(summary).length ? (
        <dl className="ai-summary-list">
          {Object.entries(summary).map(([key, value]) => (
            <div className="ai-summary-row" key={key}>
              <dt>{key}</dt>
              <dd>{typeof value === 'object' && value !== null ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <li key={subKey}><strong>{subKey}:</strong> {subValue}</li>
                  ))}
                </ul>
              ) : String(value)}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="ai-summary-empty">No key features detected.</div>
      )}
    </div>
  );
};

export default AiSummary;
