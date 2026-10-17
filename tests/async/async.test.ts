import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  sleep,
  retry,
  withTimeout,
  TimeoutError,
  debounce,
  throttle,
} from "../../src/async/index.js";

describe("Async Utilities", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("sleep", () => {
    it("resolves after the specified duration", async () => {
      const promise = sleep(1000);
      vi.advanceTimersByTime(999);
      let settled = false;
      promise.then(() => {
        settled = true;
      });
      await Promise.resolve();
      expect(settled).toBe(false);

      vi.advanceTimersByTime(1);
      await promise;
      expect(settled).toBe(true);
    });

    it("resolves and cleans up listener when signal does not abort", async () => {
      const controller = new AbortController();
      const promise = sleep(100, { signal: controller.signal });
      vi.advanceTimersByTime(100);
      await expect(promise).resolves.toBeUndefined();
    });

    it("rejects immediately if signal is already aborted", async () => {
      const controller = new AbortController();
      controller.abort(new Error("Pre-aborted"));
      await expect(sleep(1000, { signal: controller.signal })).rejects.toThrow(
        "Pre-aborted"
      );
    });

    it("aborts and cleans up timer when signal aborts during sleep", async () => {
      const controller = new AbortController();
      const promise = sleep(1000, { signal: controller.signal });

      vi.advanceTimersByTime(400);
      controller.abort(new Error("Aborted mid-sleep"));

      await expect(promise).rejects.toThrow("Aborted mid-sleep");
    });

    it("throws for invalid arguments", () => {
      // @ts-expect-error testing invalid argument
      expect(() => sleep("1000")).toThrow(TypeError);
      expect(() => sleep(-10)).toThrow(RangeError);
    });
  });

  describe("retry", () => {
    it("returns result immediately if operation succeeds on attempt 1", async () => {
      const op = vi.fn().mockResolvedValue("success");
      const result = await retry(op);
      expect(result).toBe("success");
      expect(op).toHaveBeenCalledTimes(1);
    });

    it("retries on failure and resolves when an attempt succeeds", async () => {
      let count = 0;
      const op = vi.fn(async () => {
        count++;
        if (count < 3) throw new Error(`Fail ${count}`);
        return "recovered";
      });

      const promise = retry(op, { retries: 3, delay: 100 });
      await vi.advanceTimersByTimeAsync(300);
      const result = await promise;

      expect(result).toBe("recovered");
      expect(op).toHaveBeenCalledTimes(3);
    });

    it("throws last error when retries are exhausted", async () => {
      const op = vi.fn().mockRejectedValue(new Error("Permanent failure"));
      const promise = retry(op, { retries: 2, delay: 50 });

      // Attach catch handler to prevent unhandled rejection during fake timer advance
      let caughtError: Error | undefined;
      promise.catch((err) => {
        caughtError = err;
      });

      await vi.advanceTimersByTimeAsync(200);

      expect(caughtError?.message).toBe("Permanent failure");
      expect(op).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
    });

    it("stops immediately if shouldRetry returns false", async () => {
      const error = new Error("Do not retry");
      const op = vi.fn().mockRejectedValue(error);
      const shouldRetry = vi.fn().mockReturnValue(false);

      const promise = retry(op, { retries: 5, shouldRetry });
      let caughtError: Error | undefined;
      promise.catch((err) => {
        caughtError = err;
      });

      await vi.advanceTimersByTimeAsync(0);

      expect(caughtError).toBe(error);
      expect(op).toHaveBeenCalledTimes(1);
    });

    it("invokes onRetry callback and caps delay with maxDelay", async () => {
      const onRetry = vi.fn();
      let count = 0;
      const op = vi.fn(async () => {
        count++;
        if (count < 3) throw new Error("Temp error");
        return "success";
      });

      const promise = retry(op, {
        retries: 3,
        delay: 50,
        backoff: 10,
        maxDelay: 100,
        onRetry,
      });

      await vi.advanceTimersByTimeAsync(300);
      const res = await promise;

      expect(res).toBe("success");
      expect(onRetry).toHaveBeenCalledTimes(2);
      expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 1, 50);
      expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 2, 100);
    });

    it("aborts when signal is triggered", async () => {
      const controller = new AbortController();
      controller.abort(new Error("Stop retrying"));
      const op = vi.fn().mockRejectedValue(new Error("Fail"));

      await expect(retry(op, { signal: controller.signal })).rejects.toThrow(
        "Stop retrying"
      );
    });

    it("throws TypeError or RangeError for invalid options", async () => {
      // @ts-expect-error testing invalid argument
      await expect(retry(null)).rejects.toThrow(TypeError);
      await expect(retry(async () => 1, { retries: -1 })).rejects.toThrow(RangeError);
      await expect(retry(async () => 1, { delay: -10 })).rejects.toThrow(RangeError);
      await expect(retry(async () => 1, { backoff: 0.5 })).rejects.toThrow(RangeError);
    });
  });

  describe("withTimeout", () => {
    it("resolves if operation completes before timeout", async () => {
      const fastPromise = sleep(50).then(() => "done");
      const promise = withTimeout(fastPromise, 200);

      vi.advanceTimersByTime(60);
      const res = await promise;
      expect(res).toBe("done");
    });

    it("rejects with TimeoutError when operation exceeds timeout", async () => {
      const slowPromise = sleep(500).then(() => "done");
      const promise = withTimeout(slowPromise, 100);

      let caughtError: unknown;
      promise.catch((err) => {
        caughtError = err;
      });

      vi.advanceTimersByTime(110);
      await Promise.resolve();

      expect(caughtError).toBeInstanceOf(TimeoutError);
      expect((caughtError as TimeoutError).message).toContain("100ms");
    });

    it("resolves with fallback value if configured", async () => {
      const slowPromise = sleep(500).then(() => "done");
      const promise = withTimeout(slowPromise, 100, { fallback: "fallback-value" });

      vi.advanceTimersByTime(110);
      const res = await promise;
      expect(res).toBe("fallback-value");
    });

    it("supports custom error factory", async () => {
      const slowPromise = sleep(500);
      const promise = withTimeout(slowPromise, 100, {
        errorFactory: () => new Error("Custom timeout"),
      });

      let caughtError: unknown;
      promise.catch((err) => {
        caughtError = err;
      });

      vi.advanceTimersByTime(110);
      await Promise.resolve();

      expect((caughtError as Error).message).toBe("Custom timeout");
    });

    it("supports function returning a promise as operation", async () => {
      const promise = withTimeout(() => Promise.resolve("from-fn"), 100);
      expect(await promise).toBe("from-fn");
    });

    it("propagates operation rejection before timeout", async () => {
      const rejectingPromise = Promise.reject(new Error("Fast failure"));
      await expect(withTimeout(rejectingPromise, 500)).rejects.toThrow("Fast failure");
    });

    it("aborts when signal aborts during execution", async () => {
      const controller = new AbortController();
      const promise = withTimeout(sleep(500), 200, { signal: controller.signal });

      let caughtError: unknown;
      promise.catch((err) => {
        caughtError = err;
      });

      controller.abort(new Error("Aborted mid-timeout"));
      await Promise.resolve();

      expect((caughtError as Error).message).toBe("Aborted mid-timeout");
    });

    it("throws for invalid timeoutMs or operation", () => {
      // @ts-expect-error testing invalid argument
      expect(() => withTimeout(Promise.resolve(1), "100")).toThrow(TypeError);
      expect(() => withTimeout(Promise.resolve(1), -10)).toThrow(RangeError);
      // @ts-expect-error testing invalid operation
      expect(() => withTimeout("not-a-promise", 100)).toThrow(TypeError);
    });
  });

  describe("debounce", () => {
    it("fires on maxWait if calls continue to arrive", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { maxWait: 250 });

      debounced(1);
      vi.advanceTimersByTime(80);
      debounced(2);
      vi.advanceTimersByTime(80);
      debounced(3);
      vi.advanceTimersByTime(80);
      debounced(4);

      // Total time elapsed: 240ms. Not fired yet.
      expect(fn).not.toHaveBeenCalled();

      // At 250ms, maxWait triggers
      vi.advanceTimersByTime(20);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(4);
    });

    it("debounces multiple calls until delay has elapsed", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("call1");
      debounced("call2");
      debounced("call3");

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(99);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("call3");
    });

    it("supports leading edge invocation", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { leading: true, trailing: false });

      debounced("first");
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("first");

      debounced("second");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1); // trailing disabled
    });

    it("allows cancelling pending invocation with cancel()", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      expect(debounced.pending()).toBe(true);

      debounced.cancel();
      expect(debounced.pending()).toBe(false);

      vi.advanceTimersByTime(200);
      expect(fn).not.toHaveBeenCalled();
    });

    it("allows flushing pending invocation immediately with flush()", () => {
      const fn = vi.fn((x: number) => x * 2);
      const debounced = debounce(fn, 100);

      debounced(5);
      const result = debounced.flush();

      expect(fn).toHaveBeenCalledTimes(1);
      expect(result).toBe(10);
      expect(debounced.pending()).toBe(false);
    });

    it("throws for invalid arguments", () => {
      // @ts-expect-error testing invalid argument
      expect(() => debounce(null, 100)).toThrow(TypeError);
      expect(() => debounce(() => {}, -5)).toThrow(RangeError);
      expect(() => debounce(() => {}, 100, { maxWait: 50 })).toThrow(RangeError);
    });
  });

  describe("throttle", () => {
    it("throttles calls to at most once per wait interval", () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled("call 1");
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("call 1");

      throttled("call 2");
      throttled("call 3");
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith("call 3");
    });

    it("supports cancelling with cancel()", () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled(1);
      throttled(2);
      expect(throttled.pending()).toBe(true);

      throttled.cancel();
      expect(throttled.pending()).toBe(false);

      vi.advanceTimersByTime(150);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("supports flushing trailing call with flush()", () => {
      const fn = vi.fn((x: number) => x * 3);
      const throttled = throttle(fn, 100);

      throttled(1);
      throttled(2);
      const result = throttled.flush();

      expect(result).toBe(6);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("respects leading: false option", () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100, { leading: false });

      throttled("call 1");
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith("call 1");
    });

    it("throws for invalid arguments", () => {
      // @ts-expect-error testing invalid argument
      expect(() => throttle("not-fn", 100)).toThrow(TypeError);
      expect(() => throttle(() => {}, -10)).toThrow(RangeError);
    });
  });
});
