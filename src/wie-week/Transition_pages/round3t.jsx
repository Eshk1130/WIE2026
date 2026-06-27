import RoundGuidelines from './RoundGuidelines';

export default function Round3T({ onStart }) {
    return (
        <RoundGuidelines
            roundNum={3}
            title="HACK AMONG US"
            accent="#c51111"
            icon="☣"
            description="The impostor has seized control of the ship's core systems and embedded a secret override key deep within the architecture. You must locate this hidden key before O2 levels reach critical failure."
            rules={[
                'A secret key — SABOTAGE-DEFEATED-WIE2026 — is hidden across the system.',
                'Hunt through the Hex Stream on the left panel: decode Hex to ASCII to reveal it.',
                'Check the JavaScript console — solve the riddle and run the function it hints at.',
                'Inspect Local Storage (DevTools → Application) for a direct key entry.',
                'Find the O2 Scrubber Easter Egg: click Left fan twice, then Right fan once.',
                'The first team to locate and submit the correct key escapes the sabotage.',
            ]}
            onStart={onStart}
        />
    );
}
