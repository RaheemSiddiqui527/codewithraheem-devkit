export type SafeJsonResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: Error };

/**
 * Safely parses a JSON string into a JavaScript value using a discriminated union return type.
 *
 * NOTE: The generic type parameter `T` is a compile-time assertion and does NOT perform
 * runtime schema validation on external untrusted input. For runtime schema validation,
 * pair this with a validator or guard.
 *
 * @template T Expected parsed type (defaults to `unknown`).
 * @param text The string to parse.
 * @param reviver Optional reviver function prescribed by `JSON.parse`.
 * @returns An object with `success: true` and `data`, or `success: false` and `error`.
 *
 * @example
 * ```ts
 * const res = safeJsonParse<{ name: string }>('{"name": "Raheem"}');
 * if (res.success) {
 *   console.log(res.data.name);
 * } else {
 *   console.error(res.error.message);
 * }
 * ```
 */
export function safeJsonParse<T = unknown>(
  text: unknown,
  reviver?: (this: unknown, key: string, value: unknown) => unknown
): SafeJsonResult<T> {
  if (typeof text !== "string") {
    return {
      success: false,
      error: new TypeError(`Expected a string to parse JSON, received ${typeof text}`),
    };
  }

  try {
    const data = JSON.parse(text, reviver) as T;
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}
