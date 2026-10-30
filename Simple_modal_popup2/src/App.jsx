import React, { useState, useEffect, useRef } from 'react';
import Modal from './components/Modal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import ShortcutsModal from './components/ShortcutsModal';
import UpgradeModal from './components/UpgradeModal';
import Toast from './components/Toast';
import { getActiveUser, logoutUser, authenticateUser } from './utils/auth';
import { soundFx } from './utils/sound';
import './App.css';

// Initial pre-loaded sample projects
const INITIAL_PROJECTS = [
  {
    id: 'proj_1',
    name: 'Modern SaaS Modal Engine',
    category: 'Development',
    priority: 'High',
    completed: true,
    createdAt: '2026-10-28'
  },
  {
    id: 'proj_2',
    name: 'Accessibility (WCAG 2.1) Audit',
    category: 'Design',
    priority: 'Medium',
    completed: false,
    createdAt: '2026-10-29'
  },
  {
    id: 'proj_3',
    name: 'User Authentication Flow with JWT',
    category: 'Security',
    priority: 'High',
    completed: false,
    createdAt: '2026-10-30'
  }
];

function App() {
  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('modalcraft_theme') || 'dark';
  });

  // Sound effects toggle state
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('modalcraft_sound');
    return saved !== null ? saved === 'true' : true;
  });

  // Active user session
  const [currentUser, setCurrentUser] = useState(() => getActiveUser());
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Active Modal: null | 'confirm' | 'danger' | 'project-form' | 'feedback' | 'auth' | 'profile' | 'shortcuts' | 'upgrade' | 'logout-confirm' | 'custom-preview'
  const [activeModal, setActiveModal] = useState(null);
  const [authInitialMode, setAuthInitialMode] = useState('login');

  // Interactive Project Management State
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('modalcraft_projects');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });
  const [projectFilter, setProjectFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // Form states for Create Project modal
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('Development');
  const [newProjectPriority, setNewProjectPriority] = useState('Medium');
  const [projectInputError, setProjectInputError] = useState('');

  // Form state for Danger modal (item to delete)
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteTypedConfirm, setDeleteTypedConfirm] = useState('');

  // Form state for Feedback modal
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  // Customizer / Playground state
  const [customAnim, setCustomAnim] = useState('scaleUp');
  const [customSize, setCustomSize] = useState('md');
  const [customVariant, setCustomVariant] = useState('primary');

  // Live Activity Log
  const [activityLogs, setActivityLogs] = useState(() => {
    return [
      { id: 1, text: 'ModalCraft workspace loaded', time: 'Just now', type: 'info' }
    ];
  });

  // Toast notifications list
  const [toasts, setToasts] = useState([]);

  // Stats counter
  const [stats, setStats] = useState(() => {
    try {
      const raw = localStorage.getItem('modalcraft_stats');
      return raw ? JSON.parse(raw) : { totalModalsOpened: 6, actionsLogged: 12 };
    } catch {
      return { totalModalsOpened: 6, actionsLogged: 12 };
    }
  });

  const dropdownRef = useRef(null);

  // Sync sound setting
  useEffect(() => {
    soundFx.enabled = soundEnabled;
    localStorage.setItem('modalcraft_sound', String(soundEnabled));
  }, [soundEnabled]);

  // Apply Theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('modalcraft_theme', theme);
  }, [theme]);

  // Save projects to localStorage
  useEffect(() => {
    localStorage.setItem('modalcraft_projects', JSON.stringify(projects));
  }, [projects]);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('modalcraft_stats', JSON.stringify(stats));
  }, [stats]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      // Ignore if user is currently typing in an input/textarea
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === '?') {
        e.preventDefault();
        openModal('shortcuts');
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        handleToggleTheme();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setSoundEnabled((prev) => !prev);
      } else if (e.key === 'l' || e.key === 'L') {
        if (!currentUser) {
          e.preventDefault();
          handleOpenAuth('login');
        }
      } else if (e.key === 'p' || e.key === 'P') {
        if (currentUser) {
          e.preventDefault();
          openModal('profile');
        }
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        openModal('project-form');
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [currentUser, activeModal]);

  // Helper: Trigger Toast Notification
  const addToast = (type, message) => {
    const newToast = {
      id: 'toast_' + Date.now() + Math.random(),
      type,
      message,
      timestamp: Date.now()
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
  };

  // Helper: Log Activity
  const logActivity = (text, type = 'info') => {
    const newLog = {
      id: Date.now() + Math.random(),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    setStats((prev) => ({ ...prev, actionsLogged: prev.actionsLogged + 1 }));
  };

  // Modal Control
  const openModal = (modalName) => {
    setActiveModal(modalName);
    setStats((prev) => ({ ...prev, totalModalsOpened: prev.totalModalsOpened + 1 }));
    logActivity(`Opened dialog: ${modalName}`, 'info');
  };

  const closeModal = () => {
    setActiveModal(null);
    setDeleteTypedConfirm('');
    setProjectInputError('');
  };

  const handleToggleTheme = () => {
    soundFx.playPop();
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    addToast('info', `Switched to ${nextTheme} theme`);
    logActivity(`Theme changed to ${nextTheme}`);
  };

  // Auth Handlers
  const handleOpenAuth = (mode = 'login') => {
    setAuthInitialMode(mode);
    openModal('auth');
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    logActivity(`User signed in: ${user.name}`, 'success');
  };

  const handleQuickDemoLogin = () => {
    soundFx.playSuccess();
    const res = authenticateUser('alex.morgan@example.com', 'password123');
    if (res.success) {
      setCurrentUser(res.user);
      addToast('success', `Signed in as Demo User (${res.user.name})!`);
      logActivity('Quick demo sign in executed', 'success');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setUserDropdownOpen(false);
    closeModal();
    soundFx.playClose();
    addToast('info', 'You have been safely signed out.');
    logActivity('User signed out', 'info');
  };

  // Project Actions
  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      setProjectInputError('Please enter a project title.');
      return;
    }
    const newProj = {
      id: 'proj_' + Date.now(),
      name: newProjectName.trim(),
      category: newProjectCategory,
      priority: newProjectPriority,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects([newProj, ...projects]);
    setNewProjectName('');
    setProjectInputError('');
    closeModal();
    addToast('success', `Project "${newProj.name}" created!`);
    logActivity(`Created project "${newProj.name}"`, 'success');
  };

  const handleToggleProject = (id) => {
    soundFx.playPop();
    setProjects(
      projects.map((p) => {
        if (p.id === id) {
          const nextState = !p.completed;
          logActivity(`Project "${p.name}" marked ${nextState ? 'Completed' : 'Active'}`);
          return { ...p, completed: nextState };
        }
        return p;
      })
    );
  };

  const promptDeleteProject = (proj) => {
    setProjectToDelete(proj);
    setDeleteTypedConfirm('');
    openModal('danger');
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) {
      closeModal();
      return;
    }
    setProjects(projects.filter((p) => p.id !== projectToDelete.id));
    addToast('danger', `Permanently deleted "${projectToDelete.name}"`);
    logActivity(`Deleted project: ${projectToDelete.name}`, 'danger');
    setProjectToDelete(null);
    closeModal();
  };

  // Feedback Submission
  const handleSubmitFeedback = () => {
    closeModal();
    addToast('success', `Thank you for rating us ${feedbackRating} stars! 🌟`);
    logActivity(`Feedback submitted: ${feedbackRating} stars`, 'success');
    setFeedbackComment('');
  };

  // Filtered projects list
  const filteredProjects = projects.filter((p) => {
    if (projectFilter === 'active') return !p.completed;
    if (projectFilter === 'completed') return p.completed;
    return true;
  });

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* TOP HEADER / NAVBAR */}
      <header className="navbar">
        <div className="navbar-container">
          {/* Brand Logo */}
          <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="brand-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <circle cx="7.5" cy="6" r="1" fill="currentColor"></circle>
                <circle cx="11.5" cy="6" r="1" fill="currentColor"></circle>
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-title">ModalCraft</span>
              <span className="brand-tag">Studio v2.5</span>
            </div>
          </div>

          {/* Center Navigation Shortcuts */}
          <nav className="nav-links">
            <a href="#showcase" className="nav-link">Showcase</a>
            <a href="#workspace" className="nav-link">Workspace ({projects.length})</a>
            <a href="#customizer" className="nav-link">Playground</a>
            <a href="#activity" className="nav-link">Audit Log</a>
          </nav>

          {/* Right Utilities & Auth Profile Area */}
          <div className="navbar-actions">
            {/* Audio chime toggle */}
            <button
              type="button"
              className={`icon-button ${soundEnabled ? 'active' : ''}`}
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                addToast('info', soundEnabled ? 'Muted sound effects' : 'Sound effects enabled');
              }}
              title={soundEnabled ? 'Sound Effects: ON (Press S)' : 'Sound Effects: OFF (Press S)'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? '🔔' : '🔕'}
            </button>

            {/* Shortcuts guide button */}
            <button
              type="button"
              className="icon-button"
              onClick={() => openModal('shortcuts')}
              title="Keyboard Shortcuts (Press ?)"
              aria-label="Keyboard Shortcuts"
            >
              ⌨️
            </button>

            {/* Theme switcher button */}
            <button
              type="button"
              className="theme-pill-btn"
              onClick={handleToggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode (Press T)`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>

            {/* User Auth Section */}
            {currentUser ? (
              <div className="user-profile-menu" ref={dropdownRef}>
                <button
                  type="button"
                  className="user-profile-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                >
                  <span className="user-avatar-badge">{currentUser.avatar || '👨‍💻'}</span>
                  <span className="user-name-label">{currentUser.name.split(' ')[0]}</span>
                  <span className="user-role-badge">PRO</span>
                  <span className="dropdown-arrow">▾</span>
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown-panel anim-scaleUp">
                    <div className="dropdown-user-header">
                      <p className="dropdown-user-fullname">{currentUser.name}</p>
                      <p className="dropdown-user-email">{currentUser.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openModal('profile');
                      }}
                    >
                      <span className="dropdown-icon">👤</span> Profile &amp; Settings
                    </button>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openModal('upgrade');
                      }}
                    >
                      <span className="dropdown-icon">💎</span> Membership Plan
                    </button>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openModal('project-form');
                      }}
                    >
                      <span className="dropdown-icon">➕</span> Create New Project
                    </button>
                    <div className="dropdown-divider"></div>
                    <button
                      type="button"
                      className="dropdown-item dropdown-item-danger"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openModal('logout-confirm');
                      }}
                    >
                      <span className="dropdown-icon">🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons-group">
                <button
                  type="button"
                  className="btn btn-subtle-outline"
                  onClick={() => handleOpenAuth('login')}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleOpenAuth('register')}
                >
                  Register
                </button>
                <button
                  type="button"
                  className="btn btn-accent btn-sm quick-demo-btn"
                  onClick={handleQuickDemoLogin}
                  title="Test account in 1 click!"
                >
                  ⚡ Demo Login
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <span className="pulsing-dot"></span> Production-Ready Dialogs &amp; User Auth Engine
          </div>

          <h1 className="hero-main-title">
            Craft Extraordinary Modals &amp; Interactive Popups
          </h1>

          <p className="hero-subtitle">
            A fully responsive, keyboard-accessible dialog architecture featuring complete
            user authentication, project management, customizable transitions, and
            delightful micro-interactions.
          </p>

          <div className="hero-action-buttons">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => openModal('confirm')}
            >
              <span>⚡ Open Confirm Modal</span>
            </button>

            <button
              type="button"
              className="btn btn-accent btn-lg"
              onClick={() => openModal('project-form')}
            >
              <span>➕ Create Project Modal</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => openModal('shortcuts')}
            >
              <span>⌨️ Shortcuts Guide</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="quick-metrics-bar">
            <div className="metric-pill">
              <span className="metric-icon">🛡️</span>
              <span className="metric-text">WCAG 2.1 Focus Trap</span>
            </div>
            <div className="metric-pill">
              <span className="metric-icon">⌨️</span>
              <span className="metric-text">Escape Key Dismissal</span>
            </div>
            <div className="metric-pill">
              <span className="metric-icon">🔒</span>
              <span className="metric-text">Scroll-Lock Engine</span>
            </div>
            <div className="metric-pill">
              <span className="metric-icon">🚀</span>
              <span className="metric-text">0 Extra UI Dependencies</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: MODAL SHOWCASE GALLERY */}
      <section id="showcase" className="content-section">
        <div className="section-header">
          <span className="section-eyebrow">Interactive Gallery</span>
          <h2 className="section-title">Modal Variations &amp; Proper Buttons</h2>
          <p className="section-description">
            Test different dialog archetypes built with consistent button hierarchy, proper color contrast,
            and specialized UX states.
          </p>
        </div>

        <div className="showcase-grid">
          {/* Card 1: Standard Confirmation */}
          <div className="showcase-card">
            <div className="card-badge-header">
              <span className="card-type-tag info">Confirmation</span>
              <span className="card-icon">⚡</span>
            </div>
            <h3 className="card-title">Standard Action Confirmation</h3>
            <p className="card-description">
              Clean dialog asking the user to confirm a safe action. Features primary CTA and secondary cancel.
            </p>
            <div className="card-action">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => openModal('confirm')}
              >
                Trigger Confirm Modal
              </button>
            </div>
          </div>

          {/* Card 2: Destructive / Danger Modal */}
          <div className="showcase-card">
            <div className="card-badge-header">
              <span className="card-type-tag danger">Destructive</span>
              <span className="card-icon">🗑️</span>
            </div>
            <h3 className="card-title">Destructive Action Modal</h3>
            <p className="card-description">
              High-visibility warning dialog with typed verification to safeguard against accidental data loss.
            </p>
            <div className="card-action">
              <button
                type="button"
                className="btn btn-danger-outline btn-block"
                onClick={() => {
                  setProjectToDelete({ name: 'Production Database Cluster' });
                  openModal('danger');
                }}
              >
                Trigger Danger Modal
              </button>
            </div>
          </div>

          {/* Card 3: Form Input Modal */}
          <div className="showcase-card">
            <div className="card-badge-header">
              <span className="card-type-tag accent">Form / Input</span>
              <span className="card-icon">📝</span>
            </div>
            <h3 className="card-title">Task &amp; Project Creator</h3>
            <p className="card-description">
              Custom child slot modal hosting interactive text inputs, category selectors, and priority chips.
            </p>
            <div className="card-action">
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() => openModal('project-form')}
              >
                Trigger Form Modal
              </button>
            </div>
          </div>

          {/* Card 4: User Authentication Modal */}
          <div className="showcase-card">
            <div className="card-badge-header">
              <span className="card-type-tag warning">Authentication</span>
              <span className="card-icon">🔐</span>
            </div>
            <h3 className="card-title">Auth Dialog (Login &amp; Register)</h3>
            <p className="card-description">
              Tabbed modal with form validation, password visibility toggle, avatar picker, and quick demo login.
            </p>
            <div className="card-action">
              <div className="button-group-split">
                <button
                  type="button"
                  className="btn btn-subtle-outline"
                  onClick={() => handleOpenAuth('login')}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleOpenAuth('register')}
                >
                  Register
                </button>
              </div>
            </div>
          </div>

          {/* Card 5: Pro Membership Upgrade Modal */}
          <div className="showcase-card">
            <div className="card-badge-header">
              <span className="card-type-tag success">Pricing</span>
              <span className="card-icon">💎</span>
            </div>
            <h3 className="card-title">Subscription &amp; Upgrade</h3>
            <p className="card-description">
              Multi-column pricing comparison modal with monthly/annual toggle and feature checklist.
            </p>
            <div className="card-action">
              <button
                type="button"
                className="btn btn-accent-outline btn-block"
                onClick={() => openModal('upgrade')}
              >
                Trigger Upgrade Modal
              </button>
            </div>
          </div>

          {/* Card 6: Interactive Feedback Modal */}
          <div className="showcase-card">
            <div className="card-badge-header">
              <span className="card-type-tag neutral">Feedback</span>
              <span className="card-icon">⭐</span>
            </div>
            <h3 className="card-title">User Rating &amp; Review</h3>
            <p className="card-description">
              Interactive 5-star rating selector and feedback textarea for capturing qualitative user sentiment.
            </p>
            <div className="card-action">
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() => openModal('feedback')}
              >
                Trigger Feedback Modal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WORKSPACE & PROJECT MANAGER */}
      <section id="workspace" className="content-section">
        <div className="section-header-split">
          <div>
            <span className="section-eyebrow">Active Workspace</span>
            <h2 className="section-title">Saved Projects &amp; Tasks</h2>
            <p className="section-description">
              Created items are managed through our Form Modal and stored persistently in localStorage.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openModal('project-form')}
          >
            ➕ New Project (N)
          </button>
        </div>

        {/* Project Filter Tabs */}
        <div className="workspace-controls-bar">
          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill ${projectFilter === 'all' ? 'active' : ''}`}
              onClick={() => setProjectFilter('all')}
            >
              All ({projects.length})
            </button>
            <button
              type="button"
              className={`filter-pill ${projectFilter === 'active' ? 'active' : ''}`}
              onClick={() => setProjectFilter('active')}
            >
              Active ({projects.filter((p) => !p.completed).length})
            </button>
            <button
              type="button"
              className={`filter-pill ${projectFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setProjectFilter('completed')}
            >
              Completed ({projects.filter((p) => p.completed).length})
            </button>
          </div>

          <span className="workspace-counter">
            Showing {filteredProjects.length} items
          </span>
        </div>

        {/* Project Items Grid */}
        {filteredProjects.length === 0 ? (
          <div className="empty-workspace-card">
            <span className="empty-icon">📂</span>
            <h3>No projects found in this view</h3>
            <p>Click below to open the modal and create a new project right now.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => openModal('project-form')}
            >
              Create New Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className={`project-card ${proj.completed ? 'is-completed' : ''}`}
              >
                <div className="project-card-top">
                  <span className={`priority-tag priority-${proj.priority?.toLowerCase()}`}>
                    {proj.priority || 'Medium'} Priority
                  </span>
                  <span className="category-pill">{proj.category || 'General'}</span>
                </div>

                <h4 className="project-title">{proj.name}</h4>

                <div className="project-meta-row">
                  <span className="project-date">📅 {proj.createdAt}</span>
                  <span className={`status-pill ${proj.completed ? 'done' : 'progress'}`}>
                    {proj.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                <div className="project-card-footer">
                  <button
                    type="button"
                    className={`btn btn-xs ${proj.completed ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => handleToggleProject(proj.id)}
                  >
                    {proj.completed ? '↩ Mark Incomplete' : '✓ Mark Complete'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs btn-danger-ghost"
                    onClick={() => promptDeleteProject(proj)}
                    title="Delete Project via Danger Modal"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3: MODAL CUSTOMIZER PLAYGROUND */}
      <section id="customizer" className="content-section">
        <div className="section-header">
          <span className="section-eyebrow">Playground Engine</span>
          <h2 className="section-title">Modal Customizer &amp; Live Tester</h2>
          <p className="section-description">
            Experiment with animations, dialog sizes, and button variants in real-time.
          </p>
        </div>

        <div className="customizer-box">
          <div className="customizer-controls">
            <div className="custom-control-group">
              <label className="control-label">Animation Style</label>
              <div className="choice-chip-row">
                {[
                  { id: 'scaleUp', label: 'Scale Up' },
                  { id: 'slideUp', label: 'Slide Up' },
                  { id: 'flipIn', label: '3D Flip' },
                  { id: 'fadeIn', label: 'Gentle Fade' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`choice-chip ${customAnim === item.id ? 'active' : ''}`}
                    onClick={() => setCustomAnim(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="custom-control-group">
              <label className="control-label">Dialog Size</label>
              <div className="choice-chip-row">
                {[
                  { id: 'sm', label: 'Small (380px)' },
                  { id: 'md', label: 'Medium (500px)' },
                  { id: 'lg', label: 'Large (680px)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`choice-chip ${customSize === item.id ? 'active' : ''}`}
                    onClick={() => setCustomSize(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="custom-control-group">
              <label className="control-label">Confirm Button Theme</label>
              <div className="choice-chip-row">
                {[
                  { id: 'primary', label: 'Primary Indigo' },
                  { id: 'accent', label: 'Cyan Accent' },
                  { id: 'success', label: 'Success Emerald' },
                  { id: 'danger', label: 'Danger Crimson' },
                  { id: 'warning', label: 'Warning Amber' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`choice-chip ${customVariant === item.id ? 'active' : ''}`}
                    onClick={() => setCustomVariant(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="customizer-preview-action">
            <div className="preview-spec-badge">
              Active Config: <code>{customAnim}</code> • <code>{customSize}</code> • <code>{customVariant}</code>
            </div>
            <button
              type="button"
              className={`btn btn-${customVariant} btn-lg`}
              onClick={() => openModal('custom-preview')}
            >
              🚀 Launch Configured Modal
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: REAL-TIME AUDIT LOG FEED */}
      <section id="activity" className="content-section">
        <div className="section-header-split">
          <div>
            <span className="section-eyebrow">Real-Time Telemetry</span>
            <h2 className="section-title">Modal Event &amp; Audit Log</h2>
            <p className="section-description">
              Monitors focus trap transitions, user auth sessions, and modal closures in real-time.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setActivityLogs([])}
          >
            Clear Activity Log
          </button>
        </div>

        <div className="audit-log-container">
          {activityLogs.length === 0 ? (
            <p className="no-logs-text">Log cleared. Open or close any modal to record new events.</p>
          ) : (
            <ul className="audit-log-list">
              {activityLogs.map((log) => (
                <li key={log.id} className="audit-log-item">
                  <span className={`log-indicator dot-${log.type}`}></span>
                  <span className="log-text">{log.text}</span>
                  <span className="log-time">{log.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-brand-title">ModalCraft Studio</span>
            <p className="footer-tagline">
              Modern, accessible, performant React 18 dialog engine.
            </p>
          </div>
          <div className="footer-links">
            <button type="button" className="footer-link-btn" onClick={() => openModal('shortcuts')}>
              Keyboard Shortcuts (?)
            </button>
            <button type="button" className="footer-link-btn" onClick={() => openModal('feedback')}>
              Rate Experience
            </button>
            <button type="button" className="footer-link-btn" onClick={() => handleOpenAuth('login')}>
              Account Sign In
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ModalCraft UI. Built with React.js 18, CSS3, &amp; Vite.</p>
        </div>
      </footer>

      {/* ========================================================
          ACTIVE MODAL PORTALS & DIALOGS
          ======================================================== */}

      {/* 1. Standard Confirmation Modal */}
      <Modal
        isOpen={activeModal === 'confirm'}
        onClose={closeModal}
        onConfirm={() => {
          closeModal();
          addToast('success', 'Action confirmed successfully! Everything is up to date.');
          logActivity('Confirmed standard modal action', 'success');
        }}
        title="Confirm Operation"
        subtitle="Please review before proceeding with this task."
        message="Are you sure you want to proceed? You can dismiss anytime using the Escape key or clicking outside the modal."
        icon="✨"
        confirmText="Yes, Proceed"
        cancelText="Cancel"
        confirmVariant="primary"
      />

      {/* 2. Destructive Danger / Delete Modal */}
      <Modal
        isOpen={activeModal === 'danger'}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title="Delete Permanently"
        subtitle="This operation cannot be undone."
        message={
          projectToDelete
            ? `You are about to delete "${projectToDelete.name}". All associated files and settings will be permanently lost.`
            : 'Are you sure you wish to delete this resource permanently?'
        }
        icon="⚠️"
        confirmText="Permanently Delete"
        cancelText="Keep Safe"
        confirmVariant="danger"
        confirmDisabled={deleteTypedConfirm.trim().toUpperCase() !== 'DELETE'}
      >
        <div className="danger-modal-safeguard">
          <p className="safeguard-instruction">
            To prevent accidental deletion, type <strong>DELETE</strong> below:
          </p>
          <input
            type="text"
            className="form-input form-input-danger"
            placeholder='Type "DELETE" to confirm'
            value={deleteTypedConfirm}
            onChange={(e) => setDeleteTypedConfirm(e.target.value)}
            data-autofocus="true"
          />
        </div>
      </Modal>

      {/* 3. Form Input / Project Creator Modal */}
      <Modal
        isOpen={activeModal === 'project-form'}
        onClose={closeModal}
        onConfirm={handleCreateProject}
        title="Create New Project"
        subtitle="Add a new project or task to your local workspace."
        icon="📝"
        confirmText="Create Project"
        cancelText="Cancel"
        confirmVariant="primary"
      >
        <div className="project-form-container">
          <div className="form-group">
            <label htmlFor="modal-project-title" className="form-label">
              Project Title *
            </label>
            <input
              id="modal-project-title"
              type="text"
              className="form-input"
              placeholder="e.g., E-Commerce Checkout Modal"
              value={newProjectName}
              onChange={(e) => {
                setNewProjectName(e.target.value);
                if (projectInputError) setProjectInputError('');
              }}
              data-autofocus="true"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreateProject();
                }
              }}
            />
            {projectInputError && (
              <span className="form-error-hint">{projectInputError}</span>
            )}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="modal-project-cat" className="form-label">
                Category
              </label>
              <select
                id="modal-project-cat"
                className="form-select"
                value={newProjectCategory}
                onChange={(e) => setNewProjectCategory(e.target.value)}
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Security">Security</option>
                <option value="Testing">Testing</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="modal-project-pri" className="form-label">
                Priority
              </label>
              <select
                id="modal-project-pri"
                className="form-select"
                value={newProjectPriority}
                onChange={(e) => setNewProjectPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* 4. User Authentication Modal (Login & Register) */}
      <AuthModal
        isOpen={activeModal === 'auth'}
        initialMode={authInitialMode}
        onClose={closeModal}
        onAuthSuccess={handleAuthSuccess}
        onTriggerToast={addToast}
      />

      {/* 5. User Profile & Settings Modal */}
      <ProfileModal
        isOpen={activeModal === 'profile'}
        user={currentUser}
        stats={{
          totalModalsOpened: stats.totalModalsOpened,
          projectsCount: projects.length,
          actionsLogged: stats.actionsLogged
        }}
        onClose={closeModal}
        onUserUpdated={(u) => setCurrentUser(u)}
        onRequestLogout={() => openModal('logout-confirm')}
        onTriggerToast={addToast}
      />

      {/* 6. Logout Confirmation Modal */}
      <Modal
        isOpen={activeModal === 'logout-confirm'}
        onClose={closeModal}
        onConfirm={handleLogout}
        title="Sign Out of ModalCraft"
        subtitle="You can sign back in anytime."
        message={`Are you sure you want to log out, ${currentUser?.name || 'User'}? Your local projects will stay safely stored.`}
        icon="🚪"
        confirmText="Yes, Sign Out"
        cancelText="Stay Signed In"
        confirmVariant="danger"
      />

      {/* 7. Keyboard Shortcuts Guide Modal */}
      <ShortcutsModal
        isOpen={activeModal === 'shortcuts'}
        onClose={closeModal}
      />

      {/* 8. Pro Upgrade Modal */}
      <UpgradeModal
        isOpen={activeModal === 'upgrade'}
        onClose={closeModal}
        onUpgraded={(newPlan) => {
          if (currentUser) {
            setCurrentUser({ ...currentUser, plan: newPlan });
          }
        }}
        onTriggerToast={addToast}
      />

      {/* 9. Feedback Rating Modal */}
      <Modal
        isOpen={activeModal === 'feedback'}
        onClose={closeModal}
        onConfirm={handleSubmitFeedback}
        title="How was your experience?"
        subtitle="We appreciate your thoughts and ideas."
        icon="⭐"
        confirmText="Submit Feedback"
        cancelText="Cancel"
        confirmVariant="primary"
      >
        <div className="feedback-modal-content">
          <div className="star-rating-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${feedbackRating >= star ? 'active' : ''}`}
                onClick={() => setFeedbackRating(star)}
                aria-label={`Rate ${star} stars`}
              >
                ★
              </button>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="fb-comment" className="form-label">
              Comments or Feature Requests
            </label>
            <textarea
              id="fb-comment"
              className="form-textarea"
              rows="3"
              placeholder="Tell us what you liked or what modal styles you need..."
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* 10. Customizer Live Preview Modal */}
      <Modal
        isOpen={activeModal === 'custom-preview'}
        onClose={closeModal}
        onConfirm={() => {
          closeModal();
          addToast('success', 'Custom modal action executed successfully!');
        }}
        title="Custom Configured Dialog"
        subtitle={`Animated with ${customAnim} • ${customSize.toUpperCase()} Size`}
        message="This modal was generated dynamically according to your custom playground parameters! Notice the custom entrance animation and button variant."
        icon="🎨"
        confirmText="Confirm Action"
        cancelText="Dismiss"
        confirmVariant={customVariant}
        animation={customAnim}
        size={customSize}
      />
    </div>
  );
}

export default App;
