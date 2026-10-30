// User Authentication & LocalStorage Management Helper

const USERS_STORAGE_KEY = 'modalcraft_users';
const ACTIVE_USER_KEY = 'modalcraft_active_user';

// Pre-seeded demo account so testing is instantaneous
const DEFAULT_DEMO_USER = {
  id: 'usr_demo_01',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  password: 'password123',
  avatar: '👨‍💻',
  role: 'Product Designer',
  plan: 'Pro Plan',
  createdAt: '2026-01-15T10:00:00.000Z',
  bio: 'Frontend enthusiast & UI designer building delightful web experiences.'
};

export const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_DEMO_USER]));
      return [DEFAULT_DEMO_USER];
    }
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_DEMO_USER];
  }
};

export const saveUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage', err);
  }
};

export const getActiveUser = () => {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setActiveUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  } catch (err) {
    console.error('Failed to set active user', err);
  }
};

export const authenticateUser = (email, password) => {
  const users = getStoredUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  if (!found) {
    return { success: false, error: 'Invalid email or password. Try demo credentials!' };
  }
  setActiveUser(found);
  return { success: true, user: found };
};

export const registerUser = ({ name, email, password, avatar = '👤', role = 'Member' }) => {
  const users = getStoredUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (exists) {
    return { success: false, error: 'An account with this email already exists!' };
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    avatar,
    role,
    plan: 'Starter Plan',
    createdAt: new Date().toISOString(),
    bio: 'Excited to explore ModalCraft popups!'
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  setActiveUser(newUser);
  return { success: true, user: newUser };
};

export const updateUserProfile = (userId, updates) => {
  const users = getStoredUsers();
  const updatedUsers = users.map((u) => (u.id === userId ? { ...u, ...updates } : u));
  saveUsers(updatedUsers);

  const active = getActiveUser();
  if (active && active.id === userId) {
    const newActive = { ...active, ...updates };
    setActiveUser(newActive);
    return newActive;
  }
  return null;
};

export const logoutUser = () => {
  setActiveUser(null);
};

