import React from 'react';

// Single shimmering block. Width/height can be passed via style.
function Block({ className = '', style }) {
  return <div className={`skel ${className}`} style={style} aria-hidden="true" />;
}

// Mirrors AdCard for the home/listing grid.
export function SkeletonAdCard() {
  return (
    <div className="skel-card" aria-hidden="true">
      <Block className="skel-card-media" />
      <div className="skel-card-body">
        <Block style={{ width: '85%', height: 14 }} />
        <Block style={{ width: '45%', height: 18 }} />
        <Block style={{ width: '60%', height: 12, marginTop: 2 }} />
      </div>
    </div>
  );
}

// Mirrors the My Ads row.
export function SkeletonMyAdRow() {
  return (
    <div className="my-ad-row" aria-hidden="true">
      <Block className="my-ad-img" />
      <div className="my-ad-info" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Block style={{ width: '55%', height: 15 }} />
        <Block style={{ width: '30%', height: 16 }} />
        <Block style={{ width: '70%', height: 12 }} />
        <Block style={{ width: 70, height: 18, borderRadius: 999, marginTop: 2 }} />
      </div>
      <div className="my-ad-actions">
        <Block style={{ width: 70, height: 30, borderRadius: 8 }} />
        <Block style={{ width: 70, height: 30, borderRadius: 8 }} />
        <Block style={{ width: 70, height: 30, borderRadius: 8 }} />
      </div>
    </div>
  );
}

// Mirrors a conversation row in the Messages list.
export function SkeletonChatRow() {
  return (
    <div className="chat-row" aria-hidden="true">
      <div className="chat-avatar-wrap">
        <Block className="skel-avatar" />
      </div>
      <div className="chat-info" style={{ flex: 1 }}>
        <div className="chat-header-row" style={{ justifyContent: 'space-between' }}>
          <Block style={{ width: '45%', height: 14 }} />
          <Block style={{ width: 36, height: 11 }} />
        </div>
        <Block style={{ width: '30%', height: 12, margin: '8px 0' }} />
        <Block style={{ width: '70%', height: 13 }} />
      </div>
    </div>
  );
}

// A single chat message bubble placeholder.
export function SkeletonBubble({ align = 'left', width = '55%', height = 38 }) {
  return (
    <div
      className={`skel skel-bubble${align === 'right' ? ' me' : ''}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

// Default conversation skeleton: an alternating pattern of bubbles.
const BUBBLES = [
  { align: 'left', width: '55%', height: 38 },
  { align: 'left', width: '38%', height: 38 },
  { align: 'right', width: '62%', height: 54 },
  { align: 'left', width: '70%', height: 38 },
  { align: 'right', width: '45%', height: 38 },
  { align: 'right', width: '52%', height: 38 },
  { align: 'left', width: '48%', height: 54 },
  { align: 'right', width: '40%', height: 38 },
];

export function SkeletonConversation() {
  return (
    <>
      {BUBBLES.map((b, i) => (
        <SkeletonBubble key={i} align={b.align} width={b.width} height={b.height} />
      ))}
    </>
  );
}
