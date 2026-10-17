# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - Initial Release

### Added

- **Array Utilities**:
  - `chunk(array, size)`: Split array into sized chunks.
  - `unique(array)`: Deduplicate array items preserving first seen order.
  - `groupBy(array, keyFn)`: Group array items by key function.
  - `partition(array, predicate)`: Partition array into truthy and falsy subsets.
  - `compact(array)`: Filter out all falsy values.
  - `flatten(array, depth?)`: Flatten arrays with depth control.
  - `shuffle(array, random?)`: Fisher-Yates array shuffling with testable injected randomness.

- **Object Utilities**:
  - `pick(object, keys)`: Select subset of own properties with prototype protection.
  - `omit(object, keys)`: Exclude specified properties.
  - `isEmpty(value)`: Validate empty objects, collections, Maps, Sets, strings.
  - `getPath(object, path, fallback?)`: Nested property retrieval by string or array path.
  - `deepClone(value)`: Deep cloning with circular reference safety, Maps, Sets, Dates, and TypedArrays.

- **String Utilities**:
  - `capitalize(value)`: Capitalize first character and lowercase the rest.
  - `toCamelCase(value)`: Convert strings to camelCase with acronym support.
  - `toKebabCase(value)`: Convert strings to kebab-case.
  - `toSnakeCase(value)`: Convert strings to snake_case.
  - `truncate(value, maxLength, suffix?)`: Truncate string with Unicode emoji support.
  - `slugify(value)`: Convert text to clean URL slug with diacritic normalization.
  - `isBlank(value)`: Check for empty or whitespace-only strings.

- **Number Utilities**:
  - `clamp(value, min, max)`: Bound values within range.
  - `roundTo(value, decimals?)`: IEEE 754 precision-safe decimal rounding.
  - `randomInt(min, max, random?)`: Bounded integer generation with injected randomness.
  - `sum(values)`: Sum array of numbers.
  - `average(values)`: Arithmetic mean of numbers.
  - `isFiniteNumber(value)`: Strict type guard for finite numbers.

- **Async Utilities**:
  - `sleep(ms, options?)`: Cancellation-aware sleep using AbortSignal.
  - `retry(operation, options?)`: Retry with exponential backoff and delay capping.
  - `withTimeout(operation, timeoutMs, options?)`: Promise timeout with clean timer disposal.
  - `debounce(fn, waitMs, options?)`: Debounced calls with cancel, flush, and pending status.
  - `throttle(fn, waitMs, options?)`: Throttled calls with cancel, flush, and pending status.

- **Validation Utilities**:
  - `safeJsonParse(text)`: Discriminated union JSON parsing.
  - `isValidJSON(value)`: Syntax check for valid JSON.
  - `isEmail(value)`: RFC 5321/5322 ReDoS-safe email validation.
  - `isURL(value, options?)`: WHATWG URL parser validation.
  - `isUUID(value, version?)`: RFC 4122 UUID validation.
  - `isPlainObject(value)`: Plain object type guard.

- **Error Utilities**:
  - `normalizeError(error)`: Standardize unknown errors into genuine Error instances.
  - `getErrorMessage(error, fallback?)`: Human-readable error message extraction.
  - `isErrorLike(value)`: Type guard for ErrorLike objects.

- **Date Utilities**:
  - `isValidDate(value)`: Date instance validation.
  - `startOfDay(date)`: Pure local midnight constructor.
  - `endOfDay(date)`: Pure local end-of-day constructor.
  - `daysBetween(start, end)`: DST-safe calendar day calculation.

- **Tooling & Infrastructure**:
  - Dual ESM (`.mjs`) and CommonJS (`.cjs`) builds via `tsup`.
  - Type declaration files (`.d.ts` and `.d.cts`) generated.
  - Comprehensive automated tests with Vitest (>94% branch coverage, 100% function coverage).
  - ESLint flat configuration and Prettier code formatting.
  - GitHub Actions Continuous Integration workflow.
  - Complete ESM and CommonJS consumer verification test cases.
