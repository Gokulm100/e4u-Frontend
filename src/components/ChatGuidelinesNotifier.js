import React, { useState } from 'react';

export default function ChatGuidelinesNotifier({ onClose }) {
  const carouselItems = [
    {
      type: 'guideline',
      content: <>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#194983', marginBottom: 8 }}>Stay Safe While Chatting</div>
        <ul style={{ textAlign: 'left', color: '#333', fontSize: 14, margin: '0 0 0 0', paddingLeft: 18 }}>
          <li>Never share <b>OTP</b>, <b>passwords</b>, or make advance payments.</li>
          <li>Meet in safe public locations for transactions.</li>
          <li>Verify products before making any payment.</li>
          <li>Report suspicious or abusive behavior immediately.</li>
        </ul>
      </>
    },
    {
      type: 'warning',
      content: <>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#194983', marginBottom: 8 }}>Warning Signs of Potential Fraud</div>
        <ul style={{ color: '#000000ff', fontSize: 15, marginBottom: 10, minHeight: 32, textAlign: 'left', paddingLeft: 18 }}>
          <li style={{ marginBottom: 6 }}>Prices significantly below market value</li>
          <li style={{ marginBottom: 6 }}>Pressure to make immediate decisions or payments</li>
        </ul>
      </>
    },
    {
      type: 'warning',
      content: <>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#713f12', marginBottom: 8 }}>Warning Signs of Potential Fraud</div>
        <ul style={{ color: '#dd831bff', fontSize: 15, marginBottom: 10, minHeight: 32, textAlign: 'left', paddingLeft: 18 }}>
          <li style={{ marginBottom: 6 }}>Refusal to meet in person or provide additional photos</li>
          <li style={{ marginBottom: 6 }}>Requests for unconventional payment methods</li>
        </ul>
      </>
    },
  ];

  const [carouselIndex, setCarouselIndex] = useState(0);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 20,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '14px 14px 0 0',
          boxShadow: '0 -2px 16px rgba(0,0,0,0.10)',
          maxWidth: 380,
          padding: '1.2rem 1.2rem 1rem 1.2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          margin: '0 auto',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ minHeight: 110, marginBottom: 10, marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {carouselItems[carouselIndex].content}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <button
            aria-label="Previous"
            style={{ background: 'none', border: 'none', color: carouselIndex === 0 ? '#ccc' : '#1976d2', fontSize: 22, cursor: carouselIndex === 0 ? 'not-allowed' : 'pointer' }}
            onClick={() => carouselIndex > 0 && setCarouselIndex(carouselIndex - 1)}
            disabled={carouselIndex === 0}
          >
            &#8592;
          </button>
          <span style={{ fontSize: 13, color: '#888' }}>{carouselIndex + 1} / {carouselItems.length}</span>
          <button
            aria-label="Next"
            style={{ background: 'none', border: 'none', color: carouselIndex === carouselItems.length - 1 ? '#ccc' : '#1976d2', fontSize: 22, cursor: carouselIndex === carouselItems.length - 1 ? 'not-allowed' : 'pointer' }}
            onClick={() => carouselIndex < carouselItems.length - 1 && setCarouselIndex(carouselIndex + 1)}
            disabled={carouselIndex === carouselItems.length - 1}
          >
            &#8594;
          </button>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '0.5rem 1.2rem',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: 15,
            transition: 'background 0.2s',
          }}
          onMouseOver={e => (e.target.style.background = '#1256a0')}
          onMouseOut={e => (e.target.style.background = '#1976d2')}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
