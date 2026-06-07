import React from 'react';
import { ShieldAlert, X } from 'lucide-react';

export default function ChatTrustCaution({ reason, onClose }) {
  if (!reason) return null;

  return (
    <div className="chat-trust-caution">
      <div className="chat-trust-caution-icon">
        <ShieldAlert size={16} />
      </div>
      <div className="chat-trust-caution-body">
        <div className="chat-trust-caution-title">Caution</div>
        <div className="chat-trust-caution-reason">{reason}</div>
      </div>
      {onClose && (
        <button type="button" className="chat-trust-caution-close" onClick={onClose} aria-label="Dismiss">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
