/**
 * Creates a new array with elements shuffled in random order using the Fisher-Yates algorithm.
 * An optional pseudo-random generator function can be injected for deterministic results in tests.
 *
 * @template T Type of array elements.
 * @param array The array to shuffle.
 * @param random A function that returns a floating-point number in the range [0, 1). Defaults to `Math.random`.
 * @returns A new shuffled array.
 * @throws {TypeError} If `array` is not an array or `random` is not a function.
 *
 * @example
 * ```ts
 * shuffle([1, 2, 3, 4, 5]); // e.g. [3, 1, 5, 2, 4]
 * shuffle([1, 2, 3], () => 0.5); // Deterministic output
 * ```
 */
export function shuffle<T>(array: readonly T[], random: () => number = Math.random): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError(`Expected an array, received ${typeof array}`);
  }
  if (typeof random !== "function") {
    throw new TypeError(`Expected random to be a function, received ${typeof random}`);
  }

  const result = array.slice();
  const len = result.length;

  for (let i = len - 1; i > 0; i--) {
    const r = random();
    const normalized = typeof r === "number" && !Number.isNaN(r) ? r : 0;
    // Ensure index j is within [0, i]
    const j = Math.min(i, Math.max(0, Math.floor(normalized * (i + 1))));

    const temp = result[i] as T;
    result[i] = result[j] as T;
    result[j] = temp;
  }

  return result;
}
