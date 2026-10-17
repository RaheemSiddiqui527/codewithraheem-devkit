/**
 * Flattens array a single level deep or up to the specified depth.
 *
 * @template T Resulting element type.
 * @param array The array to flatten.
 * @param depth The maximum recursion depth (default: 1).
 * @returns A new flattened array.
 * @throws {TypeError} If `array` is not an array.
 * @throws {RangeError} If `depth` is not a non-negative number.
 *
 * @example
 * ```ts
 * flatten([1, [2, [3, [4]], 5]]); // [1, 2, [3, [4]], 5]
 * flatten([1, [2, [3, [4]], 5]], 2); // [1, 2, 3, [4], 5]
 * flatten([1, [2, [3, [4]], 5]], Infinity); // [1, 2, 3, 4, 5]
 * ```
 */
export function flatten<T = unknown>(array: readonly unknown[], depth: number = 1): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError(`Expected an array, received ${typeof array}`);
  }
  if (typeof depth !== "number" || Number.isNaN(depth) || depth < 0) {
    throw new RangeError(`Depth must be a non-negative number, received: ${depth}`);
  }

  if (depth === 0 || array.length === 0) {
    return array.slice() as T[];
  }

  const result: unknown[] = [];

  function helper(arr: readonly unknown[], currentDepth: number): void {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (Array.isArray(item) && currentDepth > 0) {
        helper(item, currentDepth - 1);
      } else {
        result.push(item);
      }
    }
  }

  helper(array, depth);
  return result as T[];
}
