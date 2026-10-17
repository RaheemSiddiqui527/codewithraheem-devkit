/**
 * Returns a new array with duplicate values removed, preserving the order of their first appearance.
 *
 * @template T Type of array elements.
 * @param array The array to deduplicate.
 * @returns A new array with unique elements.
 * @throws {TypeError} If `array` is not an array.
 *
 * @example
 * ```ts
 * unique([1, 2, 2, 3, 1]); // [1, 2, 3]
 * ```
 */
export function unique<T>(array: readonly T[]): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError(`Expected an array, received ${typeof array}`);
  }
  return Array.from(new Set(array));
}
