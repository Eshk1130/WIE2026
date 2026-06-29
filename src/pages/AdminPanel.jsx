/**
 * src/pages/AdminPanel.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Full admin dashboard for WIE2026 – Crewmate Protocol.
 * Route: /admin
 *
 * Features:
 *  - Password gate (compared against VITE_ADMIN_PASSWORD)
 *  - 4 stat cards (Total Players, Active Now, Games Played, Avg Score)
 *  - Auto-refresh every 30 s + manual Refresh button
 *  - 4 tabs: Players | Sessions | Scores | Audit Log
 *  - CSV export for each tab
 *  - Fully styled via AdminPanel.css
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchAdminSummary,
  fetchAllSessions,
  fetchAllScores,
  fetchAuditLog,
} from '../lib/gameService.js';
import { exportToCsv, formatDuration } from '../lib/exportCsv.js';
import './AdminPanel.css';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format a UTC ISO string for en-IN locale display. */
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: true,
  });
}

/** Truncate a string to maxLen chars. */
function trunc(str, maxLen = 60) {
  if (!str) return '—';
  const s = typeof str === 'object' ? JSON.stringify(str) : String(str);
  return s.length > maxLen ? s.slice(0, maxLen) + '…' : s;
}

/** Derive audit-log badge colour from event_type string. */
function auditBadgeClass(eventType) {
  if (!eventType) return 'badge-grey';
  const t = eventType.toLowerCase();
  if (t.includes('join') || t.includes('login') || t.includes('insert')) return 'badge-green';
  if (t.includes('session')) return 'badge-blue';
  if (t.includes('impostor') || t.includes('error') || t.includes('delete')) return 'badge-red';
  if (t.includes('score') || t.includes('update')) return 'badge-amber';
  return 'badge-purple';
}

// ── Password Gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [pw, setPw]   = useState('');
  const [err, setErr] = useState('');
  const correctPw = import.meta.env.VITE_ADMIN_PASSWORD ?? '';

  function handleSubmit(e) {
    e.preventDefault();
    if (pw === correctPw) {
      onUnlock();
    } else {
      setErr('Incorrect access code. Try again, Crewmate. 🔒');
      setPw('');
    }
  }

  return (
    <div className="ap-root">
      <div className="ap-gate">
        <div className="ap-gate-card">
          <span className="ap-gate-icon">🛡️</span>
          <h1 className="ap-gate-title">Admin Access</h1>
          <p className="ap-gate-sub">Enter the mission control password to continue.</p>
          <form className="ap-gate-form" onSubmit={handleSubmit}>
            <input
              type="password"
              className="ap-gate-input"
              value={pw}
              onChange={e => { setPw(e.target.value); setErr(''); }}
              placeholder="••••••••"
              autoFocus
              required
            />
            {err && <div className="ap-gate-error">{err}</div>}
            <button type="submit" className="ap-gate-btn">🚀 Enter Mission Control</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, desc }) {
  return (
    <div className="ap-stat-card">
      <span className="ap-stat-label">{label}</span>
      <span className="ap-stat-value">{value ?? '—'}</span>
      {desc && <span className="ap-stat-desc">{desc}</span>}
    </div>
  );
}

// ── Loading / Error helpers ───────────────────────────────────────────────────
function Loading() {
  return (
    <div className="ap-loading">
      <div className="ap-spinner" />
      Loading data…
    </div>
  );
}

function Empty({ msg = 'No records found.' }) {
  return (
    <div className="ap-empty">
      <span className="ap-empty-icon">🌌</span>
      {msg}
    </div>
  );
}

