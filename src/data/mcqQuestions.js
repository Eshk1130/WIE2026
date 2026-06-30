/**
 * src/data/mcqQuestions.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Round 1 MCQ question bank — 20 questions across 4 categories.
 * Each question: { id, q, opts, ans, category }
 *   id   — unique question identifier (used in scoring detail)
 *   q    — question text
 *   opts — array of 4 option strings
 *   ans  — 0-based index of the correct option
 *   category — grouping label
 */

const MCQ_QUESTIONS = [
  // ── Category 1: Computer Science Fundamentals ───────────────────────────────
  {
    id: 'q1',
    category: 'CS Fundamentals',
    q: 'What does CPU stand for?',
    opts: ['Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Core Processing Unit'],
    ans: 1,
  },
  {
    id: 'q2',
    category: 'CS Fundamentals',
    q: 'Which data structure follows LIFO order?',
    opts: ['Queue', 'Stack', 'Tree', 'Graph'],
    ans: 1,
  },
  {
    id: 'q3',
    category: 'CS Fundamentals',
    q: 'What does RAM stand for?',
    opts: ['Read Access Memory', 'Random Access Memory', 'Rapid Access Module', 'Runtime Allocated Memory'],
    ans: 1,
  },
  {
    id: 'q4',
    category: 'CS Fundamentals',
    q: 'Time complexity of binary search?',
    opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
    ans: 2,
  },
  {
    id: 'q5',
    category: 'CS Fundamentals',
    q: 'Which of these is NOT an OOP concept?',
    opts: ['Encapsulation', 'Polymorphism', 'Compilation', 'Inheritance'],
    ans: 2,
  },

  // ── Category 2: Networking & Web ───────────────────────────────────────────
  {
    id: 'q6',
    category: 'Networking & Web',
    q: 'Who invented the World Wide Web?',
    opts: ['Bill Gates', 'Steve Jobs', 'Tim Berners-Lee', 'Linus Torvalds'],
    ans: 2,
  },
  {
    id: 'q7',
    category: 'Networking & Web',
    q: 'Which protocol is used for secure web browsing?',
    opts: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
    ans: 2,
  },
  {
    id: 'q8',
    category: 'Networking & Web',
    q: 'Which HTML tag creates the largest heading?',
    opts: ['<h6>', '<heading>', '<h1>', '<head>'],
    ans: 2,
  },
  {
    id: 'q9',
    category: 'Networking & Web',
    q: 'Which language is used for styling web pages?',
    opts: ['HTML', 'JavaScript', 'CSS', 'Python'],
    ans: 2,
  },
  {
    id: 'q10',
    category: 'Networking & Web',
    q: 'What does IoT stand for?',
    opts: ['Internet of Things', 'Internet of Technology', 'Integration of Things', 'Interface of Things'],
    ans: 0,
  },

  // ── Category 3: Programming & Algorithms ───────────────────────────────────
  {
    id: 'q11',
    category: 'Programming & Algorithms',
    q: 'Which keyword declares a constant in JavaScript?',
    opts: ['var', 'let', 'const', 'static'],
    ans: 2,
  },
  {
    id: 'q12',
    category: 'Programming & Algorithms',
    q: 'What does SQL stand for?',
    opts: ['Structured Query Language', 'Simple Query Logic', 'Standard Query Language', 'System Query List'],
    ans: 0,
  },
  {
    id: 'q13',
    category: 'Programming & Algorithms',
    q: 'Which sorting algorithm has best average O(n log n)?',
    opts: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Selection Sort'],
    ans: 2,
  },
  {
    id: 'q14',
    category: 'Programming & Algorithms',
    q: 'What is 2 raised to the power of 10?',
    opts: ['20', '1024', '512', '2048'],
    ans: 1,
  },
  {
    id: 'q15',
    category: 'Programming & Algorithms',
    q: 'Binary representation of decimal 10?',
    opts: ['1010', '1001', '1100', '0110'],
    ans: 0,
  },

  // ── Category 4: General Tech & Science ────────────────────────────────────
  {
    id: 'q16',
    category: 'General Tech',
    q: 'What is the capital of France?',
    opts: ['Berlin', 'Paris', 'Madrid', 'Rome'],
    ans: 1,
  },
  {
    id: 'q17',
    category: 'General Tech',
    q: 'Which planet is known as the Red Planet?',
    opts: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
    ans: 2,
  },
  {
    id: 'q18',
    category: 'General Tech',
    q: 'Which company developed the Android OS?',
    opts: ['Apple', 'Microsoft', 'Samsung', 'Google'],
    ans: 3,
  },
  {
    id: 'q19',
    category: 'General Tech',
    q: 'What is the value of π to 2 decimal places?',
    opts: ['3.12', '3.14', '3.16', '3.18'],
    ans: 1,
  },
  {
    id: 'q20',
    category: 'General Tech',
    q: 'Which gate outputs 1 only when both inputs are 1?',
    opts: ['OR', 'NOT', 'AND', 'XOR'],
    ans: 2,
  },
];

export default MCQ_QUESTIONS;
