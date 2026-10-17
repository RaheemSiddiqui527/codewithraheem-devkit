// ReDoS-safe RFC 5322-compliant practical email regex
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates whether a string matches a standard email address format.
 *
 * Format Rules:
 * - Local part (before @): 1-64 characters, letters, digits, and allowed RFC 5322 symbols.
 *   Does not start or end with a dot, nor contain consecutive dots.
 * - Domain part (after @): Valid domain labels separated by dots, each 1-63 characters,
 *   not starting or ending with a hyphen, ending with a TLD.
 * - Total length: Maximum 254 characters (RFC 5321).
 *
 * NOTE: This is purely a syntactic format validation and does NOT guarantee
 * that the domain exists, has valid MX records, or that an inbox will accept mail.
 *
 * @param value The value to inspect.
 * @returns `true` if `value` is a syntactically valid email address, else `false`.
 *
 * @example
 * ```ts
 * isEmail("raheem@example.com"); // true
 * isEmail("user.name+tag@sub.domain.co"); // true
 * isEmail("invalid..email@example.com"); // false
 * isEmail("@missing-local.com"); // false
 * ```
 */
export function isEmail(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  // RFC 5321 length limits: total max 254 characters, local part max 64
  if (value.length === 0 || value.length > 254) {
    return false;
  }

  const atIndex = value.indexOf("@");
  if (atIndex <= 0 || atIndex > 64) {
    return false;
  }

  const localPart = value.slice(0, atIndex);
  if (localPart.startsWith(".") || localPart.endsWith(".") || localPart.includes("..")) {
    return false;
  }

  return EMAIL_REGEX.test(value);
}
