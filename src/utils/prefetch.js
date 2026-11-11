import { routeLoaders } from '../routes/routeLoaders';

// Warm the chunks for the main navigation so switching screens does not wait
// on a network round-trip for a ~30-140 KB route bundle.
const NAV_ROUTES = [
  'skillRoadmap',
  'placement',
  'codingPractice',
  'studyPlanner',
  'bookmarks',
  'accountSettings',
];

const PATH_TO_ROUTE = {
  '/': null, // Dashboard is part of the initial bundle.
  '/create': 'createSubject',
  '/roadmap': 'skillRoadmap',
  '/placement': 'placement',
  '/placement/aptitude': 'aptitudePractice',
  '/placement/technical': 'technicalInterview',
  '/placement/hr': 'hrInterview',
  '/coding': 'codingPractice',
  '/planner': 'studyPlanner',
  '/bookmarks': 'bookmarksPage',
  '/settings': 'accountSettings',
  '/search': 'searchPage',
  '/login': 'login',
  '/support': 'support',
  '/help': 'helpCenter',
};

const prefetched = new Set();
let roadmapDataPromise = null;

const canPrefetch = () => {
  if (typeof window === 'undefined') return false;
  const connection = navigator.connection;
  if (connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || ''))) {
    return false;
  }
  return true;
};

export function prefetchRoute(key) {
  const loader = routeLoaders[key];
  if (!loader || prefetched.has(key)) return undefined;
  prefetched.add(key);
  const promise = loader();
  // A failed prefetch must not poison the cache — the real navigation retries.
  promise.catch(() => prefetched.delete(key));
  return promise;
}

export function prefetchPath(path) {
  if (!canPrefetch()) return undefined;
  const route = PATH_TO_ROUTE[path];
  if (route) return prefetchRoute(route);

  // Data-driven routes: warm the shell, the id-specific data still loads.
  if (path.startsWith('/topic/')) return prefetchRoute('topicStudy');
  if (path.startsWith('/subject/')) return prefetchRoute('subjectView');
  if (path.startsWith('/qb/')) return prefetchRoute('questionBankView');
  return undefined;
}

export function prefetchNavRoutes() {
  if (!canPrefetch()) return;
  const run = () => NAV_ROUTES.forEach((key) => prefetchRoute(key));

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(run, { timeout: 4000 });
  } else {
    window.setTimeout(run, 1500);
  }
}

// The roadmap detail payload is ~140 KB gzipped, so it is only fetched when a
// roadmap card is hovered/focused, not with the browse list.
export function prefetchRoadmapData() {
  if (!canPrefetch()) return undefined;
  if (!roadmapDataPromise) {
    roadmapDataPromise = import('../pages/SkillRoadmap/data/roadmapData').catch(() => {
      roadmapDataPromise = null;
    });
  }
  return roadmapDataPromise;
}

export function prefetchAIAssistant() {
  prefetchRoute('aiAssistant');
}
