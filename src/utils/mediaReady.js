// Shared helpers for "wait until the visible media has actually loaded" so
// loading screens lift onto real content instead of a blank pop-in.

export const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

const inViewport = (el) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
};

/**
 * Resolve once every above-the-fold <img>/<video> inside `root` has loaded
 * (or errored), bounded by `timeLeft` ms so it can never hang. Off-screen /
 * lazy media below the fold is ignored.
 */
export function waitForVisibleMedia(root, timeLeft) {
  return new Promise((resolve) => {
    if (!root) return resolve();

    const pending = Array.from(root.querySelectorAll('img, video')).filter((el) => {
      if (!inViewport(el)) return false;
      if (el.tagName === 'IMG') return !el.complete || el.naturalWidth === 0;
      return el.readyState < 3; // video: < HAVE_FUTURE_DATA
    });

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    if (pending.length === 0) return finish();

    let remaining = pending.length;
    const onOne = () => {
      remaining -= 1;
      if (remaining <= 0) finish();
    };
    pending.forEach((el) => {
      const events = el.tagName === 'IMG' ? ['load', 'error'] : ['loadeddata', 'canplay', 'error'];
      events.forEach((ev) => el.addEventListener(ev, onOne, { once: true }));
    });

    window.setTimeout(finish, Math.max(0, timeLeft));
  });
}
