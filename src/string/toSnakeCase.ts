/**
 * Converts a string to snake_case.
 *
 * @param value The string to convert.
 * @returns The snake_cased string.
 * @throws {TypeError} If `value` is not a string.
 *
 * @example
 * ```ts
 * toSnakeCase("helloWorld"); // "hello_world"
 * toSnakeCase("UserProfileID"); // "user_profile_id"
 * toSnakeCase("APIResponse"); // "api_response"
 * ```
 */
export function toSnakeCase(value: string): string {
  if (typeof value !== "string") {
    throw new TypeError(`Expected a string, received ${typeof value}`);
  }

  const matches = value.match(/[A-Z]?[a-z]+|[A-Z]+(?![a-z])|\d+/g);
  if (!matches || matches.length === 0) {
    return "";
  }

  return matches.map((word) => word.toLowerCase()).join("_");
}
