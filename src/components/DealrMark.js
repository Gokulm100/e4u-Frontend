import React from 'react';

export default function DealrMark({ size = 36, className = '' }) {
  return (
    <img
      src="/icon-512.png"
      alt=""
      width={size}
      height={size}
      className={`dealr-mark-img ${className}`.trim()}
      aria-hidden
    />
  );
}
