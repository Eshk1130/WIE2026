import { useState, useEffect, useRef, useCallback } from 'react';
import './round4.css';
import mapImage from './assets/map.png';

const downMods = import.meta.glob('./assets/players/down_*.png', { eager: true, import: 'default' });
const upMods = import.meta.glob('./assets/players/up_*.png', { eager: true, import: 'default' });
const sideMods = import.meta.glob('./assets/players/passing_*.png', { eager: true, import: 'default' });

function sortedFrames(mods) {
  return Object.keys(mods).sort().map(k => mods[k]);
}

const WALK_FRAMES = {
  down: sortedFrames(downMods),
  up: sortedFrames(upMods),
  side: sortedFrames(sideMods),
};

function pickDirection(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy)) return { dir: 'side', flip: dx < 0 };
  return { dir: dy < 0 ? 'up' : 'down', flip: false };
}

// No collision walls — player moves freely
function clampToWalkable(_fx, _fy, tx, ty) { return { x: tx, y: ty }; }

// ── Room definitions for minimap ─────────────────────────────────────────────
const ROOMS = [
  { id: 'cafeteria', label: 'CAFETERIA', cx: 50, cy: 13, mx: 1, my: 1, mw: 3, mh: 2 },
  { id: 'weapons', label: 'WEAPONS', cx: 74, cy: 12, mx: 7, my: 1, mw: 2, mh: 2 },
  { id: 'navigation', label: 'NAV', cx: 74, cy: 25, mx: 7, my: 2, mw: 2, mh: 2 },
  { id: 'shields', label: 'SHIELDS', cx: 75, cy: 42, mx: 7, my: 3, mw: 2, mh: 2 },
  { id: 'security', label: 'SECURITY', cx: 30, cy: 21, mx: 0, my: 1, mw: 2, mh: 2 },
  { id: 'medbay', label: 'MEDBAY', cx: 30, cy: 37, mx: 0, my: 2, mw: 2, mh: 2 },
  { id: 'reactor', label: 'REACTOR', cx: 11, cy: 45, mx: 0, my: 3, mw: 2, mh: 2 },
  { id: 'electrical', label: 'ELECTRICAL', cx: 34, cy: 58, mx: 1, my: 4, mw: 2, mh: 2 },
  { id: 'storage', label: 'STORAGE', cx: 46, cy: 59, mx: 2, my: 4, mw: 2, mh: 2 },
  { id: 'admin', label: 'ADMIN', cx: 60, cy: 52, mx: 4, my: 3, mw: 2, mh: 2 },
  { id: 'communications', label: 'COMMS', cx: 47, cy: 69, mx: 2, my: 5, mw: 3, mh: 2 },
];

// ── Fragment spawn locations ──────────────────────────────────────────────────
const FRAGMENT_DEFS = [
  { id: 0, roomId: 'cafeteria', x: 50, y: 10 },
  { id: 1, roomId: 'weapons', x: 74, y: 12 },
  { id: 2, roomId: 'navigation', x: 74, y: 25 },
  { id: 3, roomId: 'shields', x: 75, y: 42 },
  { id: 4, roomId: 'reactor', x: 11, y: 45 },
  { id: 5, roomId: 'electrical', x: 34, y: 58 },
  { id: 6, roomId: 'medbay', x: 30, y: 37 },
  { id: 7, roomId: 'communications', x: 47, y: 69 },
];

