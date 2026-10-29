import { Brain, Code, Users } from 'lucide-react';

/**
 * Single source of truth for the placement tracks.
 *
 * The topic list used to live only inside LearnMode, while the hub tried to
 * count progress from `placement_topics` — a table nothing ever writes to, so
 * every track showed 0%. Both screens now read from here.
 */
export const PLACEMENT_TRACKS = [
  {
    id: 'aptitude',
    name: 'Aptitude Practice',
    shortName: 'Aptitude',
    icon: Brain,
    color: '#6366f1',
    description: 'Quantitative, logical reasoning and verbal ability — the first round at most companies.',
    subcategories: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'],
    learnPath: '/placement/aptitude/learn',
    testPath: '/placement/aptitude/test',
    topics: [
      { id: 'profit-loss', title: 'Profit & Loss', difficulty: 'easy', estimated: 15 },
      { id: 'time-work', title: 'Time & Work', difficulty: 'medium', estimated: 20 },
      { id: 'percentages', title: 'Percentages', difficulty: 'easy', estimated: 10 },
      { id: 'ratio-proportion', title: 'Ratio & Proportion', difficulty: 'easy', estimated: 15 },
      { id: 'time-speed-distance', title: 'Time, Speed & Distance', difficulty: 'medium', estimated: 20 },
      { id: 'probability', title: 'Probability', difficulty: 'hard', estimated: 25 },
      { id: 'permutations', title: 'Permutations & Combinations', difficulty: 'hard', estimated: 30 },
      { id: 'data-interpretation', title: 'Data Interpretation', difficulty: 'medium', estimated: 25 },
      { id: 'logical-series', title: 'Logical Series', difficulty: 'easy', estimated: 15 },
      { id: 'blood-relations', title: 'Blood Relations', difficulty: 'easy', estimated: 10 },
      { id: 'syllogism', title: 'Syllogism', difficulty: 'medium', estimated: 20 },
      { id: 'verbal-analogy', title: 'Verbal Analogy', difficulty: 'easy', estimated: 10 },
    ],
  },
  {
    id: 'technical',
    name: 'Technical Interview',
    shortName: 'Technical',
    icon: Code,
    color: '#10b981',
    description: 'DSA, core CS subjects and system design — what the coding and technical rounds probe.',
    subcategories: ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'System Design', 'OOP'],
    learnPath: '/placement/technical/learn',
    testPath: '/placement/technical/test',
    topics: [
      { id: 'arrays-strings', title: 'Arrays & Strings', difficulty: 'easy', estimated: 30 },
      { id: 'linked-lists', title: 'Linked Lists', difficulty: 'medium', estimated: 35 },
      { id: 'stacks-queues', title: 'Stacks & Queues', difficulty: 'medium', estimated: 30 },
      { id: 'trees-graphs', title: 'Trees & Graphs', difficulty: 'hard', estimated: 45 },
      { id: 'sorting', title: 'Sorting Algorithms', difficulty: 'medium', estimated: 35 },
      { id: 'os-processes', title: 'Process Management', difficulty: 'medium', estimated: 30 },
      { id: 'os-memory', title: 'Memory Management', difficulty: 'hard', estimated: 40 },
      { id: 'dbms-normalization', title: 'DBMS Normalization', difficulty: 'medium', estimated: 30 },
      { id: 'sql-queries', title: 'SQL Queries', difficulty: 'medium', estimated: 25 },
      { id: 'cn-protocols', title: 'Network Protocols', difficulty: 'medium', estimated: 35 },
      { id: 'system-design-basics', title: 'System Design Basics', difficulty: 'hard', estimated: 50 },
      { id: 'oop-concepts', title: 'OOP Concepts', difficulty: 'easy', estimated: 25 },
    ],
  },
  {
    id: 'hr',
    name: 'HR & Behavioral',
    shortName: 'HR & Behavioral',
    icon: Users,
    color: '#f59e0b',
    description: 'Stories, structure and self-awareness for the conversation that decides the offer.',
    subcategories: ['STAR Method', 'Leadership', 'Teamwork', 'Conflict Resolution', 'Self Introduction', 'Company Research'],
    learnPath: '/placement/hr/learn',
    testPath: '/placement/hr/test',
    topics: [
      { id: 'star-method', title: 'STAR Method Framework', difficulty: 'easy', estimated: 20 },
      { id: 'tell-me-about-yourself', title: 'Tell Me About Yourself', difficulty: 'easy', estimated: 15 },
      { id: 'strengths-weaknesses', title: 'Strengths & Weaknesses', difficulty: 'easy', estimated: 20 },
      { id: 'why-this-company', title: 'Why This Company?', difficulty: 'easy', estimated: 15 },
      { id: 'conflict-resolution', title: 'Conflict Resolution', difficulty: 'medium', estimated: 25 },
      { id: 'leadership-examples', title: 'Leadership Examples', difficulty: 'medium', estimated: 30 },
      { id: 'teamwork-stories', title: 'Teamwork Stories', difficulty: 'medium', estimated: 25 },
      { id: 'failure-lessons', title: 'Lessons from Failure', difficulty: 'medium', estimated: 25 },
      { id: 'salary-negotiation', title: 'Salary Negotiation', difficulty: 'hard', estimated: 20 },
      { id: 'questions-for-interviewer', title: 'Questions for Interviewer', difficulty: 'easy', estimated: 15 },
    ],
  },
];

export const TRACKS_BY_ID = Object.fromEntries(PLACEMENT_TRACKS.map((track) => [track.id, track]));

/** `aptitude-profit-loss` -> { trackId, topic } */
export const TOPICS_BY_FULL_ID = Object.fromEntries(
  PLACEMENT_TRACKS.flatMap((track) =>
    track.topics.map((topic) => [`${track.id}-${topic.id}`, { trackId: track.id, topic }])
  )
);

export const TOTAL_TOPIC_COUNT = PLACEMENT_TRACKS.reduce((sum, track) => sum + track.topics.length, 0);

export function topicFullId(trackId, topicId) {
  return `${trackId}-${topicId}`;
}
