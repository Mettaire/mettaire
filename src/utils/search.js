// Lightweight fuzzy search — no dependencies.

// Levenshtein edit distance between two short strings.
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let cur = new Array(n + 1);

  for (let i = 1; i <= m; i += 1) {
    cur[0] = i;
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}

// Allowed typos scale with token length (short words must be near-exact).
function maxDistanceFor(token) {
  if (token.length <= 3) return 0;
  if (token.length <= 5) return 1;
  return 2;
}

/**
 * True if every whitespace-separated token in `query` matches the combined
 * `fields` — either as an exact substring (fast, precise) or, failing that,
 * as a close (typo-tolerant) match to a word in the text.
 *
 * matchesSearch('tatto', ['Kirin', 'Tattoo on fake skin']) -> true
 * matchesSearch('absurdsim', ['...absurdism...']) -> true
 */
export function matchesSearch(query, fields) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return true;

  const haystack = fields.filter(Boolean).join(' ').toLowerCase();
  const words = haystack.split(/[^a-z0-9]+/).filter(Boolean);

  return q.split(/\s+/).every((token) => {
    if (haystack.includes(token)) return true; // exact substring
    const maxDist = maxDistanceFor(token);
    if (maxDist === 0) return false;
    return words.some(
      (w) => Math.abs(w.length - token.length) <= maxDist && levenshtein(token, w) <= maxDist
    );
  });
}
