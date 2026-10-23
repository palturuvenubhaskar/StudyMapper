export { ROADMAP_CATEGORIES } from './roadmapMeta';
import { ROADMAP_SUMMARIES } from './roadmapSummaries';

export const ALL_ROADMAPS = ROADMAP_SUMMARIES;

const byId = new Map(ALL_ROADMAPS.map(r => [r.id, r]));

export const getRoadmapSummary = (id) => byId.get(id);

export const getCategoryCounts = () => {
  const counts = { all: ALL_ROADMAPS.length };
  for (const r of ALL_ROADMAPS) {
    counts[r.category] = (counts[r.category] || 0) + 1;
  }
  return counts;
};
