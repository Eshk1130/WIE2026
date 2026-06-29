/* ── Round 5 — The Impostor Files — Mock Data ───────────────────────────── */

const COLORS = {
  1: '#3ed94e',  // James  — green
  2: '#f17d2a',  // Sarah  — orange
  3: '#1d9bf0',  // Daniel — blue
  4: '#e23636',  // Olivia — red
  5: '#d9d926',  // Michael — yellow (IMPOSTOR)
};

export const CREWMATES = [
  { id: 1, name: 'James Carter',   displayName: 'James Carter',   role: 'Captain',            color: COLORS[1], suspicious: false },
  { id: 2, name: 'Sarah Mitchell', displayName: 'Sarah Mitchell', role: 'Chief Engineer',      color: COLORS[2], suspicious: false },
  { id: 3, name: 'Daniel Brooks',  displayName: 'Daniel Brooks',  role: 'Navigation Officer',  color: COLORS[3], suspicious: false },
  { id: 4, name: 'Olivia Bennett', displayName: 'Olivia Bennett', role: 'Research Scientist',  color: COLORS[4], suspicious: false },
  { id: 5, name: 'Michael Foster', displayName: 'Michael Foster', role: 'Security Officer',    color: COLORS[5], suspicious: true  },
];

export const FILE_FOLDERS = [
  { key: 'taskHistory',     name: 'Task History',     type: 'File Folder', size: '—', dateModified: '2-06-2026 11:05 PM', openable: true },
  { key: 'personalProfile', name: 'Personal Profile', type: 'File Folder', size: '—', dateModified: '2-06-2026 11:05 PM', openable: true },
  { key: 'messageHistory',  name: 'Message History',  type: 'File Folder', size: '—', dateModified: '2-06-2026 11:05 PM', openable: true },
  { key: 'accessLog',       name: 'Access Log',       type: 'File Folder', size: '—', dateModified: '2-06-2026 11:05 PM', openable: true },
];

/* ═══════════════════════════════════════════════════════════════════════════
   TASK HISTORY
   ═══════════════════════════════════════════════════════════════════════════ */
