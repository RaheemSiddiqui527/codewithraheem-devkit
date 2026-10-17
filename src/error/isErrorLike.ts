export interface ErrorLike {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
}

/**
 * Checks whether a value has an Error-like structure (an object with string `name` and `message` properties).
 *
 * @param value The value to inspect.
 * @returns `true` if `value` conforms to `ErrorLike`, else `false`.
 *
 * @example
 * ```ts
 * isErrorLike(new Error("Boom")); // true
 * isErrorLike({ name: "CustomError", message: "Something failed" }); // true
 * isErrorLike("Boom"); // false
 * isErrorLike(null); // false
 * ```
 */
export function isErrorLike(value: unknown): value is ErrorLike {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const obj = value as Record<string, unknown>;
  return typeof obj["message"] === "string" && typeof obj["name"] === "string";
}
