import '../Transition_pages/RoundGuidelines.css';

/* Placeholder for Round 5 — swap this out when the real round is ready */
export default function Round5({ onComplete }) {
  return (
    <div className="rg-root">
      <div className="rg-center">
        <div className="rg-card" style={{ '--rg-accent': '#f5f558', textAlign: 'center' }}>
          <div className="rg-round-badge">★ ROUND 05</div>
          <h1 className="rg-title">FINAL SHOWDOWN</h1>
          <p className="rg-desc" style={{ textAlign: 'center' }}>
            Round 5 content coming soon.<br />
            Click below to finish the game.
          </p>
          <button className="rg-btn" onClick={onComplete}>
            FINISH MISSION →
          </button>
        </div>
      </div>
    </div>
  );
}
