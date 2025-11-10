// Simple toast context and hook for global notifications
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'info', duration = 2500) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast global style for mobile responsiveness */}
      <style>{`
        .custom-toast {
          position: fixed;
          top: 32px;
          left: 50%;
          transform: translateX(-50%);
          background: ${toast && toast.type === 'success' ? '#22c55e' : toast && toast.type === 'error' ? '#f33b08' : '#2563eb'};
          color: #fff;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          z-index: 9999;
          min-width: 180px;
          text-align: center;
          letter-spacing: 0.2px;
        }
        @media (max-width: 600px) {
          .custom-toast {
            font-size: 13px;
            padding: 8px 16px;
            min-width: 120px;
          }
        }
      `}</style>
      {toast && (
        <div className="custom-toast">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
