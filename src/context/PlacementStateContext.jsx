import { createContext, useContext, useCallback, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * NavigationStateContext
 * 
 * Automatically tracks the last-visited path within each app section.
 * When the user navigates to a section root (e.g. /placement, /coding),
 * the app will automatically redirect them to their last sub-page within that section.
 * 
 * Also provides per-page state persistence so component state survives
 * route changes within a session.
 */
const NavigationStateContext = createContext(null);

// Top-level sections that have sub-pages worth tracking.
const TRACKED_SECTIONS = {
  '/placement': true,
  '/roadmap': true,
  '/coding': true,
  '/settings': true,
  '/help': true,
  '/subject': true,
  '/qb': true,
  '/mock-exam': true,
};

/**
 * Given a path like "/placement/aptitude/learn", returns "/placement".
 */
function getSectionRoot(path) {
  if (path === '/') return '/';
  const match = path.match(/^(\/[^/]+)/);
  return match ? match[1] : path;
}

export function NavigationStateProvider({ children }) {
  const stateStore = useRef({});  // Per-page state slots
  const lastPathPerSection = useRef({}); // section root → last full path
  const location = useLocation();
  const navigate = useNavigate();
  const prevPathRef = useRef(location.pathname);

  // Core navigation tracking and auto-resume logic
  useEffect(() => {
    const path = location.pathname;
    const prevPath = prevPathRef.current;
    
    if (path !== prevPath) {
      const sectionRoot = getSectionRoot(path);
      const prevSectionRoot = getSectionRoot(prevPath);

      if (path === sectionRoot && prevSectionRoot === sectionRoot) {
        // 1. Intra-section navigation to root (e.g. Back button or clicking Sidebar item again)
        // Reset the saved path so they stay on the root hub.
        delete lastPathPerSection.current[sectionRoot];
      } 
      else if (path === sectionRoot && prevSectionRoot !== sectionRoot) {
        // 2. Entry into a section from outside
        // Auto-resume to last sub-page if we have one
        const savedPath = lastPathPerSection.current[sectionRoot];
        if (savedPath && savedPath !== path) {
          navigate(savedPath, { replace: true });
        }
      }
      else if (TRACKED_SECTIONS[sectionRoot] && path !== sectionRoot) {
        // 3. User is on a sub-page within a tracked section, remember it
        lastPathPerSection.current[sectionRoot] = path;
      }
    }

    prevPathRef.current = path;
  }, [location.pathname, navigate]);

  // --- Per-page state ---
  const getState = useCallback((key) => {
    return stateStore.current[key] || null;
  }, []);

  const setState = useCallback((key, state) => {
    stateStore.current[key] = state;
  }, []);

  const clearState = useCallback((key) => {
    delete stateStore.current[key];
  }, []);

  return (
    <NavigationStateContext.Provider value={{ getState, setState, clearState }}>
      {children}
    </NavigationStateContext.Provider>
  );
}

/**
 * Hook for any page to persist its component state across navigations.
 */
export function usePageState(pageKey) {
  const context = useContext(NavigationStateContext);
  if (!context) {
    throw new Error('usePageState must be used within NavigationStateProvider');
  }

  const loadState = useCallback(() => context.getState(pageKey), [context, pageKey]);
  const saveState = useCallback((state) => context.setState(pageKey, state), [context, pageKey]);
  const clearSavedState = useCallback(() => context.clearState(pageKey), [context, pageKey]);

  return { saveState, loadState, clearSavedState };
}

// Backward-compatible alias for Placement
export const usePlacementState = usePageState;
export const PlacementStateProvider = NavigationStateProvider;

