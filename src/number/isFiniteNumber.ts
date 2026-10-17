/**
 * Checks whether the passed value is a finite number.
 * Unlike global `isFinite`, this function does not coerce non-numeric values to numbers.
 *
 * @param value The value to test.
 * @returns `true` if `value` is a finite number; else `false`.
 *
 * @example
 * ```ts
 * isFiniteNumber(42); // true
 * isFiniteNumber(3.14); // true
 * isFiniteNumber(Infinity); // false
 * isFiniteNumber(-Infinity); // false
 * isFiniteNumber(NaN); // false
 * isFiniteNumber("42"); // false (global isFinite("42") is true)
 * ```
 */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
