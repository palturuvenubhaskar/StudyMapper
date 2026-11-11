import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query. Used to mount only the parts of the shell
 * that can actually be seen (e.g. the desktop-only right rail, whose focus
 * timer would otherwise keep ticking behind the mobile layout).
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia(query);
    const handleChange = (event) => setMatches(event.matches);
    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

export default useMediaQuery;
