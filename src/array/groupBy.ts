/**
 * Groups the elements of an array based on the result of calling a key-generating function on each element.
 *
 * @template T Type of array elements.
 * @template K Type of grouping key.
 * @param array The array to iterate over.
 * @param keyFn The function that produces the grouping key for each element.
 * @returns An object with keys mapping to arrays of matching elements.
 * @throws {TypeError} If `array` is not an array or `keyFn` is not a function.
 *
 * @example
 * ```ts
 * groupBy(['one', 'two', 'three'], (item) => item.length);
 * // { 3: ['one', 'two'], 5: ['three'] }
 * ```
 */
export function groupBy<T, K extends PropertyKey>(
  array: readonly T[],
  keyFn: (item: T, index: number) => K
): Record<K, T[]> {
  if (!Array.isArray(array)) {
    throw new TypeError(`Expected an array, received ${typeof array}`);
  }
  if (typeof keyFn !== "function") {
    throw new TypeError(`Expected keyFn to be a function, received ${typeof keyFn}`);
  }

  const result = {} as Record<K, T[]>;
  for (let i = 0; i < array.length; i++) {
    const item = array[i] as T;
    const key = keyFn(item, i);
    const group = result[key];
    if (group) {
      group.push(item);
    } else {
      result[key] = [item];
    }
  }
  return result;
}
