# CodeWithRaheem DevKit (`@codewithraheem/devkit`)

> **Learn. Build. Innovate.**  
> A lightweight, TypeScript-first utility toolkit for modern JavaScript and TypeScript developers.

[![CI](https://github.com/RaheemSiddiqui527/codewithraheem-devkit/actions/workflows/ci.yml/badge.svg)](https://github.com/RaheemSiddiqui527/codewithraheem-devkit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm version](https://img.shields.io/badge/npm-0.1.0-blue.svg)](https://www.npmjs.com/package/@codewithraheem/devkit)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)

---

## Overview

**CodeWithRaheem DevKit** (`@codewithraheem/devkit`) is a production-ready, tree-shakeable utility library built from the ground up with TypeScript. It delivers rock-solid, zero-dependency helpers for common day-to-day development challenges in frontend web applications and backend Node.js services.

### Key Highlights

- **Zero Runtime Dependencies**: Keep your bundle size microscopic and free of supply-chain bloat.
- **TypeScript-First**: Strict type inference, generics, and discriminated union results for error-proof APIs.
- **Dual ESM & CommonJS**: Full support for native ES Modules (`import`) and CommonJS (`require`).
- **Granular Subpath Imports**: Import individual modules (e.g. `@codewithraheem/devkit/array`) to optimize tree-shaking.
- **Security & Reliability**: Built-in prototype-pollution defenses, ReDoS-safe patterns, and predictable error handling.
- **100% Tested**: Comprehensive automated test coverage (>94% branch coverage, 100% function coverage).

---

## Installation

Install using your favorite package manager:

```bash
# npm
npm install @codewithraheem/devkit

# pnpm
pnpm add @codewithraheem/devkit

# yarn
yarn add @codewithraheem/devkit

# bun
bun add @codewithraheem/devkit
```

### System Requirements

- **Node.js**: `v18.0.0` or higher
- **Modern Browsers**: Chrome, Edge, Firefox, Safari (ES2022+)
- **TypeScript**: `v5.0` or higher (recommended for type checking)

---

## Quick Start

### Root Import

```ts
import {
  chunk,
  clamp,
  sleep,
  safeJsonParse,
  normalizeError,
} from "@codewithraheem/devkit";

// Array chunking
const batches = chunk([1, 2, 3, 4, 5], 2);
// => [[1, 2], [3, 4], [5]]

// Bounded clamping
const opacity = clamp(1.2, 0, 1);
// => 1

// Safe JSON parsing without try/catch
const result = safeJsonParse<{ id: number }>('{"id": 42}');
if (result.success) {
  console.log("Parsed ID:", result.data.id);
} else {
  console.error("Parse failed:", result.error.message);
}

// Asynchronous pause
await sleep(100);
```

### Focused Subpath Imports

For optimal bundle tree-shaking in modern bundlers (Vite, Next.js, Rollup, Webpack):

```ts
import { chunk, unique } from "@codewithraheem/devkit/array";
import { pick, getPath } from "@codewithraheem/devkit/object";
import { toCamelCase, slugify } from "@codewithraheem/devkit/string";
import { clamp, roundTo } from "@codewithraheem/devkit/number";
import { sleep, retry, withTimeout } from "@codewithraheem/devkit/async";
import { safeJsonParse, isEmail } from "@codewithraheem/devkit/validation";
import { normalizeError } from "@codewithraheem/devkit/error";
import { daysBetween, startOfDay } from "@codewithraheem/devkit/date";
```

### CommonJS Usage

```cjs
const { chunk, sleep, clamp } = require("@codewithraheem/devkit");
// Or subpath:
const { pick } = require("@codewithraheem/devkit/object");
```

---

## Documentation Index

Explore comprehensive developer guides, module deep dives, and API references in the [`docs/`](docs/) directory:

### Core Guides

- [**Getting Started Guide**](docs/getting-started.md) — Installation, TypeScript configuration, import patterns, and quick-start tutorials.
- [**TypeScript Guide**](docs/typescript.md) — Generic inference, discriminated union pattern matching, and custom type guards.
- [**Browser & Node.js Compatibility**](docs/browser-and-node.md) — Verified runtime compatibility, zero Node-only internals, and bundler setup.
- [**API Reference Index**](docs/api-reference.md) — Complete alphabetical index of all 38 public functions and exported types.
- [**Contributing Guide**](docs/contributing.md) — Local development workflow, coding standards, and pull request checklist.
- [**Frequently Asked Questions (FAQ)**](docs/faq.md) — Common questions about installation, subpath imports, and design decisions.

### Module References

- [**Array Utilities (`@codewithraheem/devkit/array`)**](docs/array.md) — `chunk`, `unique`, `groupBy`, `partition`, `compact`, `flatten`, `shuffle`.
- [**Object Utilities (`@codewithraheem/devkit/object`)**](docs/object.md) — `pick`, `omit`, `isEmpty`, `getPath`, `deepClone`.
- [**String Utilities (`@codewithraheem/devkit/string`)**](docs/string.md) — `capitalize`, `toCamelCase`, `toKebabCase`, `toSnakeCase`, `truncate`, `slugify`, `isBlank`.
- [**Number Utilities (`@codewithraheem/devkit/number`)**](docs/number.md) — `clamp`, `roundTo`, `randomInt`, `sum`, `average`, `isFiniteNumber`.
- [**Async Utilities (`@codewithraheem/devkit/async`)**](docs/async.md) — `sleep`, `retry`, `withTimeout`, `debounce`, `throttle`, `TimeoutError`.
- [**Validation Utilities (`@codewithraheem/devkit/validation`)**](docs/validation.md) — `safeJsonParse`, `isValidJSON`, `isEmail`, `isURL`, `isUUID`, `isPlainObject`.
- [**Error Utilities (`@codewithraheem/devkit/error`)**](docs/errors.md) — `normalizeError`, `getErrorMessage`, `isErrorLike`.
- [**Date Utilities (`@codewithraheem/devkit/date`)**](docs/date.md) — `isValidDate`, `startOfDay`, `endOfDay`, `daysBetween`.

---

## Public API Reference & Quick Usage

### 1. Array Utilities (`@codewithraheem/devkit/array`)

#### `chunk<T>(array: readonly T[], size: number): T[][]`

Splits an array into chunks of the given size. Preserves ordering. Does not mutate the source array.

```ts
chunk([1, 2, 3, 4, 5], 2);
// => [[1, 2], [3, 4], [5]]
```

#### `unique<T>(array: readonly T[]): T[]`

Returns a new array with duplicates removed, preserving the first occurrence of each element. Properly handles `NaN`.

```ts
unique([1, 2, 2, 3, 1]);
// => [1, 2, 3]
```

#### `groupBy<T, K extends PropertyKey>(array: readonly T[], keyFn: (item: T, index: number) => K): Record<K, T[]>`

Groups array elements by the key returned from `keyFn`.

```ts
groupBy(["cat", "dog", "elephant"], (item) => item.length);
// => { 3: ["cat", "dog"], 8: ["elephant"] }
```

#### `partition<T>(array: readonly T[], predicate: (item: T, index: number) => boolean): [T[], T[]]`

Splits an array into `[truthyElements, falsyElements]`. Supports TypeScript type guards.

```ts
const [evens, odds] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
// evens => [2, 4], odds => [1, 3, 5]
```

#### `compact<T>(array: readonly (T | Falsy)[]): T[]`

Removes all falsy values (`false`, `null`, `0`, `""`, `undefined`, and `NaN`).

```ts
compact([0, 1, false, 2, "", 3, null, undefined, NaN]);
// => [1, 2, 3]
```

#### `flatten<T>(array: readonly unknown[], depth?: number): T[]`

Flattens nested arrays up to the specified `depth` (defaults to `1`).

```ts
flatten([1, [2, [3, 4]]]); // => [1, 2, [3, 4]]
flatten([1, [2, [3, 4]]], 2); // => [1, 2, 3, 4]
```

#### `shuffle<T>(array: readonly T[], random?: () => number): T[]`

Returns a new randomly shuffled array using the Fisher-Yates algorithm. Accepts an injected `random` generator for deterministic unit testing.

```ts
shuffle([1, 2, 3, 4]); // => [3, 1, 4, 2] (randomized)
shuffle([1, 2, 3], () => 0.5); // Deterministic output
```

---

### 2. Object Utilities (`@codewithraheem/devkit/object`)

#### `pick<T, K extends keyof T>(object: T, keys: readonly K[]): Pick<T, K>`

Creates an object with only the picked own properties. Guards against prototype pollution.

```ts
pick({ id: 1, name: "Raheem", secret: "xyz" }, ["id", "name"]);
// => { id: 1, name: "Raheem" }
```

#### `omit<T, K extends keyof T>(object: T, keys: readonly K[]): Omit<T, K>`

Creates an object omitting the specified keys.

```ts
omit({ id: 1, name: "Raheem", secret: "xyz" }, ["secret"]);
// => { id: 1, name: "Raheem" }
```

#### `isEmpty(value: unknown): boolean`

Checks whether a value is empty (null, undefined, empty strings, empty arrays, empty Maps, Sets, and plain objects).

```ts
isEmpty({}); // => true
isEmpty([]); // => true
isEmpty(""); // => true
isEmpty(new Set()); // => true
isEmpty({ a: 1 }); // => false
```

#### `getPath<T>(object: unknown, path: string | readonly (string | number)[], fallback?: T): T`

Safely accesses nested values by dot notation or array path. Automatically defends against prototype pollution (`__proto__`, `prototype`).

```ts
const data = { user: { profile: { tags: ["typescript", "lead"] } } };
getPath(data, "user.profile.tags[0]"); // => "typescript"
getPath(data, ["user", "profile", "tags", 1]); // => "lead"
getPath(data, "user.profile.age", 18); // => 18 (fallback)
```

#### `deepClone<T>(value: T): T`

Recursively clones objects, arrays, Dates, RegExps, Maps, Sets, and TypedArrays. Handles circular references safely using an internal `WeakMap`. Prevents prototype pollution.

```ts
const original = { date: new Date(), map: new Map([["key", "val"]]) };
const copy = deepClone(original);
```

---

### 3. String Utilities (`@codewithraheem/devkit/string`)

#### `capitalize(value: string): string`

Capitalizes the first character and lowercases the remainder.

```ts
capitalize("hELLO WORLD"); // => "Hello world"
```

#### `toCamelCase(value: string): string`

Converts kebab-case, snake_case, PascalCase, or spaced strings to `camelCase`. Handles acronyms seamlessly.

```ts
toCamelCase("user_profile_id"); // => "userProfileId"
toCamelCase("APIResponse"); // => "apiResponse"
```

#### `toKebabCase(value: string): string`

Converts strings to `kebab-case`.

```ts
toKebabCase("helloWorld"); // => "hello-world"
toKebabCase("APIResponse"); // => "api-response"
```

#### `toSnakeCase(value: string): string`

Converts strings to `snake_case`.

```ts
toSnakeCase("helloWorld"); // => "hello_world"
```

#### `truncate(value: string, maxLength: number, suffix?: string): string`

Truncates a string to `maxLength` (including suffix, default: `...`). Preserves Unicode surrogate pairs (emojis).

```ts
truncate("Hello, World!", 8); // => "Hello..."
truncate("🚀🚀🚀🚀🚀", 4); // => "🚀..."
```

#### `slugify(value: string): string`

Generates a clean URL slug. Automatically normalizes Unicode diacritics and accents.

```ts
slugify("Café & Crème brûlée 101!");
// => "cafe-creme-brulee-101"
```

#### `isBlank(value: unknown): boolean`

Checks if a value is null, undefined, or a string consisting solely of whitespace (including non-breaking spaces).

```ts
isBlank(""); // => true
isBlank("   \t\n"); // => true
isBlank("  text  "); // => false
```

---

### 4. Number Utilities (`@codewithraheem/devkit/number`)

#### `clamp(value: number, min: number, max: number): number`

Constrains a number within inclusive lower and upper bounds.

```ts
clamp(15, 0, 10); // => 10
clamp(-5, 0, 10); // => 0
clamp(5, 0, 10); // => 5
```

#### `roundTo(value: number, decimals?: number): number`

Rounds a number to a specified number of decimal places using precision-safe scientific notation. Eliminates binary IEEE 754 floating-point inaccuracies (e.g. `1.005` rounds accurately to `1.01`).

```ts
roundTo(1.005, 2); // => 1.01 (native Math.round gives 1.00)
roundTo(123.456, 1); // => 123.5
```

#### `randomInt(min: number, max: number, random?: () => number): number`

Generates a random integer between `min` and `max` inclusive. Supports an injected generator for deterministic testing.

```ts
randomInt(1, 10); // integer between 1 and 10
randomInt(1, 10, () => 0); // => 1 (deterministic)
```

#### `sum(values: readonly number[]): number`

Computes the total sum of an array of numbers. Returns `0` for empty arrays.

```ts
sum([1, 2, 3, 4]); // => 10
```

#### `average(values: readonly number[]): number`

Calculates the arithmetic mean of numbers. Returns `0` for empty arrays.

```ts
average([10, 20, 30]); // => 20
```

#### `isFiniteNumber(value: unknown): value is number`

Strict type guard verifying that a value is a real, finite number without type coercion (unlike global `isFinite`).

```ts
isFiniteNumber(42); // => true
isFiniteNumber("42"); // => false
isFiniteNumber(Infinity); // => false
```

---

### 5. Async Utilities (`@codewithraheem/devkit/async`)

#### `sleep(ms: number, options?: { signal?: AbortSignal }): Promise<void>`

Pauses execution for `ms` milliseconds. Supports cancellation with standard `AbortSignal` and cleans up pending timers immediately on abort.

```ts
await sleep(1000);

// With cancellation
const controller = new AbortController();
setTimeout(() => controller.abort(), 200);
await sleep(1000, { signal: controller.signal }); // Rejects after 200ms
```

#### `retry<T>(operation: (attempt: number) => Promise<T> | T, options?: RetryOptions): Promise<T>`

Executes an async operation with bounded retry attempts, exponential backoff, maximum delay caps, and abort signal cancellation.

```ts
const data = await retry(
  async (attempt) => {
    return fetchUserData(userId);
  },
  {
    retries: 3,
    delay: 500,
    backoff: 2,
    shouldRetry: (err) => isNetworkError(err),
  }
);
```

#### `withTimeout<T>(operation: Promise<T> | (() => Promise<T>), timeoutMs: number, options?: WithTimeoutOptions<T>): Promise<T>`

Enforces a maximum duration on a Promise. Rejects with `TimeoutError` or resolves with an optional `fallback`. Cleans up timers immediately upon resolution.

> **Note on Cancellation**: Standard JavaScript Promises are eager. While `withTimeout` rejects immediately and frees its timer upon timeout, the underlying task continues unless it accepts an `AbortSignal`.

```ts
try {
  const result = await withTimeout(fetchLargeReport(), 5000);
} catch (err) {
  if (err instanceof TimeoutError) {
    console.error("Report generation timed out");
  }
}
```

#### `debounce<Args, R>(fn: (...args: Args) => R, waitMs: number, options?: DebounceOptions)`

Creates a debounced function with `.cancel()`, `.flush()`, and `.pending()` controls.

```ts
const onSearch = debounce((query: string) => {
  performSearch(query);
}, 300);

onSearch("hello");
onSearch.flush(); // executes immediately
```

#### `throttle<Args, R>(fn: (...args: Args) => R, waitMs: number, options?: ThrottleOptions)`

Creates a throttled function limiting invocations to at most once per `waitMs`. Provides `.cancel()`, `.flush()`, and `.pending()`.

```ts
const onScroll = throttle(() => {
  updateScrollPosition();
}, 100);
```

---

### 6. Validation Utilities (`@codewithraheem/devkit/validation`)

#### `safeJsonParse<T = unknown>(text: unknown, reviver?: Reviver): SafeJsonResult<T>`

Safely parses JSON into a discriminated union return type without throwing:

```ts
const res = safeJsonParse<{ username: string }>(rawJson);
if (res.success) {
  console.log(res.data.username);
} else {
  console.error("Parse failed:", res.error.message);
}
```

#### `isValidJSON(value: unknown): boolean`

Checks if a string contains syntactically valid JSON.

```ts
isValidJSON('{"valid": true}'); // => true
isValidJSON("invalid"); // => false
```

#### `isEmail(value: unknown): boolean`

ReDoS-safe syntactic email validation conforming to RFC 5321 length limits (254 chars max) and RFC 5322 syntax.

```ts
isEmail("raheem@example.com"); // => true
isEmail("invalid..email@domain.com"); // => false
```

#### `isURL(value: unknown, options?: { protocols?: string[] }): boolean`

Validates URLs using the standard WHATWG URL parser. Defaults to `http` and `https`.

```ts
isURL("https://codewithraheem.dev"); // => true
isURL("ftp://files.example.com", { protocols: ["ftp"] }); // => true
isURL("javascript:alert(1)"); // => false
```

#### `isUUID(value: unknown, version?: 1 | 2 | 3 | 4 | 5 | "all"): boolean`

Validates RFC 4122 UUID format (including nil UUID) and specific versions.

```ts
isUUID("f47ac10b-58cc-4372-a567-0e02b2c3d479", 4); // => true
```

#### `isPlainObject(value: unknown): value is Record<PropertyKey, unknown>`

Checks whether a value is an object created by `{}` or `Object.create(null)`.

```ts
isPlainObject({}); // => true
isPlainObject(Object.create(null)); // => true
isPlainObject(new Date()); // => false
isPlainObject([]); // => false
```

---

### 7. Error Utilities (`@codewithraheem/devkit/error`)

#### `normalizeError(error: unknown): Error`

Converts unknown thrown values into authentic `Error` instances while preserving names, messages, cause objects, and stack traces.

```ts
try {
  throw "Network request failed";
} catch (err) {
  const error = normalizeError(err);
  console.error(error.message); // "Network request failed"
}
```

#### `getErrorMessage(error: unknown, fallback?: string): string`

Extracts a human-readable message from native errors, strings, or error-like objects without leaking private object structures.

```ts
getErrorMessage(new Error("Database offline")); // => "Database offline"
getErrorMessage("Direct string error"); // => "Direct string error"
getErrorMessage(null); // => "An unknown error occurred"
```

#### `isErrorLike(value: unknown): value is ErrorLike`

Type guard verifying whether an object possesses `name` and `message` string properties.

---

### 8. Date Utilities (`@codewithraheem/devkit/date`)

#### `isValidDate(value: unknown): value is Date`

Type guard checking if a value is a valid, non-NaN `Date` instance.

```ts
isValidDate(new Date()); // => true
isValidDate(new Date("invalid")); // => false
```

#### `startOfDay(date: Date): Date`

Returns a new `Date` instance at midnight `00:00:00.000` in local time. Pure and non-mutating.

```ts
const start = startOfDay(new Date());
```

#### `endOfDay(date: Date): Date`

Returns a new `Date` instance at `23:59:59.999` in local time. Pure and non-mutating.

```ts
const end = endOfDay(new Date());
```

#### `daysBetween(start: Date, end: Date): number`

Calculates the number of whole calendar days between two dates.

> **Daylight Saving Time (DST) & Timezone Semantics**: Local calendar days vary between 23, 24, and 25 hours due to DST transitions. To prevent off-by-one errors, `daysBetween` extracts calendar components (`getFullYear()`, `getMonth()`, `getDate()`) and calculates difference via UTC midnight timestamps.

```ts
const d1 = new Date("2025-03-01");
const d2 = new Date("2025-03-05");
daysBetween(d1, d2); // => 4
daysBetween(d2, d1); // => -4
```

---

## TypeScript Inference & Discriminated Unions

CodeWithRaheem DevKit is engineered for TypeScript developers:

```ts
import { partition, safeJsonParse, pick } from "@codewithraheem/devkit";

// Automatic Narrowing
const mixed = ["a", 1, "b", 2];
const [strings, numbers] = partition(
  mixed,
  (item): item is string => typeof item === "string"
);
// strings: string[], numbers: (string | number)[]

// Discriminated Union
const res = safeJsonParse<{ token: string }>('{"token": "abc"}');
if (res.success) {
  // TypeScript knows res.data has token
  console.log(res.data.token);
} else {
  // TypeScript knows res.error is Error
  console.error(res.error.message);
}
```

---

## Security & Reliability

- **No Prototype Pollution**: Object functions (`pick`, `omit`, `getPath`, `deepClone`) proactively block `__proto__`, `prototype`, and `constructor` injection vectors.
- **Linear Regex (ReDoS-Safe)**: Email, slugify, and identifier regexes avoid exponential backtracking.
- **Resource Cleanup**: All async helpers (`sleep`, `retry`, `withTimeout`, `debounce`, `throttle`) clear timers and remove event listeners immediately upon resolution or cancellation.

---

## Contributing

We welcome community contributions! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

```bash
# Clone the repository
git clone https://github.com/RaheemSiddiqui527/codewithraheem-devkit.git

# Install dependencies
npm install

# Run test suite
npm test

# Check linting and formatting
npm run lint
npm run format:check

# Build library
npm run build
```

---

## License

Released under the [MIT License](LICENSE).  
Copyright © 2025-2026 CodeWithRaheem (Raheem Siddiqui).
#   - c o d e w i t h r a h e e m - d e v k i t -  
 