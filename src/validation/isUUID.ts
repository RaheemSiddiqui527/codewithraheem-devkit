export type UuidVersion = 1 | 2 | 3 | 4 | 5 | "all";

const UUID_PATTERNS: Record<UuidVersion, RegExp> = {
  1: /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  2: /^[0-9a-f]{8}-[0-9a-f]{4}-2[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  3: /^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  5: /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  all: /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,
};

/**
 * Validates whether a value is a valid RFC 4122 UUID string.
 *
 * @param value The value to inspect.
 * @param version The UUID version to check against (1, 2, 3, 4, 5, or "all"). Defaults to "all".
 * @returns `true` if `value` matches the UUID format for the specified version, else `false`.
 *
 * @example
 * ```ts
 * isUUID("123e4567-e89b-12d3-a456-426614174000"); // true (version 1)
 * isUUID("f47ac10b-58cc-4372-a567-0e02b2c3d479", 4); // true (version 4)
 * isUUID("00000000-0000-0000-0000-000000000000"); // true (nil UUID)
 * isUUID("not-a-uuid"); // false
 * ```
 */
export function isUUID(value: unknown, version: UuidVersion = "all"): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const pattern = UUID_PATTERNS[version];
  if (!pattern) {
    return false;
  }

  return pattern.test(value);
}
