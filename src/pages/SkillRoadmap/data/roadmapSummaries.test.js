import { describe, it, expect } from 'vitest';
import { ROADMAP_SUMMARIES } from './roadmapSummaries';
import { DETAILED_ROADMAPS } from './roadmapData';

describe('roadmap summaries', () => {
  it('stays in sync with the detailed roadmap data', () => {
    const expected = DETAILED_ROADMAPS.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
    }));
    expect(ROADMAP_SUMMARIES).toEqual(expected);
  });
});
