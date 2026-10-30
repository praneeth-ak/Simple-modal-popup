import React, { useEffect, useRef } from 'react';
import { soundFx } from '../utils/sound';

/**
 * Reusable, High-Performance Modal Component
 * Built with full accessibility (ARIA, focus management, ESC dismissal, scroll locking)
 */
function Modal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  subtitle = '',
  message = '',
  icon = '✨',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  size = 'md',
  animation = 'scaleUp',
  showFooter = true,
  customFooter = null,
  confirmLoading = false,
  confirmDisabled = false,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  children
}) {
  const modalBoxRef = useRef(null);
  const confirmBtnRef = useRef(null);

  // Manage Escape key, scroll lock, audio chime, and keyboard focus
  useEffect(() => {
    if (!isOpen) return;

    soundFx.playPop();

    const handleKeyDown = (event) => {
      if (closeOnEsc && event.key === 'Escape') {
        event.preventDefault();
        soundFx.playClose();
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Auto-focus primary action or first focusable input
    const timer = setTimeout(() => {
      if (modalBoxRef.current) {
        const autoFocusInput = modalBoxRef.current.querySelector('[data-autofocus="true"]');
        if (autoFocusInput) {
          autoFocusInput.focus();
        } else if (confirmBtnRef.current && !confirmDisabled) {
          confirmBtnRef.current.focus();
        }
      }
    }, 50);

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, closeOnEsc, confirmDisabled]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      soundFx.playClose();
      onClose();
    }
  };

  const handleCloseButtonClick = () => {
    soundFx.playClose();
    onClose();
  };

  const handleConfirmClick = () => {
    if (confirmLoading || confirmDisabled) return;
    if (confirmVariant === 'danger') {
      soundFx.playDanger();
    } else {
      soundFx.playSuccess();
    }
    if (onConfirm) onConfirm();
  };

  // Dynamic CSS classes for variant styling
  const getConfirmBtnClass = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'btn btn-danger';
      case 'success':
        return 'btn btn-success';
      case 'warning':
        return 'btn btn-warning';
      case 'accent':
        return 'btn btn-accent';
      case 'primary':
      default:
        return 'btn btn-primary';
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      data-testid="modal-overlay"
      role="presentation"
    >
      <div
        className={`modal-box modal-${size} anim-${animation}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={message ? 'modal-description' : undefined}
        ref={modalBoxRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrapper">
            {icon && <span className="modal-icon-badge" aria-hidden="true">{icon}</span>}
            <div className="modal-title-text-group">
              <h2 id="modal-title" className="modal-title">
                {title}
              </h2>
              {subtitle && <p className="modal-subtitle">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleCloseButtonClick}
            aria-label="Close dialog"
            title="Press Esc to close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {message && (
            <p id="modal-description" className="modal-text">
              {message}
            </p>
          )}

          {children && <div className="modal-custom-content">{children}</div>}
        </div>

        {/* Modal Footer */}
        {showFooter && (
          <div className="modal-footer">
            {customFooter ? (
              customFooter
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary btn-cancel"
                  onClick={handleCloseButtonClick}
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  className={getConfirmBtnClass()}
                  onClick={handleConfirmClick}
                  ref={confirmBtnRef}
                  disabled={confirmDisabled || confirmLoading}
                >
                  {confirmLoading ? (
                    <span className="btn-spinner-wrapper">
                      <span className="spinner"></span> Processing...
                    </span>
                  ) : (
                    confirmText
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
