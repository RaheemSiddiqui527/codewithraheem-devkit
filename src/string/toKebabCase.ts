/**
 * Converts a string to kebab-case.
 *
 * @param value The string to convert.
 * @returns The kebab-cased string.
 * @throws {TypeError} If `value` is not a string.
 *
 * @example
 * ```ts
 * toKebabCase("helloWorld"); // "hello-world"
 * toKebabCase("UserProfileID"); // "user-profile-id"
 * toKebabCase("APIResponse"); // "api-response"
 * ```
 */
export function toKebabCase(value: string): string {
  if (typeof value !== "string") {
    throw new TypeError(`Expected a string, received ${typeof value}`);
  }

  const matches = value.match(/[A-Z]?[a-z]+|[A-Z]+(?![a-z])|\d+/g);
  if (!matches || matches.length === 0) {
    return "";
  }

  return matches.map((word) => word.toLowerCase()).join("-");
}
