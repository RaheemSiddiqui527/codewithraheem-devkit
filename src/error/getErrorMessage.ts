import { isErrorLike } from "./isErrorLike.js";

/**
 * Safely extracts a human-readable message string from any thrown error value.
 *
 * Prevents unintentional leakage of deep object internals or circular references.
 *
 * @param error The thrown error or value.
 * @param fallback The fallback message if no descriptive message can be determined. Defaults to `"An unknown error occurred"`.
 * @returns A clean, readable error message.
 *
 * @example
 * ```ts
 * getErrorMessage(new Error("File not found")); // "File not found"
 * getErrorMessage("Network timed out"); // "Network timed out"
 * getErrorMessage({ message: "Invalid payload" }); // "Invalid payload"
 * getErrorMessage(null); // "An unknown error occurred"
 * ```
 */
export function getErrorMessage(
  error: unknown,
  fallback: string = "An unknown error occurred"
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  if (isErrorLike(error) && error.message.trim().length > 0) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    const msg = (error as { message: string }).message;
    if (msg.trim().length > 0) {
      return msg;
    }
  }

  return fallback;
}
