/**
 * src/components/JoinGame.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Name/email entry form that calls join() from PlayerContext and fires
 * onJoined({ player, sessionId }) on success.
 *
 * Space / Among Us aesthetic: dark hull background, cyan/neon accents,
 * animated starfield, crewmate-flavoured copy.
 *
 * Props:
 *   onJoined({ player, sessionId }) — called after a successful joinGame()
 */

import { useState, useEffect, useRef } from 'react';
import { usePlayerContext } from '../lib/PlayerContext.jsx';

// ── Tiny inline star-canvas (no deps) ────────────────────────────────────────
function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.005 + 0.002,
    }));

    let animId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.a += s.speed;
        const alpha = (Math.sin(s.a) + 1) / 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 210, 255, ${alpha * 0.8})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function JoinGame({ onJoined }) {
  const { join, loading, error } = usePlayerContext();
  const [displayName, setDisplayName] = useState('');
  const [email,       setEmail]       = useState('');
  const [localErr,    setLocalErr]    = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalErr('');

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      setLocalErr('You need a crew name to board the ship!');
      return;
    }

    try {
      const result = await join(trimmedName, email.trim() || undefined);
      onJoined?.(result);
    } catch {
      // error already set in context
    }
  }

  const displayError = localErr || error;

  return (
    <div style={styles.wrapper}>
      <Starfield />

      <div style={styles.card}>
        {/* ── Crewmate silhouette icon ── */}
        <div style={styles.iconRow}>
          <svg viewBox="0 0 64 80" style={styles.crewIcon} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* body */}
            <ellipse cx="32" cy="52" rx="22" ry="20" fill="#4ade80" />
            {/* visor background */}
            <ellipse cx="32" cy="25" rx="18" ry="18" fill="#1e293b" />
            {/* visor glass */}
            <ellipse cx="32" cy="25" rx="14" ry="13" fill="#38bdf8" opacity="0.85" />
            {/* visor glint */}
            <ellipse cx="26" cy="20" rx="4" ry="3" fill="white" opacity="0.3" />
            {/* backpack */}
            <rect x="50" y="38" width="10" height="14" rx="4" fill="#22c55e" />
          </svg>
        </div>

        <h1 style={styles.title}>Board the Ship 🚀</h1>
        <p style={styles.subtitle}>
          Enter your crew details to join the<br />
          <span style={styles.accent}>Crewmate Protocol</span> mission.
        </p>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {/* Display Name */}
          <div style={styles.fieldGroup}>
            <label htmlFor="jg-name" style={styles.label}>
              Crew Name <span style={styles.required}>*</span>
            </label>
            <input
              id="jg-name"
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              maxLength={32}
              placeholder="e.g. Commander Aarush"
              required
              disabled={loading}
              style={styles.input}
              onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={e  => Object.assign(e.target.style, styles.input)}
            />
            <span style={styles.charCount}>{displayName.length}/32</span>
          </div>

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label htmlFor="jg-email" style={styles.label}>
              Email <span style={styles.optional}>(optional)</span>
            </label>
            <input
              id="jg-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="crew@spaceship.io"
              disabled={loading}
              style={styles.input}
              onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={e  => Object.assign(e.target.style, styles.input)}
            />
          </div>

          {/* Error message */}
          {displayError && (
            <div style={styles.errorBox} role="alert">
              ⚠️ {displayError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={loading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}
          >
            {loading ? (
              <>
                <span style={styles.spinner} /> Boarding…
              </>
            ) : (
              '🛸 Board the Ship'
            )}
          </button>
        </form>

        <p style={styles.note}>
          Your data is used only for this session's scoreboard.
        </p>
      </div>
    </div>
  );
}

// ── Styles (inline — no extra CSS file needed) ────────────────────────────────
const styles = {
  wrapper: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 50% 20%, #0f172a 0%, #020617 100%)',
    fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
    overflow: 'hidden',
    padding: '1rem',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(74, 222, 128, 0.25)',
    borderRadius: '1.5rem',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 0 60px rgba(74, 222, 128, 0.08), 0 24px 64px rgba(0,0,0,0.6)',
    textAlign: 'center',
  },
  iconRow: { marginBottom: '1rem' },
  crewIcon: { width: 72, height: 72, filter: 'drop-shadow(0 0 12px rgba(74,222,128,0.5))' },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1.9rem',
    fontWeight: 700,
    color: '#f0fdf4',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    margin: '0 0 1.75rem',
    fontSize: '0.9rem',
    color: '#94a3b8',
    lineHeight: 1.6,
  },
  accent: { color: '#4ade80', fontWeight: 600 },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '0.35rem', position: 'relative' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' },
  required: { color: '#f87171' },
  optional: { color: '#475569', fontWeight: 400, textTransform: 'none' },
  input: {
    background: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(74,222,128,0.2)',
    borderRadius: '0.6rem',
    padding: '0.7rem 0.9rem',
    color: '#f0fdf4',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputFocus: {
    background: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(74,222,128,0.7)',
    borderRadius: '0.6rem',
    padding: '0.7rem 0.9rem',
    color: '#f0fdf4',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    boxShadow: '0 0 0 3px rgba(74,222,128,0.12)',
  },
  charCount: { fontSize: '0.7rem', color: '#475569', alignSelf: 'flex-end', marginTop: '-0.2rem' },
  errorBox: {
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.4)',
    borderRadius: '0.5rem',
    padding: '0.65rem 0.85rem',
    color: '#fca5a5',
    fontSize: '0.85rem',
  },
  btn: {
    marginTop: '0.5rem',
    padding: '0.85rem 1.25rem',
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'opacity 0.2s, transform 0.15s',
    boxShadow: '0 4px 20px rgba(34,197,94,0.35)',
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
  spinner: {
    display: 'inline-block',
    width: 16,
    height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  note: { marginTop: '1.25rem', fontSize: '0.72rem', color: '#334155' },
};

// Inject keyframe for spinner (once)
if (typeof document !== 'undefined') {
  const styleEl = document.getElementById('jg-keyframes');
  if (!styleEl) {
    const el = document.createElement('style');
    el.id = 'jg-keyframes';
    el.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(el);
  }
}
