import React, { useState } from 'react';

// Removed DEFAULT_PAYLOAD. Ad details will be passed as props.

const boxStyle = {
  flex: 1,
  minWidth: 180,
  background: 'linear-gradient(120deg, #f3f6fa 60%, #e3d0e4ff 100%)',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(44,182,125,0.07)',
  padding: '18px 16px',
  margin: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  transition: 'transform 0.2s, box-shadow 0.2s',
};


const LOTTIE_URL = "https://lottie.host/embed/972966fd-68fa-4c58-a2a7-8449c35959b5/RLKi0kD1T3.lottie";


const AiAnalytics = ({ad, API_BASE_URL}) => {
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [aiOptimizationSuggestions, setAiOptimizationSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!ad) return;
    setLoading(true);
    setError(null);
    setGenerated(true);
    const payload = {
      adId: ad.id || ad._id || '',
      category: ad.categoryId || '',
      subCategory: ad.subCategory || '',
    };
    fetch(`${API_BASE_URL}/api/ai/provideAiAnalytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch AI analytics');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.data.analysis)) {
          setAiInsights(data.data.analysis);
          setAiOptimizationSuggestions(data.data.recommendations);
        } else {
          setAiInsights([]);
          setAiOptimizationSuggestions([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load AI analytics.');
        setAiInsights([]);
        setLoading(false);
      });
  };

  if (!generated) {
    return (
      <div style={{ width: 'auto', margin: '0 0 24px 0', padding: 24, background: '#f7f9fa', borderRadius: 10, textAlign: 'center', boxShadow: '0 2px 8px rgba(44,182,125,0.07)' }}>
  <p style={{ fontSize: '1.1rem', color: '#00639b', marginBottom: '12px' }}>Get instant AI insights and smart tips to improve your ad results.</p>
        <button
          onClick={handleGenerate}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '7px 16px',
            fontSize: '0.98rem',
            fontWeight: 600,
            color: '#fff',
            background: 'linear-gradient(90deg, #7f5af0 0%, #632cb6 100%)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(44,182,125,0.08)',
            marginTop: '12px',
            marginBottom: '12px',
            letterSpacing: '0.01em',
            transition: 'background 0.16s, box-shadow 0.16s, transform 0.10s',
            outline: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
          title="Generate AI Analytics"
          onMouseOver={e => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #632cb6 0%, #7f5af0 100%)';
            e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(44,182,125,0.13)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #7f5af0 0%, #632cb6 100%)';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(44,182,125,0.08)';
          }}
        >
          <img src="https://img.icons8.com/fluency/48/bard.png" alt="bard ai icon" width="15" height="15" style={{ verticalAlign: 'middle', display: 'block', marginRight: 2 }} />
          <span style={{ fontWeight: 600, fontSize: '0.98rem', letterSpacing: '0.01em' }}>
            Generate AI Analytics
          </span>
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ width: '100%', margin: '0 0 24px 0', paddingBottom: "10px", paddingTop: "10px", background: '#f3f6fa', borderRadius: 10, boxShadow: '0 2px 8px rgba(44,182,125,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 260 }}>
        <iframe
          src={LOTTIE_URL}
          title="Loading animation"
          style={{ width: 120, height: 120, border: 'none', background: 'transparent' }}
          allowFullScreen
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100%', margin: '0 0 24px 0', padding: 24, background: '#fff3f3', borderRadius: 10, color: '#b91c1c', textAlign: 'center', fontWeight: 600 }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', margin: '0 0 24px 0', paddingTop: "10px",  paddingBottom: "10px", background: '#f7f9fa', borderRadius: 10, boxShadow: '0 2px 8px rgba(44,182,125,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
        <img src="https://img.icons8.com/fluency/48/bard.png" alt="bard ai icon" width="28" height="28" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#000000ff', margin: 0, letterSpacing: '0.5px' }}>AI Analytics</h3>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: 8 }}>
        {aiInsights.map((insight, idx) => {
          // Generate a random delay for each card (between 0s and 0.7s)
          const randomDelay = (Math.random() * 0.7).toFixed(2) + 's';
          return (
            <div
              key={idx}
              style={{
                ...boxStyle,
                opacity: 0,
                animation: 'fadeInCenter 0.9s cubic-bezier(0.4,0.2,0.2,1) forwards',
                animationDelay: randomDelay,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1.08rem', color: '#0b0b0bff', marginBottom: 6 }}>{insight.title}</div>
              <div style={{ fontWeight: 600, fontSize: '1.2rem', color: '#632cb6ff', marginBottom: 4 }}>{insight.value}</div>
              <div style={{ color: '#374151', fontSize: '0.98rem', opacity: 0.85 }}>{insight.description}</div>
            </div>
          );
        })}
      </div>

      {/* AI-Powered Optimization Suggestions: Actionable Cards */}
      <div className="ai-optimization-cards actionable" style={{
        background:'linear-gradient(90deg, #6b7ba8ff 0%, #90b3deff 100%)',
        padding: "20px",
        color: "#ffffffff",
        margin: "5px",
        borderRadius: "20px"
      }}>
        {aiOptimizationSuggestions.map((suggestion, idx) => (
          <div className="ai-optimization-action-card" key={idx}>
            <div style={{ fontWeight: 700, fontSize: '1.08rem', color: '#fefdfdff', marginBottom: 6, textAlign: 'left' }}>
              {suggestion.title}
            </div>
            <div
              className="ai-optimization-action-reason"
              style={{
                color: 'linear-gradient(90deg, #862cb6 0%, #7f5af0 100%)',
                fontSize: '0.98rem',
                animation: 'fadeInCenter 1.2s ease-out forwards',
                animationDelay: suggestion.animationDelay,
                paddingTop: '1px',
                paddingBottom: '6px',
                opacity: 0,
                textAlign: 'left'
              }}
            >
              <span>{suggestion.description}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInCenter {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AiAnalytics;
