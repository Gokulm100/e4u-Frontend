import React from 'react';
import { useApp } from '../context/AppContext';

export function ToastContainer() {
  const { toast } = useApp();
  return (
    <div className="toast-wrap">
      {toast.map(({ id, msg, type }) => (
        <div key={id} className={`toast${type ? ' ' + type : ''}`}>{msg}</div>
      ))}
    </div>
  );
}

export function ModalDialog() {
  const { modal, closeModal } = useApp();
  if (!modal) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal">
        <div className={`modal-icon-badge${typeof modal.icon === 'string' ? ' modal-icon-badge--emoji' : ''}`}>
          {modal.icon}
        </div>
        <div className="modal-title">{modal.title}</div>
        <div className="modal-sub">{modal.sub}</div>
        <div className="modal-btns">
          <button className="modal-cancel" onClick={closeModal}>Cancel</button>
          <button className="modal-confirm" onClick={() => { closeModal(); modal.onConfirm?.(); }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
