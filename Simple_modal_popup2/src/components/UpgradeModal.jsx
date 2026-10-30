import React, { useState } from 'react';
import Modal from './Modal';

function UpgradeModal({ isOpen, onClose, onUpgraded, onTriggerToast }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const handleUpgrade = () => {
    onTriggerToast('success', '🎉 Congratulations! You have upgraded to Pro Member!');
    if (onUpgraded) onUpgraded('Pro Plan');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade to Pro Studio"
      subtitle="Unlock infinite modal themes, advanced analytics, and custom triggers."
      icon="💎"
      size="lg"
      confirmText="Start 14-Day Free Trial"
      confirmVariant="accent"
      onConfirm={handleUpgrade}
    >
      <div className="upgrade-content">
        <div className="billing-switch-wrapper">
          <span className={billingCycle === 'monthly' ? 'active-cycle' : ''}>Monthly</span>
          <button
            type="button"
            className={`cycle-toggle ${billingCycle === 'annual' ? 'annual-active' : ''}`}
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            aria-label="Toggle annual billing"
          >
            <span className="cycle-toggle-handle"></span>
          </button>
          <span className={billingCycle === 'annual' ? 'active-cycle' : ''}>
            Annual <span className="discount-pill">Save 25%</span>
          </span>
        </div>

        <div className="plans-grid">
          {/* Free Tier */}
          <div
            className={`plan-card ${selectedPlan === 'starter' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('starter')}
          >
            <div className="plan-badge">Basic</div>
            <h4 className="plan-name">Starter</h4>
            <div className="plan-price">
              <span className="price-amount">$0</span>
              <span className="price-freq">/ forever</span>
            </div>
            <p className="plan-desc">Essential dialogs and standard confirm modals for personal demos.</p>
            <ul className="plan-perks">
              <li>✓ Up to 5 Saved Projects</li>
              <li>✓ Basic Confirmation Modals</li>
              <li>✓ Standard Light & Dark Theme</li>
              <li>✓ ESC & Backdrop Dismiss</li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div
            className={`plan-card featured ${selectedPlan === 'pro' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('pro')}
          >
            <div className="plan-badge hot-badge">Most Popular</div>
            <h4 className="plan-name">Pro Studio</h4>
            <div className="plan-price">
              <span className="price-amount">{billingCycle === 'monthly' ? '$9' : '$7'}</span>
              <span className="price-freq">/ month</span>
            </div>
            <p className="plan-desc">Advanced dialog animations, custom layouts, and unlimited workspaces.</p>
            <ul className="plan-perks">
              <li>✓ Unlimited Projects & Tasks</li>
              <li>✓ 3D Flip, Slide & Zoom Animations</li>
              <li>✓ Sound FX & Audio Chimes</li>
              <li>✓ Full User Management & Audit Log</li>
              <li>✓ Priority Developer Support</li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default UpgradeModal;

