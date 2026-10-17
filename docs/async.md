# Async Utilities (`@codewithraheem/devkit/async`)

The Async module provides asynchronous primitives for pacing, bounded retries, timeout management, debouncing, and throttling with native `AbortSignal` cancellation and automatic timer cleanup.

```ts
import {
  sleep,
  retry,
  withTimeout,
  TimeoutError,
  debounce,
  throttle,
} from "@codewithraheem/devkit/async";
```

---

## Table of Contents

- [`sleep`](#sleep)
- [`retry`](#retry)
- [`withTimeout` & `TimeoutError`](#withtimeout--timeouterror)
- [`debounce`](#debounce)
- [`throttle`](#throttle)

---

## `sleep`

### Purpose & Behavior

Pauses async execution for a specified number of milliseconds. Supports cooperative cancellation using standard `AbortSignal`. If aborted, removes event listeners and clears timers immediately to prevent memory leaks and unhandled rejections.

### Exact TypeScript Signature

```ts
interface SleepOptions {
  signal?: AbortSignal;
}

function sleep(ms: number, options?: SleepOptions): Promise<void>;
```

### Parameters

- `ms` (`number`): The duration to sleep in milliseconds. Must be a non-negative number.
- `options` (`SleepOptions`, optional): Configuration object with an optional `AbortSignal`.

### Return Type & Value

- **Returns**: `Promise<void>` — Resolves after `ms` milliseconds, or rejects if aborted.

### JavaScript Example

```js
import { sleep } from "@codewithraheem/devkit/async";

async function run() {
  console.log("Starting...");
  await sleep(1000);
  console.log("1 second later!");
}
```

### TypeScript Example (Cancellation with AbortSignal)

```ts
import { sleep } from "@codewithraheem/devkit/async";

async function pollWithTimeout() {
  const controller = new AbortController();

  // Cancel sleep after 500ms
  setTimeout(() => controller.abort(new Error("Poll cancelled")), 500);

  try {
    await sleep(2000, { signal: controller.signal });
  } catch (err) {
    console.error((err as Error).message); // "Poll cancelled"
  }
}
```

### Edge Cases & Errors

- **Pre-aborted signal**: If `signal.aborted` is already `true`, rejects immediately without setting a timer.
- **Negative `ms`**: Throws `RangeError`.
- **Invalid `ms`**: Throws `TypeError` if `ms` is not a valid number.

---

## `retry`

### Purpose & Behavior

Executes an asynchronous operation, automatically retrying upon failure according to configured retry counts, exponential backoff, delay capping, and custom error filtering predicates.

### Exact TypeScript Signature

```ts
interface RetryOptions {
  retries?: number;
  delay?: number;
  backoff?: number;
  maxDelay?: number;
  signal?: AbortSignal;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (error: unknown, attempt: number, nextDelay: number) => void;
}

function retry<T>(
  operation: (attempt: number) => Promise<T> | T,
  options?: RetryOptions
): Promise<T>;
```

### Options Breakdown

| Option        | Type                            | Default      | Description                                                                             |
| ------------- | ------------------------------- | ------------ | --------------------------------------------------------------------------------------- |
| `retries`     | `number`                        | `3`          | Maximum retry attempts after initial failure. Must be an integer >= 0.                  |
| `delay`       | `number`                        | `0`          | Initial delay in ms before first retry.                                                 |
| `backoff`     | `number`                        | `1`          | Multiplier applied to delay each attempt (e.g. `2` doubles delay). Must be >= 1.        |
| `maxDelay`    | `number`                        | `undefined`  | Upper bound cap for delay in milliseconds.                                              |
| `signal`      | `AbortSignal`                   | `undefined`  | AbortSignal to cancel remaining retries.                                                |
| `shouldRetry` | `(err, attempt) => boolean`     | `() => true` | Predicate deciding if error is retryable. Return `false` to abort retrying immediately. |
| `onRetry`     | `(err, attempt, delay) => void` | `undefined`  | Callback invoked before each retry.                                                     |

### JavaScript Example

```js
import { retry } from "@codewithraheem/devkit/async";

async function loadData() {
  return retry(
    async (attempt) => {
      console.log(`Fetch attempt ${attempt}...`);
      const response = await fetch("https://api.example.com/items");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    {
      retries: 3,
      delay: 500,
      backoff: 2, // 500ms, then 1000ms, then 2000ms
    }
  );
}
```

### TypeScript Example (Conditional Retry & Callback)

```ts
import { retry } from "@codewithraheem/devkit/async";

interface UserRecord {
  id: string;
  name: string;
}

async function getUser(id: string): Promise<UserRecord> {
  return retry<UserRecord>(
    async (attempt) => {
      const res = await fetch(`/api/users/${id}`);
      if (res.status === 404) {
        throw new Error("NOT_FOUND");
      }
      return res.json();
    },
    {
      retries: 2,
      delay: 100,
      shouldRetry: (err) => (err as Error).message !== "NOT_FOUND",
      onRetry: (err, attempt, delay) => {
        console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      },
    }
  );
}
```

### Edge Cases & Errors

- **Exhausted retries**: Rejects with the last error encountered.
- **Immediate abort**: If `signal.aborted` is true, stops retrying and throws abort reason.

---

## `withTimeout` & `TimeoutError`

### Purpose & Behavior

Wraps a Promise (or a factory function returning a Promise) with a timeout limit. If the operation does not settle within `timeoutMs`, the returned Promise rejects with a `TimeoutError` (or resolves with `options.fallback` if specified).

### Critical Notice: Promise Cancellation Semantics

> **Important**: Standard JavaScript Promises are eager and non-cancellable by runtime design. While `withTimeout` rejects immediately when the timeout is reached and properly disposes of its internal timers, **the underlying asynchronous operation will continue running in the background unless it actively checks and respects an `AbortSignal`**.

### Exact TypeScript Signatures

```ts
class TimeoutError extends Error {
  constructor(message?: string);
}

interface WithTimeoutOptions<T> {
  signal?: AbortSignal;
  errorFactory?: () => Error;
  fallback?: T;
}

function withTimeout<T>(
  operation: Promise<T> | (() => Promise<T>),
  timeoutMs: number,
  options?: WithTimeoutOptions<T>
): Promise<T>;
```

### Parameters

- `operation` (`Promise<T> | (() => Promise<T>)`): The Promise or factory function.
- `timeoutMs` (`number`): Timeout duration in milliseconds. Must be non-negative.
- `options` (`WithTimeoutOptions<T>`, optional): Options for fallback value, custom error factory, and AbortSignal.

### Return Type & Value

- **Returns**: `Promise<T>` — Resolves with the operation's result, or `options.fallback` on timeout.
- **Throws**: `TimeoutError` if timed out and no fallback is provided.

### JavaScript Example

```js
import { withTimeout, TimeoutError } from "@codewithraheem/devkit/async";

try {
  const result = await withTimeout(fetchLargeFile(), 3000);
  console.log("File loaded:", result);
} catch (err) {
  if (err instanceof TimeoutError) {
    console.error("Operation timed out after 3 seconds");
  } else {
    console.error("Operation failed:", err);
  }
}
```

### TypeScript Example (With Fallback)

```ts
import { withTimeout } from "@codewithraheem/devkit/async";

interface CacheData {
  hits: number;
}

const fallbackCache: CacheData = { hits: 0 };

const data = await withTimeout<CacheData>(fetchRemoteCache(), 1000, {
  fallback: fallbackCache,
});
// Resolves to fallbackCache if fetchRemoteCache takes > 1000ms
```

### Edge Cases & Errors

- **Timer cleanup**: When the underlying operation resolves or rejects before `timeoutMs`, the internal timeout timer is cleared immediately so Node does not keep the event loop active.
- **Invalid arguments**: Throws `TypeError` if `timeoutMs` is not a number or `operation` is invalid. Throws `RangeError` if `timeoutMs < 0`.

---

## `debounce`

### Purpose & Behavior

Creates a debounced function that delays invoking `fn` until after `waitMs` milliseconds have elapsed since the last time the debounced function was called. Provides `.cancel()`, `.flush()`, and `.pending()` control methods.

### Exact TypeScript Signature

```ts
interface DebounceOptions {
  leading?: boolean; // default: false
  trailing?: boolean; // default: true
  maxWait?: number; // maximum delay before guaranteed execution
}

interface DebouncedFunction<Args extends unknown[], R> {
  (...args: Args): R | undefined;
  cancel: () => void;
  flush: () => R | undefined;
  pending: () => boolean;
}

function debounce<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  waitMs: number,
  options?: DebounceOptions
): DebouncedFunction<Args, R>;
```

### JavaScript Example

```js
import { debounce } from "@codewithraheem/devkit/async";

const handleSearch = debounce((query) => {
  console.log("Executing search for:", query);
}, 300);

// Typing simulation
handleSearch("r");
handleSearch("ra");
handleSearch("raheem");
// Executes once with "raheem" after 300ms of inactivity

// Immediate execution control
handleSearch.flush();

// Cancel scheduled execution
handleSearch.cancel();

// Check if a call is currently queued
console.log(handleSearch.pending()); // false
```

---

## `throttle`

### Purpose & Behavior

Creates a throttled function that only invokes `fn` at most once per every `waitMs` milliseconds. Provides `.cancel()`, `.flush()`, and `.pending()`.

### Exact TypeScript Signature

```ts
interface ThrottleOptions {
  leading?: boolean; // default: true
  trailing?: boolean; // default: true
}

interface ThrottledFunction<Args extends unknown[], R> {
  (...args: Args): R | undefined;
  cancel: () => void;
  flush: () => R | undefined;
  pending: () => boolean;
}

function throttle<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  waitMs: number,
  options?: ThrottleOptions
): ThrottledFunction<Args, R>;
```

### JavaScript Example

```js
import { throttle } from "@codewithraheem/devkit/async";

const onWindowResize = throttle((event) => {
  console.log("Window resized at:", Date.now());
}, 200);

window.addEventListener("resize", onWindowResize);

// Later, cleanup:
onWindowResize.cancel();
```

---

## Summary Table

| Utility       | Supports AbortSignal | Timer Cleanup                 | Custom Error Support                             |
| ------------- | -------------------- | ----------------------------- | ------------------------------------------------ |
| `sleep`       | Yes                  | Yes (on resolve & abort)      | N/A                                              |
| `retry`       | Yes                  | Yes (via sleep backoff)       | Yes (`shouldRetry`, `onRetry`)                   |
| `withTimeout` | Yes                  | Yes (cleared on settle)       | Yes (`TimeoutError`, `errorFactory`, `fallback`) |
| `debounce`    | N/A                  | Yes (`.cancel()`, `.flush()`) | N/A                                              |
| `throttle`    | N/A                  | Yes (`.cancel()`, `.flush()`) | N/A                                              |
