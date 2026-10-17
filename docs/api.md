# API Documentation — `@codewithraheem/devkit`

This document outlines the detailed TypeScript signatures, parameter types, return values, error handling, and behavioral semantics of all exported utilities.

---

## 1. Array Module (`@codewithraheem/devkit/array`)

### `chunk<T>(array: readonly T[], size: number): T[][]`

Splits an array into chunks of specified maximum size.

- **Parameters**:
  - `array`: `readonly T[]` — Input array to chunk.
  - `size`: `number` — Size of each chunk. Must be a positive integer > 0.
- **Returns**: `T[][]` — New array of chunks.
- **Throws**:
  - `TypeError` if `array` is not an array.
  - `RangeError` if `size` is not an integer or <= 0.
- **Edge cases**: Empty array returns `[]`. Does not mutate input.

### `unique<T>(array: readonly T[]): T[]`

Deduplicates array elements, keeping the first occurrence.

- **Parameters**: `array`: `readonly T[]`
- **Returns**: `T[]` — New deduplicated array.
- **Throws**: `TypeError` if input is not an array.
- **Notes**: Correctly deduplicates `NaN` using `Set` semantics (`NaN === NaN`).

### `groupBy<T, K extends PropertyKey>(array: readonly T[], keyFn: (item: T, index: number) => K): Record<K, T[]>`

Groups elements by key returned from `keyFn`.

- **Parameters**:
  - `array`: `readonly T[]`
  - `keyFn`: `(item: T, index: number) => K`
- **Returns**: `Record<K, T[]>`
- **Throws**: `TypeError` if `array` is not an array or `keyFn` is not a function.

### `partition<T, S extends T>(array: readonly T[], predicate: (item: T, index: number) => item is S): [S[], Exclude<T, S>[]]`

### `partition<T>(array: readonly T[], predicate: (item: T, index: number) => boolean): [T[], T[]]`

Splits an array into `[truthyElements, falsyElements]`.

- **Parameters**: `array`: `readonly T[]`, `predicate`: `(item: T, index: number) => boolean`
- **Returns**: `[T[], T[]]`
- **Throws**: `TypeError` if invalid arguments.

### `compact<T>(array: readonly (T | Falsy)[]): T[]`

Removes falsy values (`false`, `""`, `0`, `0n`, `null`, `undefined`, `NaN`).

- **Parameters**: `array`: `readonly (T | Falsy)[]`
- **Returns**: `T[]`

### `flatten<T = unknown>(array: readonly unknown[], depth?: number): T[]`

Flattens arrays recursively up to `depth` levels (default: `1`).

- **Parameters**: `array`: `readonly unknown[]`, `depth`: `number` (default: 1)
- **Returns**: `T[]`
- **Throws**: `RangeError` if depth < 0 or NaN.

### `shuffle<T>(array: readonly T[], random?: () => number): T[]`

Fisher-Yates in-place copy shuffle.

- **Parameters**: `array`: `readonly T[]`, `random`: `() => number` (default: `Math.random`)
- **Returns**: `T[]` — New shuffled array.

---

## 2. Object Module (`@codewithraheem/devkit/object`)

### `pick<T extends object, K extends keyof T>(object: T, keys: readonly K[]): Pick<T, K>`

Picks specified properties. Guards against prototype pollution (`__proto__`, `constructor`, `prototype`).

- **Parameters**: `object: T`, `keys: readonly K[]`
- **Returns**: `Pick<T, K>`

### `omit<T extends object, K extends keyof T>(object: T, keys: readonly K[]): Omit<T, K>`

Omits specified properties. Guards against prototype pollution.

- **Parameters**: `object: T`, `keys: readonly K[]`
- **Returns**: `Omit<T, K>`

### `isEmpty(value: unknown): boolean`

Checks if value is empty (`null`, `undefined`, `""`, `[]`, `{}`, empty Map/Set/TypedArray).

- **Parameters**: `value: unknown`
- **Returns**: `boolean`

### `getPath<T = unknown>(object: unknown, path: string | readonly (string | number)[], fallback?: T): T`

Retrieves nested property value by dot or bracket path. Proactively protects against prototype pollution.

- **Parameters**: `object: unknown`, `path: string | readonly (string | number)[]`, `fallback?: T`
- **Returns**: `T`

### `deepClone<T>(value: T): T`

Deep clones primitives, objects, arrays, Dates, RegExps, Maps, Sets, ArrayBuffers, and TypedArrays.
Handles circular references with an internal `WeakMap`. Prevents prototype pollution.

