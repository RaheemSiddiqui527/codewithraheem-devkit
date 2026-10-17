/**
 * Calculates the sum of all numbers in an array.
 * Returns `0` for an empty array.
 *
 * @param values Array of numbers to sum.
 * @returns The total sum.
 * @throws {TypeError} If `values` is not an array or contains non-numeric / NaN values.
 *
 * @example
 * ```ts
 * sum([1, 2, 3, 4]); // 10
 * sum([]); // 0
 * ```
 */
export function sum(values: readonly number[]): number {
  if (!Array.isArray(values)) {
    throw new TypeError(`Expected an array, received ${typeof values}`);
  }

  let total = 0;
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    if (typeof val !== "number" || Number.isNaN(val)) {
      throw new TypeError(`Array element at index ${i} is not a valid number: ${val}`);
    }
    total += val;
  }

  return total;
}
