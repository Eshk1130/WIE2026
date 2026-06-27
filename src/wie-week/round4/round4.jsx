import '../Transition_pages/RoundGuidelines.css';

/* Placeholder for Round 4 — swap this out when the real round is ready */
export default function Round4({ onComplete }) {
  return (
    <div className="rg-root">
      <div className="rg-center">
        <div className="rg-card" style={{ '--rg-accent': '#ed54ba', textAlign: 'center' }}>
          <div className="rg-round-badge">◉ ROUND 04</div>
          <h1 className="rg-title">QR + AUDIO</h1>
          <p className="rg-desc" style={{ textAlign: 'center' }}>
            Round 4 content coming soon. <br />
            Click below to continue to Round 5.
          </p>
          <button className="rg-btn" onClick={onComplete}>
            CONTINUE →
          </button>
        </div>
      </div>
    </div>
  );
}
