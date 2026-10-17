export interface ThrottleOptions {
  /**
   * Specify invoking on the leading edge of the timeout.
   * @default true
   */
  leading?: boolean;

  /**
   * Specify invoking on the trailing edge of the timeout.
   * @default true
   */
  trailing?: boolean;
}

export interface ThrottledFunction<Args extends unknown[], R> {
  (...args: Args): R | undefined;
  cancel: () => void;
  flush: () => R | undefined;
  pending: () => boolean;
}

/**
 * Creates a throttled function that only invokes `fn` at most once per every `waitMs` milliseconds.
 *
 * Provides `cancel()`, `flush()`, and `pending()` methods.
 *
 * @template Args Argument types of the original function.
 * @template R Return type of the original function.
 * @param fn The function to throttle.
 * @param waitMs The number of milliseconds to throttle invocations to.
 * @param options Throttle options (leading, trailing).
 * @returns The new throttled function.
 * @throws {TypeError} If `fn` is not a function or `waitMs` is invalid.
 *
 * @example
 * ```ts
 * const throttledScroll = throttle(() => {
 *   console.log("Window scrolled");
 * }, 200);
 *
 * window.addEventListener("scroll", throttledScroll);
 * ```
 */
export function throttle<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  waitMs: number,
  options?: ThrottleOptions
): ThrottledFunction<Args, R> {
  if (typeof fn !== "function") {
    throw new TypeError(`Expected a function, received ${typeof fn}`);
  }
  if (typeof waitMs !== "number" || Number.isNaN(waitMs) || waitMs < 0) {
    throw new RangeError(`waitMs must be a non-negative number, received ${waitMs}`);
  }

  const leading = options?.leading ?? true;
  const trailing = options?.trailing ?? true;

  let timerId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Args | undefined;
  let lastResult: R | undefined;
  let lastInvokeTime = 0;

  function invoke(time: number): R | undefined {
    const args = lastArgs;
    lastArgs = undefined;
    lastInvokeTime = time;
    if (args) {
      lastResult = fn(...args);
    }
    return lastResult;
  }

  function cleanup(): void {
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
    }
    lastArgs = undefined;
  }

  function throttled(...args: Args): R | undefined {
    const now = Date.now();
    lastArgs = args;

    if (lastInvokeTime === 0 && !leading) {
      lastInvokeTime = now;
    }

    const remaining = waitMs - (now - lastInvokeTime);

    if (remaining <= 0 || remaining > waitMs) {
      if (timerId !== undefined) {
        clearTimeout(timerId);
        timerId = undefined;
      }
      return invoke(now);
    } else if (timerId === undefined && trailing) {
      timerId = setTimeout(() => {
        timerId = undefined;
        lastInvokeTime = leading ? Date.now() : 0;
        if (lastArgs) {
          invoke(Date.now());
        }
      }, remaining);
    }

    return lastResult;
  }

  throttled.cancel = function cancel(): void {
    cleanup();
    lastInvokeTime = 0;
  };

  throttled.flush = function flush(): R | undefined {
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
      if (lastArgs) {
        return invoke(Date.now());
      }
    }
    return lastResult;
  };

  throttled.pending = function pending(): boolean {
    return timerId !== undefined;
  };

  return throttled;
}
