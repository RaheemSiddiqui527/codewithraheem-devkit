import { getErrorMessage } from "./getErrorMessage.js";
import { isErrorLike } from "./isErrorLike.js";

/**
 * Normalizes an unknown thrown value into a standard JavaScript `Error` instance.
 * Preserves error names, messages, causes, and stack traces whenever available.
 *
 * @param error The thrown value to normalize.
 * @returns A genuine `Error` instance.
 *
 * @example
 * ```ts
 * try {
 *   doSomethingRisky();
 * } catch (err) {
 *   const error = normalizeError(err);
 *   console.error(`${error.name}: ${error.message}`);
 * }
 * ```
 */
export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  if (isErrorLike(error)) {
    const err = new Error(error.message, { cause: error.cause });
    err.name = error.name;
    if (error.stack) {
      err.stack = error.stack;
    }
    return err;
  }

  const message = getErrorMessage(error);
  return new Error(message, { cause: error });
}
