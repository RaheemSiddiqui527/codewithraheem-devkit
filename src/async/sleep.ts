export interface SleepOptions {
  /**
   * Optional AbortSignal to cancel the sleep early.
   */
  signal?: AbortSignal;
}

/**
 * Pauses execution for a specified number of milliseconds.
 * Supports cancellation via standard `AbortSignal`.
 *
 * @param ms The duration to sleep in milliseconds. Must be a non-negative number.
 * @param options Options including an optional `AbortSignal`.
 * @returns A Promise that resolves after `ms` milliseconds, or rejects if aborted.
 * @throws {TypeError} If `ms` is not a valid number.
 * @throws {RangeError} If `ms` is negative.
 * @throws {DOMException | Error} If aborted before or during sleep.
 *
 * @example
 * ```ts
 * await sleep(1000); // Sleeps for 1 second
 *
 * const controller = new AbortController();
 * setTimeout(() => controller.abort(), 200);
 * await sleep(1000, { signal: controller.signal }); // Rejects after 200ms
 * ```
 */
export function sleep(ms: number, options?: SleepOptions): Promise<void> {
  if (typeof ms !== "number" || Number.isNaN(ms)) {
    throw new TypeError(`Expected a valid number for ms, received ${ms}`);
  }
  if (ms < 0) {
    throw new RangeError(`Sleep duration cannot be negative, received: ${ms}`);
  }

  const signal = options?.signal;

  if (signal?.aborted) {
    return Promise.reject(signal.reason ?? new Error("Operation aborted"));
  }

  return new Promise<void>((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout> | undefined = undefined;

    const onAbort = () => {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
      reject(signal?.reason ?? new Error("Operation aborted"));
    };

    if (signal) {
      signal.addEventListener("abort", onAbort, { once: true });
    }

    timer = setTimeout(() => {
      if (signal) {
        signal.removeEventListener("abort", onAbort);
      }
      resolve();
    }, ms);
  });
}