const TASK_HISTORY = {
  1: [
    { id: 'T-101', task: 'Mission Briefing',            location: 'Bridge',         status: 'Completed', date: '08:05' },
    { id: 'T-102', task: 'Crew Authorization',          location: 'Admin',          status: 'Completed', date: '09:20' },
    { id: 'T-103', task: 'Communications Check',        location: 'Communications', status: 'Completed', date: '11:10' },
    { id: 'T-104', task: 'Emergency Broadcast Approval',location: 'Bridge',         status: 'Completed', date: '18:40' },
  ],
  2: [
    { id: 'E-201', task: 'Reactor Calibration', location: 'Reactor',     status: 'Completed', date: '14:05' },
    { id: 'E-202', task: 'Engine Diagnostics',  location: 'Engine Room', status: 'Completed', date: '15:10' },
    { id: 'E-203', task: 'Electrical Repair',   location: 'Electrical',  status: 'Completed', date: '16:30' },
    { id: 'E-204', task: 'Power Grid Test',     location: 'Electrical',  status: 'Completed', date: '17:20' },
  ],
  3: [
    { id: 'N-301', task: 'Navigation Calibration',  location: 'Navigation',     status: 'Completed', date: '10:10' },
    { id: 'N-302', task: 'Star Map Update',          location: 'Bridge',         status: 'Completed', date: '12:00' },
    { id: 'N-303', task: 'Communication Relay',      location: 'Communications', status: 'Completed', date: '16:25' },
    { id: 'N-304', task: 'Flight Path Verification', location: 'Navigation',     status: 'Completed', date: '18:05' },
  ],
  4: [
    { id: 'R-401', task: 'Sample Analysis',       location: 'Laboratory', status: 'Completed', date: '09:15' },
    { id: 'R-402', task: 'Medical Report',         location: 'MedBay',     status: 'Completed', date: '11:00' },
    { id: 'R-403', task: 'Specimen Storage',       location: 'Storage',    status: 'Completed', date: '15:30' },
    { id: 'R-404', task: 'Research Notes Upload',  location: 'Laboratory', status: 'Completed', date: '18:10' },
  ],
  5: [
    // S-501 and S-504 check out — Security area, access Granted
    // S-502: claims Reactor Override at Reactor — but access log says DENIED at 14:08
    // S-503: claims Navigation Update at Navigation — but access log says DENIED at 16:26
    { id: 'S-501', task: 'Camera Patrol',       location: 'Security',   status: 'Completed', date: '08:30' },
    { id: 'S-502', task: 'Reactor Override',    location: 'Reactor',    status: 'Completed', date: '14:08' },
    { id: 'S-503', task: 'Navigation Update',   location: 'Navigation', status: 'Completed', date: '16:26' },
    { id: 'S-504', task: 'Final Security Sweep',location: 'Security',   status: 'Completed', date: '18:35' },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   PERSONAL PROFILES
   ═══════════════════════════════════════════════════════════════════════════ */
const PERSONAL_PROFILES = {
  1: {
    crewId: 'C-001', role: 'Captain', certification: 'Level 5',
    department: 'Command', experience: '14 Years', emergencyContact: 'Earth Command',
    bloodType: 'O+', gender: 'Male',
    level: 14, xp: 1260, maxXp: 2000, rating: 1000, ratingPct: 'TOP 50%',
    gameStats: { gamesPlayed: 142, wins: 98, tasksCompleted: 1847 },
  },
  2: {
    crewId: 'E-002', role: 'Chief Engineer', certification: 'Level 5',
    department: 'Engineering', experience: '11 Years',
    bloodType: 'A-', gender: 'Female',
    level: 11, xp: 920, maxXp: 1500, rating: 880, ratingPct: 'TOP 60%',
    gameStats: { gamesPlayed: 110, wins: 72, tasksCompleted: 1350 },
  },
  3: {
    crewId: 'N-003', role: 'Navigation Officer', certification: 'Level 4',
    department: 'Navigation', experience: '8 Years',
    bloodType: 'B+', gender: 'Male',
    level: 8, xp: 1100, maxXp: 1800, rating: 950, ratingPct: 'TOP 55%',
    gameStats: { gamesPlayed: 128, wins: 85, tasksCompleted: 1620 },
  },
  4: {
    crewId: 'R-004', role: 'Research Scientist', certification: 'Level 3',
    department: 'Research', experience: '6 Years',
    bloodType: 'AB-', gender: 'Female',
    level: 6, xp: 450, maxXp: 1000, rating: 320, ratingPct: 'TOP 90%',
    gameStats: { gamesPlayed: 34, wins: 31, tasksCompleted: 98 },
  },
  5: {
    crewId: 'S-005', role: 'Security Officer', certification: 'Level 4',
    department: 'Security', experience: '9 Years',
    bloodType: 'O-', gender: 'Male',
    level: 9, xp: 780, maxXp: 1400, rating: 820, ratingPct: 'TOP 62%',
    gameStats: { gamesPlayed: 96, wins: 63, tasksCompleted: 1180 },
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   MESSAGE HISTORY  — per-crewmate 1-on-1 threads
   Structure: { conversations: [{contactId, contactName, lastMsg, time}], chatMessages: {contactId: [{sender, text, time, self}]} }
   ═══════════════════════════════════════════════════════════════════════════ */

const MESSAGE_HISTORY = {
  // ── James Carter (1) ──────────────────────────────────────────
  1: {
    conversations: [
      { contactId: 2, contactName: 'Sarah Mitchell',  lastMsg: 'Finish before 15:00.', time: '08:42' },
      { contactId: 5, contactName: 'Michael Foster',  lastMsg: 'Good work.',            time: '18:32' },
      { contactId: 3, contactName: 'Daniel Brooks',   lastMsg: 'Acknowledged.',         time: '16:07' },
    ],
    chatMessages: {
      2: [
        { sender: 'Sarah',  time: '08:40', text: 'Need reactor maintenance approval.' },
        { sender: 'James',  time: '08:42', text: 'Approved. Finish before 15:00.', self: true },
      ],
      5: [
        { sender: 'Michael',time: '18:30', text: 'Security sweep complete.' },
        { sender: 'James',  time: '18:32', text: 'Good work.', self: true },
      ],
      3: [
        { sender: 'Daniel', time: '16:05', text: 'Course updated successfully.' },
        { sender: 'James',  time: '16:07', text: 'Acknowledged.', self: true },
      ],
    },
  },

  // ── Sarah Mitchell (2) ────────────────────────────────────────
  2: {
    conversations: [
      { contactId: 1, contactName: 'James Carter',    lastMsg: 'Starting maintenance.',  time: '08:43' },
      { contactId: 4, contactName: 'Olivia Bennett',  lastMsg: 'Stable.',                time: '14:12' },
    ],
    chatMessages: {
      1: [
        { sender: 'James',  time: '08:40', text: 'Reactor authorization granted.' },
        { sender: 'Sarah',  time: '08:43', text: 'Starting maintenance.', self: true },
      ],
      4: [
        { sender: 'Olivia', time: '14:10', text: 'Power stable?' },
        { sender: 'Sarah',  time: '14:12', text: 'Stable.', self: true },
      ],
    },
  },

  // ── Daniel Brooks (3) ─────────────────────────────────────────
  3: {
    conversations: [
      { contactId: 4, contactName: 'Olivia Bennett', lastMsg: "I don't have clearance.", time: '13:15' },
      { contactId: 1, contactName: 'James Carter',   lastMsg: 'Done.',                   time: '18:07' },
    ],
    chatMessages: {
      4: [
        { sender: 'Olivia',  time: '13:10', text: 'Need Storage access.' },
        { sender: 'Daniel',  time: '13:15', text: "I don't have clearance.", self: true },
      ],
      1: [
        { sender: 'James',   time: '18:05', text: 'Navigation complete?' },
        { sender: 'Daniel',  time: '18:07', text: 'Done.', self: true },
      ],
    },
  },

  // ── Olivia Bennett (4) ────────────────────────────────────────
  4: {
    conversations: [
      { contactId: 2, contactName: 'Sarah Mitchell', lastMsg: 'Sending now.',         time: '13:02' },
      { contactId: 3, contactName: 'Daniel Brooks',  lastMsg: 'Captain approved it.', time: '15:32' },
    ],
    chatMessages: {
      2: [
        { sender: 'Sarah',  time: '13:00', text: 'Need more coolant.' },
        { sender: 'Olivia', time: '13:02', text: 'Sending now.', self: true },
      ],
      3: [
        { sender: 'Daniel', time: '15:30', text: 'Storage opened?' },
        { sender: 'Olivia', time: '15:32', text: 'Captain approved it.', self: true },
      ],
    },
  },

  // ── Michael Foster (5) ── IMPOSTOR ────────────────────────────
  5: {
    conversations: [
      { contactId: 1, contactName: 'James Carter',   lastMsg: 'Clear.',           time: '08:31' },
      { contactId: 2, contactName: 'Sarah Mitchell', lastMsg: 'Already fixed it.',time: '14:09' },
      { contactId: 3, contactName: 'Daniel Brooks',  lastMsg: 'I uploaded it.',   time: '16:28' },
    ],
    chatMessages: {
      1: [
        { sender: 'James',   time: '08:30', text: 'Security status?' },
        { sender: 'Michael', time: '08:31', text: 'Clear.', self: true },
      ],
      2: [
        // Sarah says she is repairing Reactor — Michael claims to have already done it
        // but his access log shows DENIED at Reactor at 14:08
        { sender: 'Sarah',   time: '14:07', text: "I'm repairing Reactor." },
        { sender: 'Michael', time: '14:09', text: 'Already fixed it.', self: true },
      ],
      3: [
        // Daniel says Navigation update done — Michael claims to have uploaded it
        // but his access log shows DENIED at Navigation at 16:26
        { sender: 'Daniel',  time: '16:26', text: 'Navigation update done.' },
        { sender: 'Michael', time: '16:28', text: 'I uploaded it.', self: true },
      ],
    },
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   ACCESS LOGS
   ═══════════════════════════════════════════════════════════════════════════ */
const ACCESS_LOGS = {
  1: [
    { timestamp: '08:03', action: 'ACCESS', location: 'Bridge',         detail: 'Granted', level: 'INFO' },
    { timestamp: '09:17', action: 'ACCESS', location: 'Admin',          detail: 'Granted', level: 'INFO' },
    { timestamp: '11:06', action: 'ACCESS', location: 'Communications', detail: 'Granted', level: 'INFO' },
    { timestamp: '18:39', action: 'ACCESS', location: 'Bridge',         detail: 'Granted', level: 'INFO' },
  ],
  2: [
    { timestamp: '14:02', action: 'ACCESS', location: 'Reactor',     detail: 'Granted', level: 'INFO' },
    { timestamp: '15:08', action: 'ACCESS', location: 'Engine Room', detail: 'Granted', level: 'INFO' },
    { timestamp: '16:27', action: 'ACCESS', location: 'Electrical',  detail: 'Granted', level: 'INFO' },
    { timestamp: '17:19', action: 'ACCESS', location: 'Electrical',  detail: 'Granted', level: 'INFO' },
  ],
  3: [
    { timestamp: '10:08', action: 'ACCESS', location: 'Navigation',     detail: 'Granted', level: 'INFO' },
    { timestamp: '11:58', action: 'ACCESS', location: 'Bridge',         detail: 'Granted', level: 'INFO' },
    { timestamp: '16:23', action: 'ACCESS', location: 'Communications', detail: 'Granted', level: 'INFO' },
    { timestamp: '18:04', action: 'ACCESS', location: 'Navigation',     detail: 'Granted', level: 'INFO' },
  ],
  4: [
    { timestamp: '09:12', action: 'ACCESS', location: 'Laboratory', detail: 'Granted', level: 'INFO' },
    { timestamp: '10:58', action: 'ACCESS', location: 'MedBay',     detail: 'Granted', level: 'INFO' },
    { timestamp: '15:28', action: 'ACCESS', location: 'Storage',    detail: 'Granted', level: 'INFO' },
    { timestamp: '18:09', action: 'ACCESS', location: 'Laboratory', detail: 'Granted', level: 'INFO' },
  ],
  5: [
    { timestamp: '08:29', action: 'ACCESS', location: 'Security',   detail: 'Granted', level: 'INFO' },
    // Claims to have done Reactor Override (S-502) at 14:08 — but was DENIED
    { timestamp: '14:08', action: 'ACCESS', location: 'Reactor',    detail: 'Denied',  level: 'WARNING', suspicious: true },
    // Claims to have done Navigation Update (S-503) at 16:26 — but was DENIED
    { timestamp: '16:26', action: 'ACCESS', location: 'Navigation', detail: 'Denied',  level: 'WARNING', suspicious: true },
    { timestamp: '18:34', action: 'ACCESS', location: 'Security',   detail: 'Granted', level: 'INFO' },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   SHIP REGULATIONS  (separate tab — the rulebook players use to solve puzzle)
   ═══════════════════════════════════════════════════════════════════════════ */
export const SHIP_REGULATIONS = [
  'Only the Chief Engineer may perform Reactor Calibration, Reactor Override, or Engine Diagnostics.',
  'Only the Navigation Officer may update Flight Routes or Navigation Data.',
  'Security Officers cannot enter Navigation or Reactor Control without emergency authorization.',
  'Any Denied access log means the associated task could not have been completed.',
  'Tasks marked Completed must have a corresponding Granted entry in the Access Log.',
  'Crew messages are timestamped and considered authentic.',
];

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC DATA GETTERS
   ═══════════════════════════════════════════════════════════════════════════ */
export function getTaskHistory(crewmateId)    { return TASK_HISTORY[crewmateId]      ?? []; }
export function getPersonalProfile(crewmateId){ return PERSONAL_PROFILES[crewmateId] ?? {}; }
export function getMessageHistory(crewmateId) { return MESSAGE_HISTORY[crewmateId]   ?? { conversations: [], chatMessages: {} }; }
export function getAccessLog(crewmateId)      { return ACCESS_LOGS[crewmateId]       ?? []; }
