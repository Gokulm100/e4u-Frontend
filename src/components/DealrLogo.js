import React from 'react';
import DealrMark from './DealrMark';

export default function DealrLogo({
  variant = 'light',
  size = 'md',
  showTagline = false,
  tagline = 'Deal with the Right App!',
  showMark = false,
  markOnly = false,
  onClick,
  className = '',
}) {
  const Tag = onClick ? 'button' : 'div';
  const markSize = size === 'lg' ? 46 : size === 'sm' ? 30 : 38;
  const showWordmark = !markOnly;

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={`dealr-logo dealr-logo--${variant} dealr-logo--${size}${markOnly ? ' dealr-logo--mark-only' : ''}${onClick ? ' dealr-logo--clickable' : ''} ${className}`.trim()}
      onClick={onClick}
      aria-label={onClick ? 'Go to home' : undefined}
    >
      {showMark && <DealrMark size={markSize} />}
      {showWordmark && (
        <div className="dealr-logo-copy">
          <span className="dealr-wordmark">
            <span className="dealr-wordmark-lead">Dea</span>
            <span className="dealr-wordmark-accent-l">l</span>
            <span className="dealr-wordmark-tail">r</span>
          </span>
          {showTagline && tagline && (
            <span className="dealr-tagline">{tagline}</span>
          )}
        </div>
      )}
    </Tag>
  );
}
