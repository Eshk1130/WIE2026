/**
 * src/data/codingQuestions.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Round 2 coding modules — 4 languages × 4 output-prediction questions each.
 * Each module produces a 4-digit pass-code from the concatenated answers.
 *
 * Structure mirrors api.js MOCK_ROUND2_MODULES for drop-in compatibility.
 */

const CODING_QUESTIONS = [
  {
    id: 1,
    lang: 'C++',
    icon: '⚙',
    col: '#00b4ff',
    rgb: '0,180,255',
    questions: [
      {
        title: 'Q1 — POWER ROUTER',
        lines: [
          { c: 'cm', t: '// What is the output?' },
          { t: '' },
          { c: 'fn', t: 'int main() {' },
          { t: '    int x = 1 + 2;' },
          { t: '    cout << x;' },
          { t: '}' },
        ],
        answer: '3',
      },
      {
        title: 'Q2 — POWER ROUTER',
        lines: [
          { c: 'cm', t: '// What is the output?' },
          { t: '' },
          { c: 'fn', t: 'int main() {' },
          { t: '    int x = 3;' },
          { t: '    x *= 2;' },
          { t: '    cout << x;' },
          { t: '}' },
        ],
        answer: '6',
      },
      {
        title: 'Q3 — POWER ROUTER',
        lines: [
          { c: 'cm', t: '// What is the output?' },
          { t: '' },
          { c: 'fn', t: 'int main() {' },
          { t: '    cout << 10 / 5;' },
          { t: '}' },
        ],
        answer: '2',
      },
      {
        title: 'Q4 — POWER ROUTER',
        lines: [
          { c: 'cm', t: '// What is the output?' },
          { t: '' },
          { c: 'fn', t: 'int main() {' },
          { t: '    int a = 5, b = 3;' },
          { t: '    cout << a + b;' },
          { t: '}' },
        ],
        answer: '8',
      },
    ],
  },
  {
    id: 2,
    lang: 'C',
    icon: '⚡',
    col: '#ff3232',
    rgb: '255,50,50',
    questions: [
      {
        title: 'Q1 — CIRCUIT CAL',
        lines: [
          { c: 'cm', t: '/* What is the output? */' },
          { t: '' },
          { c: 'fn', t: 'int main() {' },
          { t: '    printf("%d", 2 * 2);' },
          { t: '}' },
        ],
        answer: '4',
      },
      {
        title: 'Q2 — CIRCUIT CAL',
        lines: [
          { c: 'cm', t: '/* What is the output? */' },
          { t: '' },
          { c: 'fn', t: 'int main() {' },
          { t: '    int x = 10;' },
          { t: '    printf("%d", x - 3);' },
          { t: '}' },
        ],
        answer: '7',
      },
      {
        title: 'Q3 — CIRCUIT CAL',
        lines: [
          { c: 'cm', t: '/* What is the output? */' },
          { t: '' },
          { c: 'fn', t: 'int main() {' },
          { t: '    printf("%d", 5 / 5);' },
          { t: '}' },
        ],
        answer: '1',
      },
      {
        title: 'Q4 — CIRCUIT CAL',
        lines: [
          { c: 'cm', t: '/* What is the output? */' },
          { t: '' },
          { c: 'fn', t: 'int main() {' },
          { t: '    int a = 2, b = 3;' },
          { t: '    printf("%d", a + b);' },
          { t: '}' },
        ],
        answer: '5',
      },
    ],
  },
  {
    id: 3,
    lang: 'PYTHON',
    icon: '🐍',
    col: '#ffa000',
    rgb: '255,160,0',
    questions: [
      {
        title: 'Q1 — FUSE CTRL',
        lines: [
          { c: 'cm', t: '# What is the output?' },
          { t: '' },
          { t: 'print(2 + 3)' },
        ],
        answer: '5',
      },
      {
        title: 'Q2 — FUSE CTRL',
        lines: [
          { c: 'cm', t: '# What is the output?' },
          { t: '' },
          { t: 'x = 6 // 2' },
          { t: 'print(x)' },
        ],
        answer: '3',
      },
      {
        title: 'Q3 — FUSE CTRL',
        lines: [
          { c: 'cm', t: '# What is the output?' },
          { t: '' },
          { t: 'print(3 ** 2)' },
        ],
        answer: '9',
      },
      {
        title: 'Q4 — FUSE CTRL',
        lines: [
          { c: 'cm', t: '# What is the output?' },
          { t: '' },
          { t: 'print(8 - 6)' },
        ],
        answer: '2',
      },
    ],
  },
  {
    id: 4,
    lang: 'JAVA',
    icon: '☕',
    col: '#ffcc00',
    rgb: '255,200,0',
    questions: [
      {
        title: 'Q1 — POWER DIST',
        lines: [
          { c: 'cm', t: '// What is the output?' },
          { t: '' },
          { c: 'fn', t: 'public static void main(String[] args) {' },
          { t: '    System.out.println(3 + 4);' },
          { t: '}' },
        ],
        answer: '7',
      },
      {
        title: 'Q2 — POWER DIST',
        lines: [
          { c: 'cm', t: '// What is the output?' },
          { t: '' },
          { c: 'fn', t: 'public static void main(String[] args) {' },
          { t: '    System.out.println(8 / 2);' },
          { t: '}' },
        ],
        answer: '4',
      },
      {
        title: 'Q3 — POWER DIST',
        lines: [
          { c: 'cm', t: '// What is the output?' },
          { t: '' },
          { c: 'fn', t: 'public static void main(String[] args) {' },
          { t: '    int x = 2; x += 4;' },
          { t: '    System.out.println(x);' },
          { t: '}' },
        ],
        answer: '6',
      },
      {
        title: 'Q4 — POWER DIST',
        lines: [
          { c: 'cm', t: '// What is the output?' },
          { t: '' },
          { c: 'fn', t: 'public static void main(String[] args) {' },
          { t: '    System.out.println(5 - 5);' },
          { t: '}' },
        ],
        answer: '0',
      },
    ],
  },
];

export default CODING_QUESTIONS;
