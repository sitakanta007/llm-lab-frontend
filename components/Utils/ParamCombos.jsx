/**
 * Build a map of parameter arrays (ranges) from the `params` object.
 * Works with any number of parameters dynamically.
 */
export function buildRangeMap(params) {
  const map = {};
  for (const key of Object.keys(params)) {
    const { range, step } = params[key];
    map[key] = buildRange(range[0], range[1], step);
  }
  return map;
}

export function buildRange(min, max, step) {
  const out = [];
  const m = Number(min), M = Number(max), s = Number(step);
  if ([m, M, s].some(x => Number.isNaN(x)) || s <= 0 || M < m) return out;
  let x = Number(m.toFixed(4));
  const end = Number(M.toFixed(4));
  while (x <= end + 1e-9) {
    out.push(Number(x.toFixed(4)));
    x += s;
  }
  return out;
}

/**
 * Compute total number of combinations from the range map.
 */
export function getComboCount(rangeMap) {
  return Object.values(rangeMap)
    .map(arr => arr.length)
    .reduce((acc, len) => acc * len, 1);
}

/**
 * Build the actual combinations using a cartesian product.
 * Each parameter key maps to every value in its range.
 */
export function buildCombos(rangeMap) {
  const keys = Object.keys(rangeMap);
  let combos = [{}];

  for (const key of keys) {
    const newCombos = [];
    for (const existing of combos) {
      for (const value of rangeMap[key]) {
        newCombos.push({ ...existing, [key]: value });
      }
    }
    combos = newCombos;
  }

  return combos;
}
