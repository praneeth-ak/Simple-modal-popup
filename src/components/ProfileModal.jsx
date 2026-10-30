import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { updateUserProfile } from '../utils/auth';

function ProfileModal({ isOpen, user, stats, onClose, onUserUpdated, onRequestLogout, onTriggerToast }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setRole(user.role || 'Member');
    }
  }, [user, isOpen]);

  if (!user) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      onTriggerToast('warning', 'Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const updated = updateUserProfile(user.id, {
        name: name.trim(),
        bio: bio.trim(),
        role: role.trim()
      });
      setIsSaving(false);
      if (updated) {
        onUserUpdated(updated);
        onTriggerToast('success', 'Profile updated successfully!');
        onClose();
      }
    }, 300);
  };

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Recent';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile & Settings"
      subtitle="Manage your personal preferences, details, and activity."
      icon={user.avatar || '👤'}
      showFooter={false}
      size="md"
    >
      <div className="profile-modal-content">
        {/* Profile Card Header */}
        <div className="profile-hero-card">
          <div className="profile-avatar-large">{user.avatar || '👤'}</div>
          <div className="profile-hero-info">
            <h3 className="profile-hero-name">{user.name}</h3>
            <p className="profile-hero-email">{user.email}</p>
            <div className="profile-badge-row">
              <span className="badge-tag plan-tag">{user.plan || 'Pro Plan'}</span>
              <span className="badge-tag role-tag">{user.role || 'Member'}</span>
              <span className="badge-tag date-tag">Joined {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="profile-stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats?.totalModalsOpened || 0}</span>
            <span className="stat-label">Modals Triggered</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats?.projectsCount || 0}</span>
            <span className="stat-label">Projects Created</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats?.actionsLogged || 0}</span>
            <span className="stat-label">Actions Logged</span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="profile-edit-form">
          <div className="form-group">
            <label htmlFor="prof-name" className="form-label">
              Display Name
            </label>
            <input
              id="prof-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="prof-role" className="form-label">
              Professional Role
            </label>
            <input
              id="prof-role"
              type="text"
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prof-bio" className="form-label">
              Bio / Note
            </label>
            <textarea
              id="prof-bio"
              className="form-textarea"
              rows="3"
              placeholder="A few words about you..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="profile-action-buttons">
            <button
              type="button"
              className="btn btn-danger-outline"
              onClick={() => {
                onClose();
                onRequestLogout();
              }}
            >
              Sign Out
            </button>
            <div className="profile-right-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ProfileModal;

