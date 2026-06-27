import RoundGuidelines from './RoundGuidelines';

export default function Round1T({ onStart }) {
    return (
        <RoundGuidelines
            roundNum={1}
            title="ADMIN TABLE"
            accent="#3a8fc7"
            icon="⬡"
            description="The ship's admin console has been compromised. Your mission is to answer a series of aptitude, logic, and technical questions to verify your identity as a genuine crewmate — not an impostor."
            rules={[
                'Answer all 20 questions before submitting — each one counts.',
                'Use NEXT and BACK to navigate freely between questions at any time.',
                'Select exactly one answer per question — you can change it before submitting.',
                'All 20 answers must be locked in before proceeding to Round 2.',
                'Questions cover MCQs, aptitude puzzles, logic riddles, and tech knowledge.',
                'One answer per question — choose wisely, crewmate. The ship is watching.',
            ]}
            onStart={onStart}
        />
    );
}
