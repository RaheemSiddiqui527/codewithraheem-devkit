export interface DebounceOptions {
  /**
   * Specify invoking on the leading edge of the timeout.
   * @default false
   */
  leading?: boolean;

  /**
   * Specify invoking on the trailing edge of the timeout.
   * @default true
   */
  trailing?: boolean;

  /**
   * The maximum time `fn` is allowed to be delayed before it is invoked.
   */
  maxWait?: number;
}

export interface DebouncedFunction<Args extends unknown[], R> {
  (...args: Args): R | undefined;
  cancel: () => void;
  flush: () => R | undefined;
  pending: () => boolean;
}

/**
 * Creates a debounced function that delays invoking `fn` until after `waitMs` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * Provides `cancel()`, `flush()`, and `pending()` methods.
 *
 * @template Args Argument types of the original function.
 * @template R Return type of the original function.
 * @param fn The function to debounce.
 * @param waitMs The number of milliseconds to delay.
 * @param options Debounce configuration options.
 * @returns The new debounced function.
 * @throws {TypeError} If `fn` is not a function or `waitMs` is invalid.
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce((query: string) => {
 *   console.log("Searching for", query);
 * }, 300);
 *
 * debouncedSearch("a");
 * debouncedSearch("ab");
 * debouncedSearch.flush(); // runs immediately with "ab"
 * ```
 */
export function debounce<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  waitMs: number,
  options?: DebounceOptions
): DebouncedFunction<Args, R> {
  if (typeof fn !== "function") {
    throw new TypeError(`Expected a function, received ${typeof fn}`);
  }
  if (typeof waitMs !== "number" || Number.isNaN(waitMs) || waitMs < 0) {
    throw new RangeError(`waitMs must be a non-negative number, received ${waitMs}`);
  }

  const leading = options?.leading ?? false;
  const trailing = options?.trailing ?? true;
  const maxWait = options?.maxWait;

  if (maxWait !== undefined && (typeof maxWait !== "number" || maxWait < waitMs)) {
    throw new RangeError(
      `maxWait must be a number greater than or equal to waitMs (${waitMs})`
    );
  }

  let timerId: ReturnType<typeof setTimeout> | undefined;
  let maxTimerId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Args | undefined;
  let lastResult: R | undefined;
  let lastCallTime: number | undefined;

  function invoke(): R | undefined {
    const args = lastArgs;
    lastArgs = undefined;
    if (args) {
      lastResult = fn(...args);
    }
    return lastResult;
  }

  function startTimer(pendingWait: number): ReturnType<typeof setTimeout> {
    return setTimeout(() => {
      const time = Date.now();
      const timeSinceLastCall = lastCallTime !== undefined ? time - lastCallTime : 0;

      if (timeSinceLastCall < waitMs) {
        timerId = startTimer(waitMs - timeSinceLastCall);
      } else {
        timerId = undefined;
        if (trailing && lastArgs) {
          invoke();
        }
        cleanup();
      }
    }, pendingWait);
  }

  function cleanup(): void {
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
    }
    if (maxTimerId !== undefined) {
      clearTimeout(maxTimerId);
      maxTimerId = undefined;
    }
    lastArgs = undefined;
    lastCallTime = undefined;
  }

  function debounced(...args: Args): R | undefined {
    const time = Date.now();
    lastArgs = args;
    lastCallTime = time;

    const isInvoking = timerId === undefined;

    if (isInvoking) {
      timerId = startTimer(waitMs);
      if (maxWait !== undefined && maxTimerId === undefined) {
        maxTimerId = setTimeout(() => {
          maxTimerId = undefined;
          if (lastArgs) {
            invoke();
          }
        }, maxWait);
      }
      if (leading) {
        return invoke();
      }
      return lastResult;
    }

    return lastResult;
  }

  debounced.cancel = function cancel(): void {
    cleanup();
  };

  debounced.flush = function flush(): R | undefined {
    if (timerId !== undefined || maxTimerId !== undefined) {
      if (timerId !== undefined) {
        clearTimeout(timerId);
        timerId = undefined;
      }
      if (maxTimerId !== undefined) {
        clearTimeout(maxTimerId);
        maxTimerId = undefined;
      }
      if (lastArgs) {
        return invoke();
      }
    }
    return lastResult;
  };

  debounced.pending = function pending(): boolean {
    return timerId !== undefined || maxTimerId !== undefined;
  };

  return debounced;
}
