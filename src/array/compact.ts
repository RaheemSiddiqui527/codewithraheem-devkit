export type Falsy = false | "" | 0 | 0n | null | undefined;

/**
 * Creates an array with all falsy values removed (`false`, `null`, `0`, `""`, `undefined`, and `NaN`).
 *
 * @template T Type of non-falsy array elements.
 * @param array The array to compact.
 * @returns A new array containing only truthy values.
 * @throws {TypeError} If `array` is not an array.
 *
 * @example
 * ```ts
 * compact([0, 1, false, 2, "", 3, null, undefined, NaN]); // [1, 2, 3]
 * ```
 */
export function compact<T>(array: readonly (T | Falsy)[]): T[] {
  if (!Array.isArray(array)) {
    throw new TypeError(`Expected an array, received ${typeof array}`);
  }
  return array.filter((item): item is T => Boolean(item));
}
