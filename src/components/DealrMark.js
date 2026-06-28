import React from 'react';

export default function DealrMark({ size = 36, className = '' }) {
  return (
    <span
      className={`dealr-mark-wrap ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <img
        src="/app-mark.png"
        alt=""
        width={size}
        height={size}
        className="dealr-mark-img"
      />
    </span>
  );
}
