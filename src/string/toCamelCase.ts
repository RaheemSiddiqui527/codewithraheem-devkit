/**
 * Splits a string into constituent words based on casing and delimiter patterns.
 */
function splitWords(value: string): string[] {
  const matches = value.match(/[A-Z]?[a-z]+|[A-Z]+(?![a-z])|\d+/g);
  return matches ?? [];
}

/**
 * Converts a string to camelCase.
 *
 * @param value The string to convert.
 * @returns The camelCased string.
 * @throws {TypeError} If `value` is not a string.
 *
 * @example
 * ```ts
 * toCamelCase("hello-world"); // "helloWorld"
 * toCamelCase("User_Profile_ID"); // "userProfileId"
 * toCamelCase("APIResponse"); // "apiResponse"
 * ```
 */
export function toCamelCase(value: string): string {
  if (typeof value !== "string") {
    throw new TypeError(`Expected a string, received ${typeof value}`);
  }

  const words = splitWords(value);
  if (words.length === 0) {
    return "";
  }

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index === 0) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}