// ── Tab: Players ──────────────────────────────────────────────────────────────
function PlayersTab({ players, loading, error }) {
  function handleExport() {
    const rows = players.map(p => ({
      Name:         p.display_name ?? '—',
      Email:        p.email ?? '—',
      Joined:       fmtDate(p.created_at),
      Sessions:     p.total_sessions ?? 0,
      'Last Seen':  fmtDate(p.last_seen),
      'Time Played': formatDuration(p.total_time_secs),
      'Total Score': p.total_score ?? 0,
      'Avg Score':   p.avg_score != null ? Number(p.avg_score).toFixed(1) : '—',
      Games:         p.total_games ?? 0,
    }));
    exportToCsv('wie2026_players.csv', rows);
  }

  return (
    <div className="ap-pane">
      <div className="ap-pane-header">
        <span className="ap-pane-title">
          Players <span className="ap-pane-count">({players.length})</span>
        </span>
        <button className="ap-export-btn" onClick={handleExport} disabled={players.length === 0}>
          ⬇ Export CSV
        </button>
      </div>
      {error && <div className="ap-error-banner">⚠️ {error}</div>}
      {loading ? <Loading /> : players.length === 0 ? <Empty /> : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Sessions</th>
                <th>Last Seen</th>
                <th>Time Played</th>
                <th>Total Score</th>
                <th>Avg Score</th>
                <th>Games</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={p.player_id ?? i}>
                  <td>{p.display_name ?? '—'}</td>
                  <td className="ap-cell-secondary">{p.email ?? '—'}</td>
                  <td className="ap-cell-dim">{fmtDate(p.created_at)}</td>
                  <td>{p.total_sessions ?? 0}</td>
                  <td className="ap-cell-dim">{fmtDate(p.last_seen)}</td>
                  <td className="ap-cell-secondary">{formatDuration(p.total_time_secs)}</td>
                  <td><strong>{p.total_score ?? 0}</strong></td>
                  <td>{p.avg_score != null ? Number(p.avg_score).toFixed(1) : '—'}</td>
                  <td>{p.total_games ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Tab: Sessions ─────────────────────────────────────────────────────────────
function SessionsTab({ sessions, loading, error }) {
  function handleExport() {
    const rows = sessions.map(s => ({
      Player:      s.players?.display_name ?? '—',
      Email:       s.players?.email ?? '—',
      'Logged In':  fmtDate(s.logged_in_at),
      'Logged Out': fmtDate(s.logged_out_at),
      Duration:    formatDuration(s.duration_secs),
      Status:      s.logged_out_at ? 'Ended' : 'Active',
    }));
    exportToCsv('wie2026_sessions.csv', rows);
  }

  return (
    <div className="ap-pane">
      <div className="ap-pane-header">
        <span className="ap-pane-title">
          Sessions <span className="ap-pane-count">({sessions.length})</span>
        </span>
        <button className="ap-export-btn" onClick={handleExport} disabled={sessions.length === 0}>
          ⬇ Export CSV
        </button>
      </div>
      {error && <div className="ap-error-banner">⚠️ {error}</div>}
      {loading ? <Loading /> : sessions.length === 0 ? <Empty /> : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Email</th>
                <th>Logged In</th>
                <th>Logged Out</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => (
                <tr key={s.id ?? i}>
                  <td>{s.players?.display_name ?? '—'}</td>
                  <td className="ap-cell-secondary">{s.players?.email ?? '—'}</td>
                  <td className="ap-cell-dim">{fmtDate(s.logged_in_at)}</td>
                  <td className="ap-cell-dim">{fmtDate(s.logged_out_at)}</td>
                  <td className="ap-cell-secondary">{formatDuration(s.duration_secs)}</td>
                  <td>
                    {s.logged_out_at
                      ? <span className="badge badge-grey">Ended</span>
                      : <span className="badge badge-green">● Active</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Tab: Scores ───────────────────────────────────────────────────────────────
function ScoresTab({ scores, loading, error }) {
  function handleExport() {
    const rows = scores.map(s => ({
      Player:       s.players?.display_name ?? '—',
      Score:        s.score ?? 0,
      Role:         s.role ?? '—',
      Survived:     s.survived ? 'Yes' : 'No',
      'Tasks Done': s.tasks_done ?? 0,
      'Recorded At': fmtDate(s.recorded_at),
    }));
    exportToCsv('wie2026_scores.csv', rows);
  }

  return (
    <div className="ap-pane">
      <div className="ap-pane-header">
        <span className="ap-pane-title">
          Scores <span className="ap-pane-count">({scores.length})</span>
        </span>
        <button className="ap-export-btn" onClick={handleExport} disabled={scores.length === 0}>
          ⬇ Export CSV
        </button>
      </div>
      {error && <div className="ap-error-banner">⚠️ {error}</div>}
      {loading ? <Loading /> : scores.length === 0 ? <Empty /> : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Score</th>
                <th>Role</th>
                <th>Survived</th>
                <th>Tasks Done</th>
                <th>Recorded At</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, i) => {
                const roleLC = (s.role ?? '').toLowerCase();
                return (
                  <tr key={s.id ?? i}>
                    <td>{s.players?.display_name ?? '—'}</td>
                    <td><strong>{s.score ?? 0}</strong></td>
                    <td>
                      {s.role
                        ? <span className={`badge ${roleLC === 'impostor' ? 'badge-red' : 'badge-blue'}`}>
                            {roleLC === 'impostor' ? '🔪' : '🧑‍🚀'} {s.role}
                          </span>
                        : <span className="ap-cell-dim">—</span>}
                    </td>
                    <td>
                      {s.survived === true  && <span title="Survived">✅</span>}
                      {s.survived === false && <span title="Eliminated">💀</span>}
                      {s.survived == null   && <span className="ap-cell-dim">—</span>}
                    </td>
                    <td>{s.tasks_done ?? 0}</td>
                    <td className="ap-cell-dim">{fmtDate(s.recorded_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Tab: Audit Log ────────────────────────────────────────────────────────────
function AuditTab({ logs, loading, error }) {
  function handleExport() {
    const rows = logs.map((l, i) => ({
      '#':           i + 1,
      'Event Type':  l.event_type ?? '—',
      Payload:       typeof l.payload === 'object' ? JSON.stringify(l.payload) : (l.payload ?? ''),
      Time:          fmtDate(l.occurred_at),
    }));
    exportToCsv('wie2026_audit_log.csv', rows);
  }

  return (
    <div className="ap-pane">
      <div className="ap-audit-note">
        🔒 This log is written by the database and <strong>cannot be modified</strong> from the frontend.
      </div>
      <div className="ap-pane-header">
        <span className="ap-pane-title">
          Audit Log <span className="ap-pane-count">({logs.length})</span>
        </span>
        <button className="ap-export-btn" onClick={handleExport} disabled={logs.length === 0}>
          ⬇ Export CSV
        </button>
      </div>
      {error && <div className="ap-error-banner">⚠️ {error}</div>}
      {loading ? <Loading /> : logs.length === 0 ? <Empty msg="No audit events recorded yet." /> : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>#</th>
                <th>Event Type</th>
                <th>Payload</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={l.id ?? i}>
                  <td className="ap-cell-dim">{i + 1}</td>
                  <td>
                    <span className={`badge ${auditBadgeClass(l.event_type)}`}>
                      {l.event_type ?? '—'}
                    </span>
                  </td>
                  <td>
                    <span
                      className="ap-cell-mono"
                      title={typeof l.payload === 'object' ? JSON.stringify(l.payload) : l.payload}
                    >
                      {trunc(typeof l.payload === 'object' ? JSON.stringify(l.payload) : l.payload)}
                    </span>
                  </td>
                  <td className="ap-cell-dim">{fmtDate(l.occurred_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [tab,      setTab]      = useState('players');
  const [players,  setPlayers]  = useState([]);
  const [sessions, setSessions] = useState([]);
  const [scores,   setScores]   = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const intervalRef = useRef(null);

  // ── Derived stats ─────────────────────────────────────────────────────────
  const totalPlayers  = players.length;
  const activeNow     = sessions.filter(s => !s.logged_out_at).length;
  const gamesPlayed   = scores.length;
  const avgScore      = scores.length > 0
    ? (scores.reduce((acc, s) => acc + (s.score ?? 0), 0) / scores.length).toFixed(1)
    : '—';

  // ── Fetch all data ────────────────────────────────────────────────────────
  const fetchAll = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const [p, se, sc, al] = await Promise.all([
        fetchAdminSummary(),
        fetchAllSessions(),
        fetchAllScores(),
        fetchAuditLog(500),
      ]);
      setPlayers(p);
      setSessions(se);
      setScores(sc);
      setAuditLog(al);
      setLastSync(new Date());
    } catch (err) {
      setError(err.message ?? 'Failed to load admin data.');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  // ── Mount + 30-s auto-refresh ─────────────────────────────────────────────
  useEffect(() => {
    fetchAll(true);
    intervalRef.current = setInterval(() => fetchAll(false), 30_000);
    return () => clearInterval(intervalRef.current);
  }, [fetchAll]);

  const TABS = [
    { id: 'players',  label: '👥 Players'   },
    { id: 'sessions', label: '🔗 Sessions'  },
    { id: 'scores',   label: '🏆 Scores'    },
    { id: 'audit',    label: '📋 Audit Log' },
  ];

  return (
    <div className="ap-root">
      <div className="ap-dashboard">
        {/* ── Top bar ── */}
        <header className="ap-topbar">
          <div className="ap-topbar-brand">
            <span className="ap-topbar-logo">🛸</span>
            <div>
              <div className="ap-topbar-title">Mission Control</div>
              <div className="ap-topbar-sub">WIE2026 · Crewmate Protocol</div>
            </div>
          </div>
          <div className="ap-topbar-right">
            {lastSync && (
              <span className="ap-sync-time">
                Last sync: {lastSync.toLocaleTimeString('en-IN')}
              </span>
            )}
            <button
              className="ap-refresh-btn"
              onClick={() => fetchAll(false)}
              disabled={loading}
            >
              {loading ? '⟳ Syncing…' : '⟳ Refresh'}
            </button>
            <button className="ap-logout-btn" onClick={onLogout}>
              Sign Out
            </button>
          </div>
        </header>

        {/* ── Stat cards ── */}
        <section className="ap-stats-row">
          <StatCard label="Total Players"  value={totalPlayers}  desc="registered crewmates" />
          <StatCard label="Active Now"     value={activeNow}     desc="open sessions" />
          <StatCard label="Games Played"   value={gamesPlayed}   desc="score records" />
          <StatCard label="Average Score"  value={avgScore}      desc="across all games" />
        </section>

        {/* ── Tabs ── */}
        <nav className="ap-tabs-row">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`ap-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* ── Tab panes ── */}
        {tab === 'players'  && <PlayersTab  players={players}   loading={loading} error={error} />}
        {tab === 'sessions' && <SessionsTab sessions={sessions} loading={loading} error={error} />}
        {tab === 'scores'   && <ScoresTab   scores={scores}     loading={loading} error={error} />}
        {tab === 'audit'    && <AuditTab    logs={auditLog}     loading={loading} error={error} />}
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return <Dashboard onLogout={() => setUnlocked(false)} />;
}
