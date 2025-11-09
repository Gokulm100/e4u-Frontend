import React, { useEffect, useState } from 'react';

const aiInsights = [
  {
    title: 'Demand Score',
    value: 'High',
    description: 'Your ad is trending and has received 120+ views in the last week.'
  },
  {
    title: 'Ad Visibility',
    value: 'Top 10%',
    description: 'Your ad appears in the top 10% of search results for its category.'
  },
  {
    title: 'Highest Offer',
    value: '₹1.18 Crore',
    description: 'The highest offer received so far for this listing.'
  },
  {
    title: 'Inquiries',
    value: '23',
    description: 'You have received 23 inquiries from interested buyers.'
  }
];

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

// Define the AI optimization suggestions as a constant array
const aiOptimizationSuggestions = [
  {
    title: 'Recommended Price',
    reason: (
      <>
        ₹1,15,000 &mdash; Based on similar ads in this category, most competitive listings are priced between <b>₹1,10,000</b> and <b>₹1,20,000</b>.
      </>
    ),
    animationDelay: '0s'
  },
  {
    title: 'Condition-Based Suggestion',
    reason: (
      <>
        Your product is marked as <b>Excellent</b> condition. Similar items in this state sell for <b>5-10% higher</b> than average.
      </>
    ),
    animationDelay: '0.3s'
  },
  {
    title: 'Optimal Price Range',
    reason: (
      <>
        For a faster sale, set your price between <b>₹1,12,000</b> and <b>₹1,18,000</b> as per recent market trends.
      </>
    ),
    animationDelay: '0.6s'
  }
];

const LOTTIE_URL = "https://lottie.host/embed/26f77827-189f-4bbb-83de-0f9884ea53d7/fxmAVQOl4i.lottie";

const AiAnalytics = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 1.2s
    const timer = setTimeout(() => setLoading(false), 5200);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div style={{ width: '100%', margin: '0 0 24px 0', paddingTop: "10px",  paddingBottom: "10px", background: '#f3f6fa', borderRadius: 10, boxShadow: '0 2px 8px rgba(44,182,125,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
        <img src="https://img.icons8.com/fluency/48/bard.png" alt="bard ai icon" width="28" height="28" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#000000ff', margin: 0, letterSpacing: '0.5px' }}>AI Analytics</h3>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: 8 }}>
        {aiInsights.map((insight, idx) => (
          <div key={idx} style={boxStyle}>
            <div style={{ fontWeight: 700, fontSize: '1.08rem', color: '#0b0b0bff', marginBottom: 6 }}>{insight.title}</div>
            <div style={{ fontWeight: 600, fontSize: '1.2rem', color: '#632cb6ff', marginBottom: 4 }}>{insight.value}</div>
            <div style={{ color: '#374151', fontSize: '0.98rem', opacity: 0.85 }}>{insight.description}</div>
          </div>
        ))}
      </div>

      {/* AI-Powered Optimization Suggestions: Actionable Cards */}
      <div className="ai-optimization-cards actionable" style={{
        background: "white",
        padding: "20px",
        margin: "5px",
        borderRadius: "8px"
      }}>
        {aiOptimizationSuggestions.map((suggestion, idx) => (
          <div className="ai-optimization-action-card" key={idx}>
            <div style={{ fontWeight: 700, fontSize: '1.08rem', color: '#0b0b0bff', marginBottom: 6, textAlign: 'left' }}>
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
              <span>{suggestion.reason}</span>
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
