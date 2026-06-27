import RoundGuidelines from './RoundGuidelines';

export default function Round2T({ onStart }) {
    return (
        <RoundGuidelines
            roundNum={2}
            title="ANOMALY DETECTION"
            accent="#ff6b35"
            icon="⚠"
            description="The ship's systems are riddled with bugs planted by the impostor. As the crew's lead analyst, you must inspect corrupted code modules, identify hidden anomalies, and patch the systems before the ship fails."
            rules={[
                'Each challenge shows a code snippet — identify the bug or anomaly hidden within.',
                'Select the correct line or option that contains the problem.',
                'Speed and accuracy both matter — faster correct answers score higher.',
                'Some modules have multiple issues — read carefully before selecting.',
                'Sabotaged logs may try to mislead you — trust your technical instincts.',
                'Complete all modules to restore ship integrity and advance to Round 3.',
            ]}
            onStart={onStart}
        />
    );
}
