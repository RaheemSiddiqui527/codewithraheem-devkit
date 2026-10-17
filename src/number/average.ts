import { sum } from "./sum.js";

/**
 * Calculates the arithmetic mean (average) of an array of numbers.
 * Returns `0` when given an empty array.
 *
 * @param values Array of numbers to average.
 * @returns The average value.
 * @throws {TypeError} If `values` is not an array or contains non-numeric / NaN values.
 *
 * @example
 * ```ts
 * average([1, 2, 3, 4, 5]); // 3
 * average([]); // 0
 * ```
 */
export function average(values: readonly number[]): number {
  if (!Array.isArray(values)) {
    throw new TypeError(`Expected an array, received ${typeof values}`);
  }
  if (values.length === 0) {
    return 0;
  }

  return sum(values) / values.length;
}
