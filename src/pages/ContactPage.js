import React from 'react';
import { Mail, MessageCircle, Shield, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  SUPPORT_EMAIL,
  CONTACT_INTRO,
  CONTACT_TOPICS,
} from '../content/siteInfo';

export default function ContactPage() {
  const { navigate } = useApp();

  return (
    <div className="info-page">
      <div className="info-hero info-hero--compact">
        <h1 className="info-title">Contact us</h1>
        <p className="info-lead">{CONTACT_INTRO}</p>
      </div>

      <a className="info-contact-card" href={`mailto:${SUPPORT_EMAIL}`}>
        <div className="info-contact-icon">
          <Mail size={22} color="var(--primary)" />
        </div>
        <div>
          <div className="info-contact-label">Email us</div>
          <div className="info-contact-value">{SUPPORT_EMAIL}</div>
          <div className="info-contact-hint">Tap to open your email app</div>
        </div>
      </a>

      <div className="info-note">
        <Clock size={16} color="#64748b" />
        <span>We typically respond within 1–2 business days.</span>
      </div>

      <div className="info-card">
        <h2 className="info-card-title">How can we help?</h2>
        <div className="info-topic-list">
          {CONTACT_TOPICS.map((topic) => (
            <div key={topic.label} className="info-topic">
              <div className="info-topic-label">{topic.label}</div>
              <div className="info-topic-detail">{topic.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-card info-card--soft">
        <div className="info-inline-actions">
          <button type="button" className="info-link-btn" onClick={() => navigate('messages')}>
            <MessageCircle size={16} />
            Open messages
          </button>
          <button type="button" className="info-link-btn" onClick={() => navigate('consent')}>
            <Shield size={16} />
            Privacy & terms
          </button>
        </div>
      </div>
    </div>
  );
}
