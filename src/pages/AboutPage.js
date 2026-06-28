import React from 'react';
import { Sparkles, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import DealrLogo from '../components/DealrLogo';
import { ABOUT_INTRO, ABOUT_SECTIONS, ABOUT_VALUES, TAGLINE } from '../content/siteInfo';

export default function AboutPage() {
  return (
    <div className="info-page">
      <div className="info-hero">
        <DealrLogo variant="dark" size="md" showMark showTagline tagline={TAGLINE} />
        <h1 className="info-title">About us</h1>
        <p className="info-lead">{ABOUT_INTRO}</p>
      </div>

      <div className="info-highlight-grid">
        <div className="info-highlight">
          <Sparkles size={20} color="var(--primary)" />
          <span>AI-powered seller insights</span>
        </div>
        <div className="info-highlight">
          <ShieldCheck size={20} color="#059669" />
          <span>Trust scores & reviews</span>
        </div>
        <div className="info-highlight">
          <MapPin size={20} color="#d97706" />
          <span>Local deals, real people</span>
        </div>
      </div>

      {ABOUT_SECTIONS.map((section) => (
        <div key={section.title} className="info-card">
          <h2 className="info-card-title">{section.title}</h2>
          <p className="info-card-body">{section.body}</p>
        </div>
      ))}

      <div className="info-card">
        <h2 className="info-card-title">What we believe in</h2>
        <ul className="info-list">
          {ABOUT_VALUES.map((item) => (
            <li key={item}>
              <CheckCircle2 size={16} color="var(--primary)" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
