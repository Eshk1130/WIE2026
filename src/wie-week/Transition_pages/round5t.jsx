import RoundGuidelines from './RoundGuidelines';

export default function Round5T({ onStart }) {
    return (
        <RoundGuidelines
            roundNum={5}
            title="FINAL SHOWDOWN"
            accent="#f5f558"
            icon="★"
            description="One last stand. The impostor is cornered but the ship's reactor is failing. Every surviving crewmate must prove their worth in the ultimate challenge — a rapid-fire gauntlet of everything you've learned."
            rules={[
                'This is the final round — all previous scores are combined for the grand total.',
                'Questions span all previous domains: aptitude, code, audio, and QR challenges.',
                'Speed is paramount — the leaderboard updates live as you answer.',
                'No second chances: each question is shown once and cannot be revisited.',
                'Collaborate with your team — discuss, deduce, then lock in your answer fast.',
                'The crew with the highest combined score wins the Crewmate Protocol championship.',
            ]}
            onStart={onStart}
        />
    );
}