// ── QR piece pixel patterns (8×8 each) ───────────────────────────────────────
const QR_PATTERNS = [
  [[1, 1, 1, 0, 1, 0, 1, 1], [1, 0, 0, 1, 0, 1, 0, 1], [1, 1, 0, 0, 1, 1, 1, 0], [0, 1, 1, 0, 0, 1, 0, 1], [1, 0, 1, 1, 1, 0, 0, 0], [0, 1, 0, 1, 0, 1, 1, 1], [1, 1, 1, 0, 1, 0, 0, 1], [0, 0, 1, 1, 0, 1, 1, 0]],
  [[0, 1, 1, 1, 0, 0, 1, 0], [1, 1, 0, 0, 1, 1, 0, 1], [0, 0, 1, 1, 0, 1, 1, 0], [1, 0, 0, 1, 1, 0, 0, 1], [0, 1, 1, 0, 1, 1, 0, 0], [1, 0, 1, 0, 0, 1, 0, 1], [1, 1, 0, 1, 1, 0, 1, 0], [0, 1, 0, 0, 1, 1, 1, 1]],
  [[1, 0, 0, 1, 1, 0, 1, 0], [0, 1, 1, 0, 0, 1, 0, 1], [1, 0, 1, 1, 1, 0, 0, 1], [0, 1, 0, 0, 1, 1, 1, 0], [1, 1, 1, 0, 0, 1, 0, 0], [0, 0, 1, 1, 1, 0, 1, 1], [1, 0, 0, 1, 0, 1, 1, 0], [0, 1, 1, 0, 1, 0, 0, 1]],
  [[0, 0, 1, 1, 0, 1, 0, 0], [1, 1, 0, 0, 1, 0, 1, 1], [0, 1, 1, 1, 0, 1, 0, 0], [1, 0, 0, 1, 1, 0, 1, 1], [0, 1, 0, 0, 0, 1, 1, 0], [1, 0, 1, 1, 1, 0, 0, 1], [0, 1, 0, 1, 0, 1, 1, 0], [1, 1, 1, 0, 0, 1, 0, 1]],
  [[1, 1, 0, 0, 1, 1, 0, 1], [0, 0, 1, 1, 0, 0, 1, 0], [1, 1, 0, 1, 1, 1, 0, 0], [0, 1, 1, 0, 0, 1, 1, 1], [1, 0, 0, 1, 1, 0, 0, 1], [0, 1, 1, 0, 1, 1, 1, 0], [1, 0, 1, 1, 0, 0, 1, 1], [0, 1, 0, 0, 1, 1, 0, 0]],
  [[0, 1, 1, 0, 0, 1, 1, 0], [1, 0, 0, 1, 1, 0, 0, 1], [0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0], [0, 0, 1, 1, 0, 0, 1, 1], [1, 1, 0, 0, 1, 1, 0, 0], [0, 1, 1, 0, 0, 1, 1, 0], [1, 0, 0, 1, 1, 0, 0, 1]],
  [[1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 0, 1, 1], [1, 0, 0, 1, 0, 0, 1, 1], [0, 1, 1, 0, 1, 1, 0, 0], [1, 1, 1, 0, 0, 0, 1, 1], [0, 0, 0, 1, 1, 1, 0, 0]],
  [[0, 1, 0, 1, 1, 0, 1, 0], [1, 0, 1, 0, 0, 1, 0, 1], [0, 1, 1, 1, 0, 0, 1, 0], [1, 0, 0, 0, 1, 1, 0, 1], [0, 1, 0, 1, 0, 1, 0, 0], [1, 0, 1, 0, 1, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1, 0], [0, 0, 1, 1, 1, 0, 0, 1]],
];

const QR_COLORS = ['#1a4a6b', '#1a5a3b', '#4a1a6b', '#6b3a1a', '#1a5a6b', '#6b1a3a', '#3a6b1a', '#6b6b1a'];
const QR_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const QR_GRID = [
  [0, 1, null, 2],
  [3, null, 4, null],
  [null, 5, null, 6],
  [7, null, null, null],
];

const MAP_W = 4800;
const MAP_H = 3600;

