# ModalCraft Studio — Advanced Dialog & Authentication System

A production-grade, accessible, responsive Dialog & Modal web application built with **React.js 18**, **CSS3**, and **Vite**. Features complete **User Authentication** (Sign In, Register, Logout, Demo 1-Click Login), persistent **Project & Task Workspace**, **Real-Time Audit Logging**, custom **Animations & Playgrounds**, and **Web Audio API Feedback**.

---

## 🚀 What's New & Upgraded

### 1. 🔐 Complete User Authentication System
- **Sign In & Register Modals**: Seamless tabbed modal dialog for authentication with live validation.
- **1-Click Demo Login**: Pre-seeded demo account (`alex.morgan@example.com` / `password123`) to test the authenticated experience in one click.
- **Persistent User Store**: Users and active sessions persist securely in `localStorage`.
- **User Profile & Settings Dialog**: Edit display name, professional role, bio, view account statistics, and subscription tier.
- **Safe Sign Out Flow**: Graceful logout confirmation modal preventing accidental sign out.

### 2. 🎨 Enhanced UI/UX & Proper Button Hierarchy
- **Modern Design System**: Radial ambient gradients, frosted glassmorphism (`backdrop-filter: blur`), glowing focus indicators, and sleek typography (`Inter` + `Plus Jakarta Sans`).
- **Standardized Button System**:
  - `btn-primary`: Vibrant indigo gradient with depth glow.
  - `btn-accent`: Cyan gradient for high-priority CTA actions.
  - `btn-secondary`: Clean surface-bordered button for balanced hierarchy.
  - `btn-danger` & `btn-danger-outline`: High-visibility warnings for irreversible tasks.
  - `btn-success`: Confident emerald actions.
  - Full support for sizes (`xs`, `sm`, `lg`, `block`) and loading spinners (`.btn-spinner-wrapper`).
- **Dark & Light Mode Switcher**: Seamless theme toggle persisted in `localStorage` with system font and color token recalculation.

### 3. 📂 Interactive Projects & Tasks Workspace
- Create new tasks with custom categories (`Development`, `Design`, `Security`, `Marketing`) and priorities (`Low`, `Medium`, `High`) via the Form Modal.
- Filter tasks by **All**, **Active**, and **Completed**.
- Mark items complete with visual strikethrough and status pills.
- Safeguarded item deletion triggering a **Danger Modal with Typed Safeguard** (type `"DELETE"` to confirm).

### 4. 🎛️ Modal Customizer & Playground
- Dynamically test modal animation styles in real time:
  - `Scale Up` (spring scale transition)
  - `Slide Up` (bottom translation)
  - `3D Flip` (perspective rotation)
  - `Gentle Fade` (smooth opacity transition)
- Custom sizes: Small (380px), Medium (520px), Large (720px).
- Dynamic button color themes.

### 5. 🔔 Live Toast Notifications & Audit Feed
- Multi-toast stacking notification system auto-dismissing after 4.5 seconds with dismiss button.
- Real-time audit log recording every modal event, user session, and project mutation with exact timestamps.

### 6. ⌨️ Global Accessibility & Hotkeys
- `Esc`: Dismiss any active modal instantly.
- `?`: Open the Keyboard Shortcuts cheat sheet dialog.
- `L`: Open Sign In dialog (when signed out).
- `P`: Open User Profile dialog (when signed in).
- `N`: Open New Project creator modal.
- `T`: Toggle Dark / Light theme.
- `S`: Toggle audio effects (synthesized via Web Audio API).
- Background scroll lock and automated focus trapping.

---

## 🛠️ Tech Stack

- **Framework:** React.js 18 (Hooks: `useState`, `useEffect`, `useRef`)
- **Build Tool:** Vite 5
- **Styling:** Vanilla CSS3 (Custom Variables, Flexbox, CSS Grid, Glassmorphism, Keyframes)
- **Audio Feedback:** Web Audio API (zero external audio file dependencies)
- **Icons & Typography:** SVG Icons + Google Fonts (`Inter` & `Plus Jakarta Sans`)

---

## 📦 Getting Started

### 1. Installation
Open your terminal in the project directory:
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 3. Build for Production
```bash
npm run build
```
Generates a minified production build in the `dist/` directory.

---

## 💡 Quick Demo Credentials
- **Email:** `alex.morgan@example.com`
- **Password:** `password123`
*(Or simply click the **"⚡ Demo Login"** button in the top navbar!)*
