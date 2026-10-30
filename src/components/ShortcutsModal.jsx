import React from 'react';
import Modal from './Modal';

function ShortcutsModal({ isOpen, onClose }) {
  const shortcuts = [
    { key: 'Esc', desc: 'Dismiss any open modal dialog' },
    { key: '?', desc: 'Show this keyboard shortcuts guide' },
    { key: 'L', desc: 'Open Sign In / Register dialog (when logged out)' },
    { key: 'P', desc: 'Open User Profile dialog (when logged in)' },
    { key: 'N', desc: 'Quickly open New Project creator modal' },
    { key: 'T', desc: 'Toggle Dark / Light theme instantly' },
    { key: 'S', desc: 'Toggle subtle audio feedback sound effects' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      subtitle="Supercharge your workflow with instant hotkeys."
      icon="⌨️"
      size="sm"
      cancelText="Close Guide"
      confirmText="Got It!"
      confirmVariant="primary"
      onConfirm={onClose}
    >
      <div className="shortcuts-list">
        {shortcuts.map((sc) => (
          <div key={sc.key} className="shortcut-row">
            <kbd className="shortcut-key">{sc.key}</kbd>
            <span className="shortcut-desc">{sc.desc}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default ShortcutsModal;

