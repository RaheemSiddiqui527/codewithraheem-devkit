export interface IsUrlOptions {
  /**
   * Allowed protocols without the trailing colon.
   * @default ["http", "https"]
   */
  protocols?: string[];

  /**
   * Whether to require an explicit protocol.
   * @default true
   */
  requireProtocol?: boolean;
}

/**
 * Validates whether a value is a valid URL string using the standard WHATWG URL parser.
 *
 * Format Rules:
 * - Must be parseable by the standard `URL` constructor.
 * - Must match one of the allowed protocols (defaults to `http` and `https`).
 * - Must contain a non-empty hostname.
 *
 * @param value The value to inspect.
 * @param options URL validation options.
 * @returns `true` if `value` is a valid URL matching options, else `false`.
 *
 * @example
 * ```ts
 * isURL("https://codewithraheem.dev"); // true
 * isURL("ftp://files.example.com", { protocols: ["ftp"] }); // true
 * isURL("javascript:alert(1)"); // false
 * isURL("not a url"); // false
 * ```
 */
export function isURL(value: unknown, options?: IsUrlOptions): boolean {
  if (typeof value !== "string" || value.trim().length === 0) {
    return false;
  }

  const allowedProtocols = (options?.protocols ?? ["http", "https"]).map((p) =>
    p.toLowerCase().replace(/:$/, "")
  );

  try {
    const parsed = new URL(value);
    const protocol = parsed.protocol.replace(/:$/, "").toLowerCase();

    if (!allowedProtocols.includes(protocol)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
