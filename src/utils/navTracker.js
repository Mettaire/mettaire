// Tracks the most recently recorded route. App records the path in an effect,
// which (being an ancestor) runs AFTER child page effects — so when a page
// mounts, getLastPath() still reflects the route the user came FROM.
let lastPath = typeof window !== 'undefined' ? window.location.pathname : '/';

export const recordPath = (path) => {
  lastPath = path;
};

export const getLastPath = () => lastPath;
