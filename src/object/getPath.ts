const FORBIDDEN_KEYS = new Set(["__proto__", "prototype"]);

/**
 * Parses a string or array path into a list of keys.
 */
function parsePath(path: string | readonly (string | number)[]): string[] {
  if (Array.isArray(path)) {
    return path.map(String);
  }
  if (typeof path !== "string" || path.length === 0) {
    return [];
  }

  // Matches dot segments and bracketed indices/keys: "a.b[0]['c']"
  const segments: string[] = [];
  const regex = /[^.[\]]+|(?<=\[)(?:'([^']*)'|"([^"]*)"|(\d+))(?=\])/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(path)) !== null) {
    // match[1] for single quotes, match[2] for double quotes, match[3] for digits, match[0] for standard keys
    const key = match[1] ?? match[2] ?? match[3] ?? match[0];
    if (key !== undefined) {
      segments.push(key);
    }
  }

  return segments;
}

/**
 * Safely retrieves the value at a nested path of an object.
 * Returns `fallback` if the resolved value is `undefined` or cannot be reached.
 * Automatically guards against prototype pollution.
 *
 * @template T Return value type.
 * @param object The source object to query.
 * @param path The path of the property to get (dot-separated string or array of keys).
 * @param fallback The value returned if the resolved value is `undefined`.
 * @returns The resolved value, or `fallback`.
 *
 * @example
 * ```ts
 * const user = { profile: { name: "Raheem", tags: ["dev", "lead"] } };
 * getPath(user, "profile.name"); // "Raheem"
 * getPath(user, "profile.tags[0]"); // "dev"
 * getPath(user, ["profile", "tags", 1]); // "lead"
 * getPath(user, "profile.age", 18); // 18
 * ```
 */
export function getPath<T = unknown>(
  object: unknown,
  path: string | readonly (string | number)[],
  fallback?: T
): T {
  if (object === null || object === undefined) {
    return fallback as T;
  }

  const keys = parsePath(path);
  if (keys.length === 0) {
    return fallback as T;
  }

  let current: unknown = object;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as string;

    // Security guard: prevent prototype pollution
    if (FORBIDDEN_KEYS.has(key)) {
      return fallback as T;
    }

    if (current === null || current === undefined) {
      return fallback as T;
    }

    // Protect against non-object navigation
    if (typeof current !== "object" && typeof current !== "function") {
      return fallback as T;
    }

    current = (current as Record<string, unknown>)[key];
  }

  return current === undefined ? (fallback as T) : (current as T);
}
