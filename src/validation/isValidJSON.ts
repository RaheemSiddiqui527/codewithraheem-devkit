/**
 * Determines whether a given value is a valid JSON string.
 *
 * @param value The value to test.
 * @returns `true` if `value` is a valid JSON string, otherwise `false`.
 *
 * @example
 * ```ts
 * isValidJSON('{"key": "value"}'); // true
 * isValidJSON("[1, 2, 3]"); // true
 * isValidJSON("invalid json"); // false
 * isValidJSON(123); // false
 * ```
 */
export function isValidJSON(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}
