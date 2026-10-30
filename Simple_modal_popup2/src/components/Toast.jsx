import React, { useEffect } from 'react';

function Toast({ toasts, onDismiss }) {
  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setInterval(() => {
      const now = Date.now();
      toasts.forEach((t) => {
        if (now - t.timestamp > 4500) {
          onDismiss(t.id);
        }
      });
    }, 500);

    return () => clearInterval(timer);
  }, [toasts, onDismiss]);

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'danger':
      case 'error':
        return '🚫';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
      default:
        return '✨';
    }
  };

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type || 'info'}`}>
          <span className="toast-icon">{getIcon(toast.type)}</span>
          <div className="toast-content">
            <p className="toast-message">{toast.message}</p>
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss toast"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toast;

