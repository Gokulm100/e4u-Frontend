
import React, { useState, useEffect } from 'react';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
  const modalStyle = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
    padding: 32,
    maxWidth: 480,
    width: '90vw',
    margin: '20px auto',
    textAlign: 'left',
    position: 'relative',
    zIndex: 2200,
    maxHeight: 'auto',
    height: 'auto',

  };

  // Responsive style for modal width on mobile
  const responsiveModalStyle = {
    ...modalStyle,
    width: 'auto',
    minWidth: 0,
    marginTop: 80,
    maxWidth: '95vw',
    boxSizing: 'border-box',
    height: 'auto',
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.18)',
    zIndex: 2100
  };

  function CollapsibleSection({ title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div style={{ marginTop: 24 }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            background: 'none',
            border: 'none',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            color: '#2563eb',
          }}
          aria-expanded={open}
        >
          {open ? '🔼' : '🔽'} {title}
        </button>
        {open && (
          <div style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7 }}>{children}</div>
        )}
      </div>
    );
  }



export default function ConsentModal({ onConsent, onDecline ,setHasConsented}) {
  const [consentData, setConsentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/api/users/getLatestConsentVersion`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch consent data');
        return res.json();
      })
      .then(data => {
        setConsentData(data?.data||null);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load consent form. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Use responsive style if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  return (
    <div style={overlayStyle}>
      <div style={isMobile ? responsiveModalStyle : modalStyle}>
        <h2 style={{ marginBottom: 18, textAlign: 'center', fontWeight: 700, fontSize: 24 }}>Consent Form</h2>
        {loading && <div style={{ textAlign: 'center', margin: 32 }}>Loading...</div>}
        {error && <div style={{ color: 'red', textAlign: 'center', margin: 32 }}>{error}</div>}
        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
        {consentData && (
          <>
            {consentData.privacyNotice && (
              <CollapsibleSection title="Privacy Notice" defaultOpen={true}>
                <div dangerouslySetInnerHTML={{ __html: consentData.privacyNotice }} />
              </CollapsibleSection>
            )}
            {consentData.termsOfService && (
              <CollapsibleSection title="Terms of Service">
                <div dangerouslySetInnerHTML={{ __html: consentData.termsOfService }} />
              </CollapsibleSection>
            )}
            <div style={{ display: 'flex', gap: 16, marginTop: 32, justifyContent: 'center' }}>
              <button
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: isMobile ? '6px 12px' : '8px 16px',
                  fontWeight: 600,
                  fontSize: isMobile ? 13 : 15,
                  cursor: 'pointer',
                  minWidth: isMobile ? 90 : 120
                }}
                onClick={onConsent}
              >
                Accept and Continue
              </button>
              <button
                style={{
                  background: '#eee',
                  color: '#333',
                  border: 'none',
                  borderRadius: 6,
                  padding: isMobile ? '6px 12px' : '8px 16px',
                  fontWeight: 500,
                  fontSize: isMobile ? 13 : 15,
                  cursor: 'pointer',
                  minWidth: isMobile ? 70 : 100
                }}
                onClick={onDecline}
              >
                Decline
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
