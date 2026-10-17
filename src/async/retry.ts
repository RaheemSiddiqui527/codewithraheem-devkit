import { sleep } from "./sleep.js";

export interface RetryOptions {
  /**
   * Maximum number of retry attempts after the initial failure.
   * @default 3
   */
  retries?: number;

  /**
   * Initial delay in milliseconds before the first retry attempt.
   * @default 0
   */
  delay?: number;

  /**
   * Multiplier applied to the delay after each retry attempt.
   * @default 1
   */
  backoff?: number;

  /**
   * Maximum delay in milliseconds between attempts.
   */
  maxDelay?: number;

  /**
   * Optional AbortSignal to cancel further retry attempts.
   */
  signal?: AbortSignal;

  /**
   * Predicate to determine whether a given error should trigger a retry.
   * If returns false, retry sequence terminates and throws the error immediately.
   */
  shouldRetry?: (error: unknown, attempt: number) => boolean;

  /**
   * Optional callback invoked before each retry attempt.
   */
  onRetry?: (error: unknown, attempt: number, nextDelay: number) => void;
}

/**
 * Executes an asynchronous operation, retrying it if it fails according to configured options.
 *
 * @template T Return type of the operation.
 * @param operation The function to execute. Receives the current attempt number (starting at 1).
 * @param options Configuration options for retries, backoff, and filtering.
 * @returns A Promise resolving to the operation's result.
 * @throws {TypeError} If `operation` is not a function or options are invalid.
 *
 * @example
 * ```ts
 * const data = await retry(
 *   async (attempt) => {
 *     return fetch(`/api/data`);
 *   },
 *   { retries: 3, delay: 500, backoff: 2 }
 * );
 * ```
 */
export async function retry<T>(
  operation: (attempt: number) => Promise<T> | T,
  options?: RetryOptions
): Promise<T> {
  if (typeof operation !== "function") {
    throw new TypeError(
      `Expected operation to be a function, received ${typeof operation}`
    );
  }

  const retries = options?.retries ?? 3;
  const initialDelay = options?.delay ?? 0;
  const backoff = options?.backoff ?? 1;
  const maxDelay = options?.maxDelay;
  const signal = options?.signal;
  const shouldRetry = options?.shouldRetry ?? (() => true);
  const onRetry = options?.onRetry;

  if (typeof retries !== "number" || !Number.isInteger(retries) || retries < 0) {
    throw new RangeError(`retries must be a non-negative integer, received ${retries}`);
  }
  if (typeof initialDelay !== "number" || initialDelay < 0) {
    throw new RangeError(`delay must be a non-negative number, received ${initialDelay}`);
  }
  if (typeof backoff !== "number" || backoff < 1) {
    throw new RangeError(`backoff must be a number >= 1, received ${backoff}`);
  }

  let attempt = 1;
  let currentDelay = initialDelay;

  while (true) {
    if (signal?.aborted) {
      throw signal.reason ?? new Error("Operation aborted");
    }

    try {
      return await operation(attempt);
    } catch (error) {
      const remainingRetries = retries - (attempt - 1);
      if (remainingRetries <= 0 || !shouldRetry(error, attempt)) {
        throw error;
      }

      if (onRetry) {
        onRetry(error, attempt, currentDelay);
      }

      if (currentDelay > 0) {
        await sleep(currentDelay, { signal });
      }

      currentDelay = currentDelay * backoff;
      if (maxDelay !== undefined && currentDelay > maxDelay) {
        currentDelay = maxDelay;
      }

      attempt++;
    }
  }
}
