/**
 * src/App.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Root component — WIE2026 The Cypher Trail.
 *
 * Routes:
 *   /login          → Login page (Google OAuth — public)
 *   /auth/callback  → OAuth return handler (public)
 *   /game           → Full game flow (requires auth)
 *   /admin          → Admin dashboard (password-gated)
 *   /               → Redirects to /game (requires auth) or /login
 *
 * Mock mode and the DEV SKIP button have been removed entirely.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { PlayerProvider }      from './lib/PlayerContext.jsx';
import Login, { AuthCallback } from './pages/Login.jsx';
import RequireAuth             from './components/RequireAuth.jsx';
import GameFlow                from './pages/GameFlow.jsx';
import AdminPanel              from './pages/AdminPanel.jsx';

import './index.css';

export default function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/login"         element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* ── Admin dashboard (password-gated internally) ── */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* ── Protected game route ── */}
          <Route
            path="/game"
            element={
              <RequireAuth>
                <GameFlow />
              </RequireAuth>
            }
          />

          {/* ── Root: redirect to game (RequireAuth will push to /login if needed) ── */}
          <Route path="/" element={<Navigate to="/game" replace />} />

          {/* ── Catch-all ── */}
          <Route path="*" element={<Navigate to="/game" replace />} />
        </Routes>
      </BrowserRouter>
    </PlayerProvider>
  );
}
