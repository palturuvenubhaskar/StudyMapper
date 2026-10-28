import {
  Type, Calculator, GitBranch, Repeat, Box, List, TerminalSquare,
  Database, Cpu, FileCode, CheckCircle2, Code2,
} from 'lucide-react';

export const LANGUAGES = ['HTML', 'CSS', 'C', 'C++', 'C#', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'R', 'Dart', 'Scala'];

export const CURRICULUMS = {
  HTML: [
    { title: 'HTML Basics and Structure', icon: FileCode, time: '5 mins' },
    { title: 'Headings, Paragraphs, and Text', icon: Type, time: '8 mins' },
    { title: 'Links and Images', icon: Box, time: '8 mins' },
    { title: 'Lists (Ordered and Unordered)', icon: List, time: '8 mins' },
    { title: 'Tables and Data Display', icon: Database, time: '10 mins' },
    { title: 'Forms and Input Elements', icon: TerminalSquare, time: '12 mins' },
    { title: 'Semantic HTML Elements', icon: Cpu, time: '10 mins' },
    { title: 'Audio, Video, and Media', icon: Box, time: '10 mins' },
    { title: 'HTML Accessibility Basics', icon: CheckCircle2, time: '10 mins' },
    { title: 'Building a Complete Web Page', icon: Code2, time: '15 mins' }
  ],
  CSS: [
    { title: 'CSS Basics and Selectors', icon: FileCode, time: '5 mins' },
    { title: 'Colors, Fonts, and Text Styling', icon: Type, time: '8 mins' },
    { title: 'Box Model (Margin, Padding, Border)', icon: Box, time: '10 mins' },
    { title: 'Display and Positioning', icon: GitBranch, time: '12 mins' },
    { title: 'Flexbox Layout', icon: List, time: '15 mins' },
    { title: 'CSS Grid Layout', icon: Database, time: '15 mins' },
    { title: 'Responsive Design and Media Queries', icon: TerminalSquare, time: '12 mins' },
    { title: 'Transitions and Animations', icon: Repeat, time: '12 mins' },
    { title: 'Pseudo-classes and Pseudo-elements', icon: Calculator, time: '10 mins' },
    { title: 'Building a Responsive Page', icon: Code2, time: '20 mins' }
  ],
  default: [
    { title: 'Hello World & Program Structure', icon: Code2, time: '5 mins' },
    { title: 'Variables and Data Types', icon: Type, time: '5 mins' },
    { title: 'Basic Input & Output', icon: TerminalSquare, time: '5 mins' },
    { title: 'Basic Operators and Math', icon: Calculator, time: '8 mins' },
    { title: 'Conditionals (If/Else)', icon: GitBranch, time: '10 mins' },
    { title: 'Loops (For and While)', icon: Repeat, time: '12 mins' },
    { title: 'Pattern Printing', icon: Box, time: '10 mins' },
    { title: 'Functions and Scope', icon: Box, time: '15 mins' },
    { title: 'Arrays / Lists Basics', icon: List, time: '12 mins' },
    { title: 'Number Problems & Math Logic', icon: Calculator, time: '12 mins' },
    { title: 'Strings and Manipulation', icon: TerminalSquare, time: '10 mins' },
    { title: 'Dictionaries / Maps / Objects', icon: Database, time: '15 mins' },
    { title: 'Error Handling & Exceptions', icon: FileCode, time: '10 mins' },
    { title: 'Object-Oriented Basics', icon: Cpu, time: '20 mins' },
    { title: 'File I/O and Final Project', icon: FileCode, time: '15 mins' }
  ]
};

export const getCurriculum = (language) => CURRICULUMS[language] || CURRICULUMS.default;

/** Where a topic sits in its language track, or null when it is not part of it. */
export const getLessonStep = (language, topic) => {
  const curriculum = getCurriculum(language);
  const index = curriculum.findIndex((entry) => entry.title === topic);
  if (index < 0) return null;
  return { step: index + 1, total: curriculum.length, time: curriculum[index].time };
};
