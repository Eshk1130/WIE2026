import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';  // needed by LandingPage internals

import LandingPage  from './wie-week/Landing/LandingPage';
import HackAmongUs  from './wie-week/Transition_pages/HackAmongUs';

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

import Finish  from './wie-week/Transition_pages/finish';

import './index.css';

/*
  Full game flow:
  landing → hack_transition → round1t → round1
          → round2t → round2
          → round3t → round3
          → round4t → round4
          → round5t → round5
          → finish
*/

const STAGES = [
  'landing',
  'hack_transition',
  'round1t', 'round1',
  'round2t', 'round2',
  'round3t', 'round3',
  'round4t', 'round4',
  'round5t', 'round5',
  'finish',
];

function next(stage) {
  const i = STAGES.indexOf(stage);
  return i >= 0 && i < STAGES.length - 1 ? STAGES[i + 1] : 'finish';
}

export default function App() {
  const [stage, setStage] = useState('landing');
  const advance = () => setStage(s => next(s));

  return (
    <BrowserRouter>
      {stage === 'landing'         && <LandingPage  onStart={advance} />}
      {stage === 'hack_transition' && <HackAmongUs  onComplete={advance} />}
      {stage === 'round1t'         && <Round1T      onStart={advance} />}
      {stage === 'round1'          && <Round1       onComplete={advance} />}
      {stage === 'round2t'         && <Round2T      onStart={advance} />}
      {stage === 'round2'          && <Round2       onComplete={advance} />}
      {stage === 'round3t'         && <Round3T      onStart={advance} />}
      {stage === 'round3'          && <Round3       onComplete={advance} />}
      {stage === 'round4t'         && <Round4T      onStart={advance} />}
      {stage === 'round4'          && <Round4       onComplete={advance} />}
      {stage === 'round5t'         && <Round5T      onStart={advance} />}
      {stage === 'round5'          && <Round5       onComplete={advance} />}
      {stage === 'finish'          && <Finish       onRestart={() => setStage('landing')} />}
    </BrowserRouter>
  );
}
