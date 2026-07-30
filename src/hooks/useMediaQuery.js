import { useSyncExternalStore } from 'react';

/**
 * Subscribe to a CSS media query from React.
 *
 * useSyncExternalStore (not useState + useEffect) so the first render already
 * has the correct value — no flash of the wrong variant, and no setState-in-
 * effect cascade.
 */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false // server/prerender fallback: assume desktop
  );
}
