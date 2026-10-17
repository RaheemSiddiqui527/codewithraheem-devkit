# API Reference Index

This is a comprehensive, alphabetical index of every exported utility function, class, and TypeScript type in `@codewithraheem/devkit`.

---

## Functions (Alphabetical)

| Function          | Subpath                             | Brief Description                                            | Documentation Link                         |
| ----------------- | ----------------------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| `average`         | `@codewithraheem/devkit/number`     | Calculates arithmetic mean of numbers                        | [Docs](number.md#average)                  |
| `capitalize`      | `@codewithraheem/devkit/string`     | Capitalizes first letter, lowercases remainder               | [Docs](string.md#capitalize)               |
| `chunk`           | `@codewithraheem/devkit/array`      | Splits an array into sized chunks                            | [Docs](array.md#chunk)                     |
| `clamp`           | `@codewithraheem/devkit/number`     | Constrains number within `[min, max]`                        | [Docs](number.md#clamp)                    |
| `compact`         | `@codewithraheem/devkit/array`      | Filters out all falsy values                                 | [Docs](array.md#compact)                   |
| `daysBetween`     | `@codewithraheem/devkit/date`       | Calculates calendar days using UTC midnight normalization    | [Docs](date.md#daysbetween)                |
| `debounce`        | `@codewithraheem/devkit/async`      | Debounces function calls with cancel/flush                   | [Docs](async.md#debounce)                  |
| `deepClone`       | `@codewithraheem/devkit/object`     | Deep clones objects, arrays, Maps, Sets, Dates               | [Docs](object.md#deepclone)                |
| `endOfDay`        | `@codewithraheem/devkit/date`       | Returns new Date at `23:59:59.999` local time                | [Docs](date.md#endofday)                   |
| `flatten`         | `@codewithraheem/devkit/array`      | Flattens nested arrays to specified depth                    | [Docs](array.md#flatten)                   |
| `getErrorMessage` | `@codewithraheem/devkit/error`      | Safely extracts error message string                         | [Docs](errors.md#geterrormessage)          |
| `getPath`         | `@codewithraheem/devkit/object`     | Safe dot/bracket property accessor with prototype protection | [Docs](object.md#getpath)                  |
| `groupBy`         | `@codewithraheem/devkit/array`      | Groups array elements by key function                        | [Docs](array.md#groupby)                   |
| `isBlank`         | `@codewithraheem/devkit/string`     | Checks if null, undefined, or whitespace string              | [Docs](string.md#isblank)                  |
| `isEmail`         | `@codewithraheem/devkit/validation` | ReDoS-safe RFC 5321/5322 email validation                    | [Docs](validation.md#isemail)              |
| `isEmpty`         | `@codewithraheem/devkit/object`     | Checks if object, array, string, Map, Set is empty           | [Docs](object.md#isempty)                  |
| `isErrorLike`     | `@codewithraheem/devkit/error`      | Type guard for objects with `name` and `message`             | [Docs](errors.md#iserrorlike)              |
| `isFiniteNumber`  | `@codewithraheem/devkit/number`     | Strict type guard for finite numbers                         | [Docs](number.md#isfinitenumber)           |
| `isPlainObject`   | `@codewithraheem/devkit/validation` | Type guard for plain `{}` or `Object.create(null)`           | [Docs](validation.md#isplainobject)        |
| `isURL`           | `@codewithraheem/devkit/validation` | WHATWG standard URL validation                               | [Docs](validation.md#isurl)                |
| `isUUID`          | `@codewithraheem/devkit/validation` | Validates RFC 4122 UUID and versions 1-5                     | [Docs](validation.md#isuuid)               |
| `isValidDate`     | `@codewithraheem/devkit/date`       | Type guard for valid Date instances                          | [Docs](date.md#isvaliddate)                |
| `isValidJSON`     | `@codewithraheem/devkit/validation` | Checks if string is valid JSON syntax                        | [Docs](validation.md#isvalidjson)          |
| `normalizeError`  | `@codewithraheem/devkit/error`      | Standardizes any thrown value into an Error instance         | [Docs](errors.md#normalizeerror)           |
| `omit`            | `@codewithraheem/devkit/object`     | Omits specified keys from object                             | [Docs](object.md#omit)                     |
| `partition`       | `@codewithraheem/devkit/array`      | Splits array into `[truthy, falsy]` tuple                    | [Docs](array.md#partition)                 |
| `pick`            | `@codewithraheem/devkit/object`     | Picks specified keys from object                             | [Docs](object.md#pick)                     |
| `randomInt`       | `@codewithraheem/devkit/number`     | Generates bounded integer with injectable randomness         | [Docs](number.md#randomint)                |
| `retry`           | `@codewithraheem/devkit/async`      | Retries async operation with backoff and cancellation        | [Docs](async.md#retry)                     |
| `roundTo`         | `@codewithraheem/devkit/number`     | Precision-safe symmetric decimal rounding                    | [Docs](number.md#roundto)                  |
| `safeJsonParse`   | `@codewithraheem/devkit/validation` | Discriminated union JSON parser                              | [Docs](validation.md#safejsonparse)        |
| `shuffle`         | `@codewithraheem/devkit/array`      | Fisher-Yates array shuffling                                 | [Docs](array.md#shuffle)                   |
| `sleep`           | `@codewithraheem/devkit/async`      | Promise-based sleep with AbortSignal cancellation            | [Docs](async.md#sleep)                     |
| `slugify`         | `@codewithraheem/devkit/string`     | URL slug generator with Unicode diacritics support           | [Docs](string.md#slugify)                  |
| `startOfDay`      | `@codewithraheem/devkit/date`       | Returns new Date at `00:00:00.000` local time                | [Docs](date.md#startofday)                 |
| `sum`             | `@codewithraheem/devkit/number`     | Computes arithmetic sum of numbers                           | [Docs](number.md#sum)                      |
| `throttle`        | `@codewithraheem/devkit/async`      | Limits invocations to once per interval                      | [Docs](async.md#throttle)                  |
| `toCamelCase`     | `@codewithraheem/devkit/string`     | Converts text to camelCase                                   | [Docs](string.md#tocamelcase)              |
| `toKebabCase`     | `@codewithraheem/devkit/string`     | Converts text to kebab-case                                  | [Docs](string.md#tokebabcase)              |
| `toSnakeCase`     | `@codewithraheem/devkit/string`     | Converts text to snake_case                                  | [Docs](string.md#tosnakecase)              |
| `truncate`        | `@codewithraheem/devkit/string`     | Truncates text with Unicode code point support               | [Docs](string.md#truncate)                 |
| `unique`          | `@codewithraheem/devkit/array`      | Deduplicates array elements                                  | [Docs](array.md#unique)                    |
| `withTimeout`     | `@codewithraheem/devkit/async`      | Limits Promise execution time                                | [Docs](async.md#withtimeout--timeouterror) |

---

## Classes & Types (Alphabetical)

| Type / Class         | Subpath                             | Brief Description                                               | Documentation Link                         |
| -------------------- | ----------------------------------- | --------------------------------------------------------------- | ------------------------------------------ |
| `DebounceOptions`    | `@codewithraheem/devkit/async`      | Options for `debounce` (`leading`, `trailing`, `maxWait`)       | [Docs](async.md#debounce)                  |
| `DebouncedFunction`  | `@codewithraheem/devkit/async`      | Interface representing a debounced function with controls       | [Docs](async.md#debounce)                  |
| `ErrorLike`          | `@codewithraheem/devkit/error`      | Interface matching object with `name` and `message`             | [Docs](errors.md#iserrorlike)              |
| `Falsy`              | `@codewithraheem/devkit/array`      | Union type of all JavaScript falsy values                       | [Docs](array.md#compact)                   |
| `IsUrlOptions`       | `@codewithraheem/devkit/validation` | Configuration for `isURL` (`protocols`)                         | [Docs](validation.md#isurl)                |
| `RetryOptions`       | `@codewithraheem/devkit/async`      | Configuration for `retry` (`retries`, `delay`, etc.)            | [Docs](async.md#retry)                     |
| `SafeJsonResult`     | `@codewithraheem/devkit/validation` | Discriminated union result of `safeJsonParse`                   | [Docs](validation.md#safejsonparse)        |
| `SleepOptions`       | `@codewithraheem/devkit/async`      | Options for `sleep` (`signal`)                                  | [Docs](async.md#sleep)                     |
| `ThrottleOptions`    | `@codewithraheem/devkit/async`      | Configuration for `throttle` (`leading`, `trailing`)            | [Docs](async.md#throttle)                  |
| `ThrottledFunction`  | `@codewithraheem/devkit/async`      | Interface representing a throttled function with controls       | [Docs](async.md#throttle)                  |
| `TimeoutError`       | `@codewithraheem/devkit/async`      | Error subclass thrown on `withTimeout` expiration               | [Docs](async.md#withtimeout--timeouterror) |
| `UuidVersion`        | `@codewithraheem/devkit/validation` | Union of valid UUID versions (`1 \| 2 \| 3 \| 4 \| 5 \| "all"`) | [Docs](validation.md#isuuid)               |
| `WithTimeoutOptions` | `@codewithraheem/devkit/async`      | Configuration for `withTimeout` (`signal`, `fallback`, etc.)    | [Docs](async.md#withtimeout--timeouterror) |
