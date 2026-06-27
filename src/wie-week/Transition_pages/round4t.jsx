import RoundGuidelines from './RoundGuidelines';

export default function Round4T({ onStart }) {
    return (
        <RoundGuidelines
            roundNum={4}
            title="QR + AUDIO INTERCEPT"
            accent="#ed54ba"
            icon="◉"
            description="The impostor has scattered encoded transmissions across the ship. Intercept QR signals and decode audio clues to piece together the final coordinates of the impostor's escape pod."
            rules={[
                'Scan the QR codes displayed on screen — each reveals a fragment of a larger message.',
                'Listen carefully to the audio clips — hidden Morse or phonetic codes are embedded.',
                'Combine all fragments in the correct order to form the final answer.',
                'QR codes must be scanned using your phone or a QR reader — do not skip any.',
                'Audio clues play once — pay attention and note down what you hear.',
                'Submit the reconstructed message to intercept the impostor\'s escape route.',
            ]}
            onStart={onStart}
        />
    );
}
