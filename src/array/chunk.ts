/**
 * Splits an array into chunks of specified size.
 *
 * @template T Type of array elements.
 * @param array The array to chunk.
 * @param size The maximum size of each chunk. Must be a positive integer.
 * @returns A new array containing chunked subarrays.
 * @throws {TypeError} If `array` is not an array.
 * @throws {RangeError} If `size` is not a positive integer (> 0).
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(array: readonly T[], size: number): T[][] {
  if (!Array.isArray(array)) {
    throw new TypeError(`Expected an array, received ${typeof array}`);
  }
  if (typeof size !== "number" || !Number.isInteger(size) || size <= 0) {
    throw new RangeError(
      `Chunk size must be an integer greater than 0, received: ${size}`
    );
  }

  if (array.length === 0) {
    return [];
  }

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
