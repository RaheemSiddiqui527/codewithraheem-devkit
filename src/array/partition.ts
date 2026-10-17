/**
 * Splits an array into two arrays based on a predicate function:
 * the first containing elements for which the predicate returned truthy,
 * and the second containing elements for which it returned falsy.
 *
 * @template T Type of array elements.
 * @template S Narrowed type when using a type guard predicate.
 * @param array The array to partition.
 * @param predicate The function invoked per iteration.
 * @returns A tuple of `[truthyElements, falsyElements]`.
 * @throws {TypeError} If `array` is not an array or `predicate` is not a function.
 *
 * @example
 * ```ts
 * partition([1, 2, 3, 4], (n) => n % 2 === 0); // [[2, 4], [1, 3]]
 * ```
 */
export function partition<T, S extends T>(
  array: readonly T[],
  predicate: (item: T, index: number) => item is S
): [S[], Exclude<T, S>[]];
export function partition<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean
): [T[], T[]];
export function partition<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean
): [T[], T[]] {
  if (!Array.isArray(array)) {
    throw new TypeError(`Expected an array, received ${typeof array}`);
  }
  if (typeof predicate !== "function") {
    throw new TypeError(
      `Expected predicate to be a function, received ${typeof predicate}`
    );
  }

  const truthy: T[] = [];
  const falsy: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i] as T;
    if (predicate(item, i)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }

  return [truthy, falsy];
}
