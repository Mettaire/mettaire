import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Returns true if motion should be reduced — honoring BOTH the OS-level
 * prefers-reduced-motion and the site's in-app accessibility setting
 * (data-motion="reduced" on <html>, toggled in Settings). Reacts live to the
 * in-app toggle so reveals respond without a reload.
 */
export function useReducedMotionPref() {
  const systemReduced = useReducedMotion();
  const [appReduced, setAppReduced] = useState(
    () =>
      typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-motion') === 'reduced'
  );

  useEffect(() => {
    const el = document.documentElement;
    const update = () => setAppReduced(el.getAttribute('data-motion') === 'reduced');
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ['data-motion'] });
    return () => observer.disconnect();
  }, []);

  return Boolean(systemReduced) || appReduced;
}
