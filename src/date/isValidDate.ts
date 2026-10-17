/**
 * Checks whether a value is a valid, non-NaN JavaScript `Date` instance.
 *
 * @param value The value to inspect.
 * @returns `true` if `value` is a valid `Date`, else `false`.
 *
 * @example
 * ```ts
 * isValidDate(new Date()); // true
 * isValidDate(new Date("2025-01-01")); // true
 * isValidDate(new Date("invalid date")); // false
 * isValidDate("2025-01-01"); // false
 * isValidDate(null); // false
 * ```
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
