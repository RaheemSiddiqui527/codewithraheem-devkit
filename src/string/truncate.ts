/**
 * Truncates a string if it exceeds a specified maximum length, appending a suffix.
 * Handles Unicode surrogate pairs accurately by splitting on full code points.
 *
 * @param value The string to truncate.
 * @param maxLength The maximum length of the resulting string, including the suffix.
 * @param suffix The string to append when truncated. Defaults to `...`.
 * @returns The truncated string with suffix, or the original string if within limit.
 * @throws {TypeError} If `value` or `suffix` is not a string, or `maxLength` is not a number.
 *
 * @example
 * ```ts
 * truncate("Hello, world!", 8); // "Hello..."
 * truncate("Hello, world!", 8, "…"); // "Hello, …"
 * truncate("Hello", 10); // "Hello"
 * truncate("🚀🚀🚀🚀🚀", 4); // "🚀..."
 * ```
 */
export function truncate(
  value: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (typeof value !== "string") {
    throw new TypeError(`Expected a string for value, received ${typeof value}`);
  }
  if (typeof maxLength !== "number" || Number.isNaN(maxLength)) {
    throw new TypeError(`Expected a number for maxLength, received ${typeof maxLength}`);
  }
  if (typeof suffix !== "string") {
    throw new TypeError(`Expected a string for suffix, received ${typeof suffix}`);
  }

  if (maxLength <= 0) {
    return "";
  }

  // Handle Unicode code points properly
  const chars = Array.from(value);
  const suffixChars = Array.from(suffix);

  if (chars.length <= maxLength) {
    return value;
  }

  if (suffixChars.length >= maxLength) {
    return suffixChars.slice(0, maxLength).join("");
  }

  const sliceLength = maxLength - suffixChars.length;
  return chars.slice(0, sliceLength).join("") + suffix;
}