- **Parameters**: `value: T`
- **Returns**: `T`

---

## 3. String Module (`@codewithraheem/devkit/string`)

### `capitalize(value: string): string`

Upper-cases first character, lower-cases remaining characters.

### `toCamelCase(value: string): string`

Converts words to camelCase. Handles acronyms (`APIResponse` -> `apiResponse`).

### `toKebabCase(value: string): string`

Converts words to kebab-case (`helloWorld` -> `hello-world`).

### `toSnakeCase(value: string): string`

Converts words to snake_case (`helloWorld` -> `hello_world`).

### `truncate(value: string, maxLength: number, suffix?: string): string`

Truncates string to `maxLength` characters including `suffix`. Preserves Unicode code points.

### `slugify(value: string): string`

Normalizes Unicode diacritics and converts string to URL-safe slug.

### `isBlank(value: unknown): boolean`

Checks if value is null, undefined, or string with only whitespace.

---

## 4. Number Module (`@codewithraheem/devkit/number`)

### `clamp(value: number, min: number, max: number): number`

Constrains value within `[min, max]`. Throws `RangeError` if `min > max`.

### `roundTo(value: number, decimals?: number): number`

Symmetric rounding half-away-from-zero avoiding binary floating point errors.

### `randomInt(min: number, max: number, random?: () => number): number`

Generates integer between `min` and `max` inclusive.

### `sum(values: readonly number[]): number`

Computes sum. Returns `0` for empty array.

### `average(values: readonly number[]): number`

Computes arithmetic mean. Returns `0` for empty array.

### `isFiniteNumber(value: unknown): value is number`

Strict type guard for finite numbers without string coercion.

---

## 5. Async Module (`@codewithraheem/devkit/async`)

### `sleep(ms: number, options?: SleepOptions): Promise<void>`

Pauses execution. Cleans up timers upon cancellation with `AbortSignal`.

### `retry<T>(operation: (attempt: number) => Promise<T> | T, options?: RetryOptions): Promise<T>`

Retries operation with configurable backoff, `maxDelay`, and `shouldRetry` filter.

### `withTimeout<T>(operation: Promise<T> | (() => Promise<T>), timeoutMs: number, options?: WithTimeoutOptions<T>): Promise<T>`

Enforces timeout. Cleans up timers immediately on resolution or rejection.

### `debounce<Args, R>(fn: (...args: Args) => R, waitMs: number, options?: DebounceOptions)`

Debounces function. Includes `.cancel()`, `.flush()`, `.pending()`.

### `throttle<Args, R>(fn: (...args: Args) => R, waitMs: number, options?: ThrottleOptions)`

Throttles function. Includes `.cancel()`, `.flush()`, `.pending()`.

---

## 6. Validation Module (`@codewithraheem/devkit/validation`)

### `safeJsonParse<T = unknown>(text: unknown, reviver?: Reviver): SafeJsonResult<T>`

Discriminated union `{ success: true, data: T } | { success: false, error: Error }`.

### `isValidJSON(value: unknown): boolean`

Validates JSON syntax.

### `isEmail(value: unknown): boolean`

RFC 5321 length and RFC 5322 format validation.

### `isURL(value: unknown, options?: IsUrlOptions): boolean`

WHATWG URL validation with protocol whitelist.

### `isUUID(value: unknown, version?: UuidVersion): boolean`

RFC 4122 UUID validation.

### `isPlainObject(value: unknown): value is Record<PropertyKey, unknown>`

Checks if object was created with `{}` or `Object.create(null)`.

---

## 7. Error Module (`@codewithraheem/devkit/error`)

### `normalizeError(error: unknown): Error`

Converts any thrown value to standard Error preserving name, message, stack, and cause.

### `getErrorMessage(error: unknown, fallback?: string): string`

Safe extraction of error message.

### `isErrorLike(value: unknown): value is ErrorLike`

Type guard for objects with `name` and `message`.

---

## 8. Date Module (`@codewithraheem/devkit/date`)

### `isValidDate(value: unknown): value is Date`

Type guard for valid `Date` instance.

### `startOfDay(date: Date): Date`

New Date set to midnight `00:00:00.000` in local time.

### `endOfDay(date: Date): Date`

New Date set to `23:59:59.999` in local time.

### `daysBetween(start: Date, end: Date): number`

DST-safe integer calendar day difference calculated via UTC midnight normalization.
