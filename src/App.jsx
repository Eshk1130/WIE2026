/**
 * src/App.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Root application component for WIE2026 – Crewmate Protocol.
 *
 * ── Supabase integration quick-start ────────────────────────────────────────
 *
 * The entire app is wrapped in <PlayerProvider> which exposes:
 *   const { player, sessionId, loading, error, join, leave, submitScore }
 *     = usePlayerContext();
 *
 * HOW TO USE JoinGame in a page component:
 * ─────────────────────────────────────────
 *   import JoinGame from '../components/JoinGame.jsx';
 *
 *   function MyPage() {
 *     const [joined, setJoined] = useState(false);
 *     if (!joined)
 *       return <JoinGame onJoined={() => setJoined(true)} />;
 *     return <YourGameContent />;
 *   }
 *
 * HOW TO USE usePlayerContext in game components:
 * ────────────────────────────────────────────────
 *   import { usePlayerContext } from '../lib/PlayerContext.jsx';
 *
 *   function ScoreSubmit() {
 *     const { player, submitScore } = usePlayerContext();
 *     const handleFinish = async () => {
 *       await submitScore({ score: 450, role: 'crewmate', survived: true, tasks_done: 7 });
 *     };
 *     return <button onClick={handleFinish}>Finish Round</button>;
 *   }
 *
 * ADMIN PANEL:
 * ─────────────
 *   Navigate to /admin — password is set in VITE_ADMIN_PASSWORD env var.
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MOCK_MODE } from './wie-week/api';

import LandingPage from './wie-week/Landing/LandingPage';
import HackAmongUs from './wie-week/Transition_pages/HackAmongUs';

import Round1T from './wie-week/Transition_pages/round1t';
import Round1  from './wie-week/round1/round1';

import Round2T from './wie-week/Transition_pages/round2t';
import Round2  from './wie-week/round2/round2';

import Round3T from './wie-week/Transition_pages/round3t';
import Round3  from './wie-week/round3/round3';

import Round4T from './wie-week/Transition_pages/round4t';
import Round4  from './wie-week/round4/round4';

import Round5T from './wie-week/Transition_pages/round5t';
import Round5  from './wie-week/round5/round5';

import Finish from './wie-week/Transition_pages/finish';

// ── Supabase / admin imports ──────────────────────────────────────────────────
import { PlayerProvider } from './lib/PlayerContext.jsx';
import AdminPanel         from './pages/AdminPanel.jsx';

import './index.css';

/*
  Full cinematic game flow:
  landing
    → hack_transition [roundNum=1]  (cafeteria — "PRESS TO BEGIN ROUND 01")
    → round1t  (guidelines)
    → round1   (gameplay)
    → hack_transition [roundNum=2]
    → round2t
    → round2
    → hack_transition [roundNum=3]
    → round3t
    → round3
    → hack_transition [roundNum=4]
    → round4t
    → round4
    → hack_transition [roundNum=5]
    → round5t
    → round5
    → finish
*/

const STAGES = [
  'landing',
  'hack1', 'round1t', 'round1',
  'hack2', 'round2t', 'round2',
  'hack3', 'round3t', 'round3',
  'hack4', 'round4t', 'round4',
  'hack5', 'round5t', 'round5',
  'finish',
];

function nextStage(s) {
  const i = STAGES.indexOf(s);
  return i >= 0 && i < STAGES.length - 1 ? STAGES[i + 1] : 'finish';
}

// ── Main game stage machine (unchanged logic) ─────────────────────────────────
function GameApp() {
  const [stage, setStage] = useState('landing');
  const advance = () => setStage(s => nextStage(s));

  return (
    <>
      {stage === 'landing' && <LandingPage onStart={advance} />}

      {/* ── Cinematic transition before each round ── */}
      {stage === 'hack1' && <HackAmongUs roundNum={1} onComplete={advance} />}
      {stage === 'hack2' && <HackAmongUs roundNum={2} onComplete={advance} />}
      {stage === 'hack3' && <HackAmongUs roundNum={3} onComplete={advance} />}
      {stage === 'hack4' && <HackAmongUs roundNum={4} onComplete={advance} />}
      {stage === 'hack5' && <HackAmongUs roundNum={5} onComplete={advance} />}

      {/* ── Guidelines pages ── */}
      {stage === 'round1t' && <Round1T onStart={advance} />}
      {stage === 'round2t' && <Round2T onStart={advance} />}
      {stage === 'round3t' && <Round3T onStart={advance} />}
      {stage === 'round4t' && <Round4T onStart={advance} />}
      {stage === 'round5t' && <Round5T onStart={advance} />}

      {/* ── Gameplay rounds ── */}
      {stage === 'round1' && <Round1 onComplete={advance} />}
      {stage === 'round2' && <Round2 onComplete={advance} />}
      {stage === 'round3' && <Round3 onComplete={advance} />}
      {stage === 'round4' && <Round4 onComplete={advance} />}
      {stage === 'round5' && <Round5 onComplete={advance} />}

      {/* ── Finish ── */}
      {stage === 'finish' && <Finish onRestart={() => setStage('landing')} />}

      {/* ── DEV: skip button (mock mode only) ── */}
      {MOCK_MODE && (
        <button
          onClick={advance}
          style={{
            position: 'fixed', bottom: 16, right: 16, zIndex: 99999,
            fontFamily: 'monospace', fontSize: '0.65rem',
            background: 'rgba(255,200,0,0.15)', color: '#ffc800',
            border: '1px solid rgba(255,200,0,0.5)', borderRadius: 6,
            padding: '6px 14px', cursor: 'pointer', letterSpacing: '0.1em',
          }}
        >
          DEV SKIP › {stage}
        </button>
      )}
    </>
  );
}

// ── Root: wrap everything in PlayerProvider + router ──────────────────────────
export default function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Admin dashboard ── */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* ── Main game (catches all other paths) ── */}
          <Route path="*" element={<GameApp />} />
        </Routes>
      </BrowserRouter>
    </PlayerProvider>
  );
}
