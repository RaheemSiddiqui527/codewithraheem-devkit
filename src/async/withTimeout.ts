/**
 * Error thrown when an asynchronous operation exceeds its allocated timeout.
 */
export class TimeoutError extends Error {
  constructor(message: string = "Operation timed out") {
    super(message);
    this.name = "TimeoutError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface WithTimeoutOptions<T> {
  /**
   * Optional AbortSignal to cancel waiting early.
   */
  signal?: AbortSignal;

  /**
   * Optional custom factory for creating the timeout rejection error.
   */
  errorFactory?: () => Error;

  /**
   * Optional fallback value returned instead of throwing a TimeoutError upon timeout.
   */
  fallback?: T;
}

/**
 * Wraps a promise or async function with a timeout limit.
 * If the operation does not settle within `timeoutMs`, the returned promise
 * rejects with a `TimeoutError` (or resolves with `options.fallback` if specified).
 *
 * NOTE: Standard JavaScript Promises are eager and cannot be aborted externally
 * by JavaScript runtime semantics alone. While `withTimeout` rejects immediately
 * when the timeout is reached and properly cleans up its internal timers,
 * the underlying operation will continue executing in the background unless it
 * actively supports and listens to an `AbortSignal`.
 *
 * @template T Return type of the operation.
 * @param operation The Promise or function returning a Promise.
 * @param timeoutMs The maximum allowed duration in milliseconds. Must be non-negative.
 * @param options Additional timeout options including fallback and AbortSignal.
 * @returns The resolved value of the operation or fallback.
 * @throws {TimeoutError} If timeout is reached and no fallback is provided.
 * @throws {TypeError} If `timeoutMs` is not a number or `operation` is invalid.
 *
 * @example
 * ```ts
 * try {
 *   const data = await withTimeout(fetchData(), 5000);
 * } catch (err) {
 *   if (err instanceof TimeoutError) {
 *     console.error("Fetch timed out after 5s");
 *   }
 * }
 * ```
 */
export function withTimeout<T>(
  operation: Promise<T> | (() => Promise<T>),
  timeoutMs: number,
  options?: WithTimeoutOptions<T>
): Promise<T> {
  if (typeof timeoutMs !== "number" || Number.isNaN(timeoutMs)) {
    throw new TypeError(`Expected timeoutMs to be a number, received ${timeoutMs}`);
  }
  if (timeoutMs < 0) {
    throw new RangeError(
      `timeoutMs must be a non-negative number, received ${timeoutMs}`
    );
  }

  const signal = options?.signal;
  if (signal?.aborted) {
    return Promise.reject(signal.reason ?? new Error("Operation aborted"));
  }

  const promise = typeof operation === "function" ? operation() : operation;
  if (!promise || typeof (promise as Promise<T>).then !== "function") {
    throw new TypeError(
      "Expected operation to be a Promise or a function returning a Promise"
    );
  }

  return new Promise<T>((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout> | undefined = undefined;
    let settled = false;

    const onAbort = () => {
      if (settled) return;
      settled = true;
      if (timer !== undefined) {
        clearTimeout(timer);
      }
      reject(signal?.reason ?? new Error("Operation aborted"));
    };

    if (signal) {
      signal.addEventListener("abort", onAbort, { once: true });
    }

    timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      if (signal) {
        signal.removeEventListener("abort", onAbort);
      }

      if (options && "fallback" in options) {
        resolve(options.fallback as T);
      } else {
        const error = options?.errorFactory
          ? options.errorFactory()
          : new TimeoutError(`Operation timed out after ${timeoutMs}ms`);
        reject(error);
      }
    }, timeoutMs);

    promise.then(
      (value) => {
        if (settled) return;
        settled = true;
        if (timer !== undefined) {
          clearTimeout(timer);
        }
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }
        resolve(value);
      },
      (error) => {
        if (settled) return;
        settled = true;
        if (timer !== undefined) {
          clearTimeout(timer);
        }
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }
        reject(error);
      }
    );
  });
}
