/**
 * Capitalizes the first character of a string and converts the remaining characters to lowercase.
 *
 * @param value The string to capitalize.
 * @returns The capitalized string.
 * @throws {TypeError} If `value` is not a string.
 *
 * @example
 * ```ts
 * capitalize("hello world"); // "Hello world"
 * capitalize("HELLO"); // "Hello"
 * capitalize(""); // ""
 * ```
 */
export function capitalize(value: string): string {
  if (typeof value !== "string") {
    throw new TypeError(`Expected a string, received ${typeof value}`);
  }
  if (value.length === 0) {
    return "";
  }
  const firstChar = value.charAt(0).toUpperCase();
  const rest = value.slice(1).toLowerCase();
  return firstChar + rest;
}
