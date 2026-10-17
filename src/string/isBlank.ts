/**
 * Checks if a value is null, undefined, or a string containing only whitespace.
 *
 * Recognizes all standard and Unicode whitespace characters (including non-breaking spaces).
 *
 * @param value The value to inspect.
 * @returns `true` if `value` is null, undefined, or whitespace-only string; else `false`.
 *
 * @example
 * ```ts
 * isBlank(""); // true
 * isBlank("   "); // true
 * isBlank("\t\n\r"); // true
 * isBlank(null); // true
 * isBlank(undefined); // true
 * isBlank("  hello  "); // false
 * isBlank(123); // false
 * ```
 */
export function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value !== "string") {
    return false;
  }
  return value.trim().length === 0;
}
