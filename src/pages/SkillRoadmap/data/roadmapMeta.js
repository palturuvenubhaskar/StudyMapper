// Shared enum values used by roadmap data and components. Kept separate from
// roadmapData.js so lightweight views don't pull in the full roadmap payload.
export const ROADMAP_CATEGORIES = [
  { id: 'all', label: 'All Roadmaps', count: 0 },
  { id: 'role', label: 'Role Based', count: 0 },
  { id: 'skill', label: 'Skill Based', count: 0 },
  { id: 'tool', label: 'Tools', count: 0 },
  { id: 'language', label: 'Languages', count: 0 },
  { id: 'framework', label: 'Frameworks', count: 0 },
  { id: 'database', label: 'Databases', count: 0 },
  { id: 'mobile', label: 'Mobile', count: 0 },
  { id: 'concept', label: 'Concepts', count: 0 },
  { id: 'beginner', label: 'Absolute Beginners', count: 0 },
  { id: 'best-practices', label: 'Best Practices', count: 0 },
];

export const NODE_TYPES = {
  TOPIC: 'topic',
  CHECKPOINT: 'checkpoint',
  SECTION: 'section',
  ANNOTATION: 'annotation',
  SUBTOPIC: 'subtopic',
};

export const CONN_TYPES = {
  SOLID: 'solid',
  DASHED: 'dashed',
};