function QRMini({ pattern, color, size = 32 }) {
  const cell = size / 8;
  return (
    <svg width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      {pattern.map((row, ri) =>
        row.map((bit, ci) => (
          <rect key={`${ri}-${ci}`} x={ci * cell} y={ri * cell}
            width={cell} height={cell} fill={bit ? color : 'rgba(0,0,0,0.7)'} />
        ))
      )}
      <rect x={0} y={0} width={cell * 3} height={cell * 3}
        fill="none" stroke={color} strokeWidth={cell * 0.35} />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Round4({ onComplete }) {
  const [phase, setPhase] = useState('explore');
  const [collected, setCollected] = useState(new Set());
  const [assembled, setAssembled] = useState(new Set());
  const [audioCode, setAudioCode] = useState('');
  const [codeStatus, setCodeStatus] = useState('idle');
  const [minimapOpen, setMinimapOpen] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 13 });
  const [moving, setMoving] = useState(false);
  const [walkDir, setWalkDir] = useState('down');
  const [walkFlip, setWalkFlip] = useState(false);
  const [frameIdx, setFrameIdx] = useState(0);

  const targetRef = useRef({ x: 50, y: 13 });
  const posRef = useRef({ x: 50, y: 13 });
  const rafRef = useRef(null);
  const mapRef = useRef(null);
  const mapInnerRef = useRef(null);
  const collRef = useRef(new Set());
  const frameTimerRef = useRef(null);

  useEffect(() => { collRef.current = collected; }, [collected]);

  // ── Fragment collection check ─────────────────────────────────────────────
  const checkFragments = useCallback((next) => {
    FRAGMENT_DEFS.forEach(f => {
      if (collRef.current.has(f.id)) return;
      const fdx = f.x - next.x;
      const fdy = f.y - next.y;
      if (Math.sqrt(fdx * fdx + fdy * fdy) < 3.5) {
        setCollected(prev => { const n = new Set(prev); n.add(f.id); return n; });
      }
    });
  }, []);

  // ── Animation loop (click-to-move) ───────────────────────────────────────
  const tick = useCallback(function tick() {
    const cur = posRef.current;
    const tgt = targetRef.current;
    const dx = tgt.x - cur.x;
    const dy = tgt.y - cur.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 0.15) {
      posRef.current = { ...tgt };
      setPos({ ...tgt });
      setMoving(false);
      rafRef.current = null;
      return;
    }

    const speed = 0.18;
    const next = { x: cur.x + dx * speed, y: cur.y + dy * speed };
    posRef.current = next;
    setPos({ ...next });
    const { dir, flip } = pickDirection(dx, dy);
    setWalkDir(dir);
    setWalkFlip(flip);
    checkFragments(next);
    rafRef.current = requestAnimationFrame(tick);
  }, [checkFragments]);

  const startMove = useCallback((tx, ty) => {
    const clamped = clampToWalkable(posRef.current.x, posRef.current.y, tx, ty);
    targetRef.current = clamped;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setFrameIdx(0);
    setMoving(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  useEffect(() => {
    if (!moving) {
      if (frameTimerRef.current) clearInterval(frameTimerRef.current);
      frameTimerRef.current = null;
      return;
    }

    frameTimerRef.current = setInterval(() => setFrameIdx(f => (f + 1) % 6), 90);
    return () => {
      if (frameTimerRef.current) clearInterval(frameTimerRef.current);
    };
  }, [moving]);

  // Auto-advance to puzzle
  useEffect(() => {
    if (collected.size === 8 && phase === 'explore') {
      setTimeout(() => setPhase('puzzle'), 800);
    }
  }, [collected.size, phase]);

  // ── Arrow key / WASD movement ─────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'explore') return;
    const STEP = 0.6;

    const handleKey = (e) => {
      const cur = posRef.current;
      let tx = cur.x, ty = cur.y;

      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': ty -= STEP; setWalkDir('up'); setWalkFlip(false); break;
        case 'ArrowDown': case 's': case 'S': ty += STEP; setWalkDir('down'); setWalkFlip(false); break;
        case 'ArrowLeft': case 'a': case 'A': tx -= STEP; setWalkDir('side'); setWalkFlip(true); break;
        case 'ArrowRight': case 'd': case 'D': tx += STEP; setWalkDir('side'); setWalkFlip(false); break;
        default: return;
      }
      e.preventDefault();

      // Cancel any in-progress click-to-move
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }

      const next = { x: tx, y: ty };
      posRef.current = next;
      targetRef.current = next;
      setPos({ ...next });
      if (!e.repeat) setFrameIdx(0);
      setMoving(true);
      checkFragments(next);

      clearTimeout(window._r4KeyTimeout);
      window._r4KeyTimeout = setTimeout(() => setMoving(false), 150);
    };

    window.addEventListener('keydown', handleKey);
    return () => { window.removeEventListener('keydown', handleKey); clearTimeout(window._r4KeyTimeout); };
  }, [phase, checkFragments]);

  // ── Camera follow ─────────────────────────────────────────────────────────
  useEffect(() => {
    const wrap = mapRef.current;
    const inner = mapInnerRef.current;
    if (!wrap || !inner) return;
    const wrapW = wrap.clientWidth;
    const wrapH = wrap.clientHeight;
    const px = (pos.x / 100) * MAP_W;
    const py = (pos.y / 100) * MAP_H;
    const camX = Math.min(0, Math.max(wrapW - MAP_W, wrapW / 2 - px));
    const camY = Math.min(0, Math.max(wrapH - MAP_H, wrapH / 2 - py));
    inner.style.transform = `translate(${camX}px, ${camY}px)`;
  }, [pos]);

  // ── Click to move ──────────────────────────────────────────────────────
  const handleMapClick = useCallback((e) => {
    if (phase !== 'explore') return;
    const inner = mapInnerRef.current;
    if (!inner) return;
    const rect = inner.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / MAP_W) * 100;
    const y = ((e.clientY - rect.top)  / MAP_H) * 100;
    startMove(x, y);
  }, [phase, startMove]);

  // ── Teleport (minimap popup) ──────────────────────────────────────────────
  const teleport = ({ cx, cy }) => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    posRef.current = { x: cx, y: cy };
    targetRef.current = { x: cx, y: cy };
    setPos({ x: cx, y: cy });
    setFrameIdx(0);
    setMoving(false);
    setMinimapOpen(false);
  };

  // ── Puzzle ────────────────────────────────────────────────────────────────
  const togglePiece = (id) => {
    setAssembled(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  // ── Audio ─────────────────────────────────────────────────────────────────
  const submitCode = () => {
    if (audioCode.trim().toUpperCase() === 'IMPOSTOR-UNMASKED') {
      setCodeStatus('ok');
      setTimeout(() => setPhase('complete'), 1200);
    } else {
      setCodeStatus('err');
      setTimeout(() => setCodeStatus('idle'), 2000);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="r4-root">

      {/* ── EXPLORE ── */}
      {phase === 'explore' && (
        <div className="r4-explore">

          {/* HUD */}
          <div className="r4-hud">
            <span className="r4-hud-title">ROUND 04 — NAVIGATION SYSTEMS</span>
            <div className="r4-hud-frags">
              {FRAGMENT_DEFS.map(f => (
                <div key={f.id} className={`r4-frag-dot${collected.has(f.id) ? ' r4-frag-dot--found' : ''}`} />
              ))}
            </div>
            <span className="r4-hud-count">{collected.size} / 8 FRAGMENTS</span>
          </div>

          {/* Map viewport */}
          <div className="r4-map-wrap" ref={mapRef} onClick={handleMapClick}>
            <div className="r4-map-inner" ref={mapInnerRef}>
              <img src={mapImage} alt="ship map" className="r4-map-img" draggable={false} />

              {/* Fragments */}
              {FRAGMENT_DEFS.map(f => !collected.has(f.id) && (
                <div key={f.id} className="r4-fragment" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
                  <QRMini pattern={QR_PATTERNS[f.id]} color={QR_COLORS[f.id]} size={28} />
                  <div className="r4-fragment-label">FRAG {QR_LABELS[f.id]}</div>
                </div>
              ))}

              {/* Sparkles on collected */}
              {FRAGMENT_DEFS.map(f => collected.has(f.id) && (
                <div key={`sp-${f.id}`} className="r4-collected-spark"
                  style={{ left: `${f.x}%`, top: `${f.y}%` }}>✦</div>
              ))}

              {/* Player */}
              <img
                src={WALK_FRAMES[walkDir][frameIdx]}
                alt="player"
                className="r4-player"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) scaleX(${walkFlip ? -1 : 1})`,
                }}
                draggable={false}
              />

              {/* Room labels */}
              {ROOMS.map(r => (
                <div key={r.id} className="r4-room-label"
                  style={{ left: `${r.cx}%`, top: `${r.cy + 4}%` }}>
                  {r.label}
                </div>
              ))}
            </div>
          </div>

          {/* Minimap thumbnail */}
          <div className="r4-minimap-thumb" onClick={() => setMinimapOpen(o => !o)} title="Click to expand map">
            <img src={mapImage} alt="minimap" className="r4-minimap-thumb-img" draggable={false} />
            <div className="r4-minimap-thumb-blip" style={{ left: `${pos.x}%`, top: `${pos.y}%` }} />
          </div>

          {/* Expanded minimap popup */}
          {minimapOpen && (
            <div className="r4-minimap-popup" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              teleport({ cx: x, cy: y });
            }}>
              <img src={mapImage} alt="full map" className="r4-minimap-popup-img" draggable={false} />
              <div className="r4-minimap-popup-blip" style={{ left: `${pos.x}%`, top: `${pos.y}%` }} />
              <div className="r4-minimap-popup-hint">CLICK ANYWHERE TO TELEPORT</div>
              <button className="r4-minimap-popup-close"
                onClick={e => { e.stopPropagation(); setMinimapOpen(false); }}>✕</button>
            </div>
          )}

          <div className="r4-tip">CLICK TO MOVE · WASD / ARROW KEYS · THUMBNAIL → TELEPORT</div>
        </div>
      )}

      {/* ── PUZZLE ── */}
      {phase === 'puzzle' && (
        <div className="r4-puzzle">
          <div className="r4-puzzle-layout">
            <div className="r4-tray">
              <div className="r4-tray-title">QR FRAGMENTS</div>
              <div className="r4-tray-sub">Click to place / remove</div>
              {FRAGMENT_DEFS.map(f => (
                <div key={f.id}
                  className={`r4-tray-piece${assembled.has(f.id) ? ' r4-tray-piece--placed' : ''}`}
                  onClick={() => togglePiece(f.id)}>
                  <QRMini pattern={QR_PATTERNS[f.id]} color={QR_COLORS[f.id]} size={36} />
                  <span className="r4-tray-label">FRAGMENT {QR_LABELS[f.id]}</span>
                  <span className="r4-tray-check">{assembled.has(f.id) ? '✓' : '○'}</span>
                </div>
              ))}
            </div>

            <div className="r4-assembly">
              <div className="r4-assembly-title">PUT THE PIECES TOGETHER</div>
              <div className="r4-qr-grid">
                {QR_GRID.map((row, ri) =>
                  row.map((pid, ci) => (
                    <div key={`${ri}-${ci}`} className={`r4-qr-cell${pid !== null ? ' r4-qr-cell--slot' : ''}`}>
                      {pid !== null && assembled.has(pid) && (
                        <QRMini pattern={QR_PATTERNS[pid]} color={QR_COLORS[pid]} size={76} />
                      )}
                      {pid !== null && !assembled.has(pid) && (
                        <div className="r4-qr-empty" onClick={() => togglePiece(pid)}>?</div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {assembled.size < 8 && (
                <div className="r4-assembly-hint">
                  {8 - assembled.size} PIECE{8 - assembled.size !== 1 ? 'S' : ''} REMAINING
                </div>
              )}

              {assembled.size === 8 && (
                <div className="r4-assembled-msg">
                  <div className="r4-assembled-title">QR CODE ASSEMBLED ✓</div>
                  <p className="r4-assembled-sub">
                    Scan the QR code with your phone to receive the audio transmission.
                  </p>
                  <button className="r4-btn r4-btn--primary" onClick={() => setPhase('audio')}>
                    I'VE SCANNED IT →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── AUDIO ── */}
      {phase === 'audio' && (
        <div className="r4-audio-phase">
          <div className="r4-audio-card">
            <div className="r4-audio-tag">TRANSMISSION RECEIVED</div>
            <h2 className="r4-audio-title">DECODE THE SIGNAL</h2>
            <p className="r4-audio-desc">
              The audio file contains a hidden message. Listen carefully — the impostor's
              identity is encoded within. Decode the transmission and enter the override phrase.
            </p>
            <div className="r4-waveform">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="r4-wave-bar"
                  style={{ animationDelay: `${i * 0.055}s`, height: `${18 + Math.abs(Math.sin(i * 0.9)) * 22}px` }} />
              ))}
            </div>
            <p className="r4-audio-hint">🔊 Delivered via QR scan · Decode the hidden phrase · Enter below</p>
            <div className="r4-audio-row">
              <input
                className={`r4-code-input${codeStatus === 'ok' ? ' r4-code-input--ok' : codeStatus === 'err' ? ' r4-code-input--err' : ''}`}
                type="text"
                placeholder="ENTER DECODED PHRASE..."
                value={audioCode}
                onChange={e => { setAudioCode(e.target.value); setCodeStatus('idle'); }}
                onKeyDown={e => e.key === 'Enter' && submitCode()}
                readOnly={codeStatus === 'ok'}
              />
              <button className="r4-btn r4-btn--primary" onClick={submitCode} disabled={codeStatus === 'ok'}>
                SUBMIT
              </button>
            </div>
            {codeStatus === 'err' && <div className="r4-feedback r4-feedback--err">✗ INCORRECT — LISTEN AGAIN</div>}
            {codeStatus === 'ok' && <div className="r4-feedback r4-feedback--ok">✓ DECODED — IMPOSTOR IDENTIFIED</div>}
            <button className="r4-btn r4-btn--ghost" onClick={() => setPhase('puzzle')} style={{ marginTop: 12 }}>
              ← BACK TO PUZZLE
            </button>
          </div>
        </div>
      )}

      {/* ── COMPLETE ── */}
      {phase === 'complete' && (
        <div className="r4-complete">
          <div className="r4-complete-card">
            <div className="r4-complete-tag">MISSION COMPLETE</div>
            <h2 className="r4-complete-title">IMPOSTOR UNMASKED</h2>
            <p className="r4-complete-desc">
              All 8 QR fragments recovered. Transmission decoded. The impostor has been ejected.
            </p>
            <div className="r4-stat-row">
              <div className="r4-stat"><div className="r4-stat-lbl">FRAGMENTS</div><div className="r4-stat-val">8 / 8</div></div>
              <div className="r4-stat"><div className="r4-stat-lbl">STATUS</div><div className="r4-stat-val r4-stat-val--ok">CLEARED</div></div>
            </div>
            {onComplete && (
              <button className="r4-btn r4-btn--primary" style={{ marginTop: 16 }} onClick={onComplete}>
                CONTINUE TO ROUND 5 →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}