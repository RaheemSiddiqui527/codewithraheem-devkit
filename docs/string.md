# String Utilities (`@codewithraheem/devkit/string`)

The String module provides functions for casing conversions, truncation, slug generation, and whitespace inspection with robust Unicode support.

```ts
import {
  capitalize,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  truncate,
  slugify,
  isBlank,
} from "@codewithraheem/devkit/string";
```

---

## Table of Contents

- [`capitalize`](#capitalize)
- [`toCamelCase`](#toCamelCase)
- [`toKebabCase`](#toKebabCase)
- [`toSnakeCase`](#toSnakeCase)
- [`truncate`](#truncate)
- [`slugify`](#slugify)
- [`isBlank`](#isBlank)

---

## `capitalize`

### Purpose & Behavior

Capitalizes the first character of a string and converts all subsequent characters to lowercase.

### Exact TypeScript Signature

```ts
function capitalize(value: string): string;
```

### Parameters

- `value` (`string`): The string to capitalize.

### Return Type & Value

- **Returns**: `string` — The capitalized string.
- **Mutation**: Strings are primitive values and cannot be mutated.

### JavaScript Example

```js
import { capitalize } from "@codewithraheem/devkit/string";

console.log(capitalize("hello world")); // "Hello world"
console.log(capitalize("DEV_KIT")); // "Dev_kit"
console.log(capitalize("")); // ""
```

### TypeScript Example

```ts
import { capitalize } from "@codewithraheem/devkit/string";

const role: string = "admin";
const displayRole: string = capitalize(role);
// displayRole: "Admin"
```

### Edge Cases & Errors

- **Empty string**: Returns `""`.
- **Invalid argument**: Throws `TypeError` if `value` is not a string.

---

## `toCamelCase`

### Purpose & Behavior

Converts a delimited, snake_case, kebab-case, or spaced string into standard `camelCase`. Handles uppercase acronyms cleanly without inserting unexpected delimiters.

### Exact TypeScript Signature

```ts
function toCamelCase(value: string): string;
```

### Parameters

- `value` (`string`): The string to convert.

### Return Type & Value

- **Returns**: `string` — The camelCased string.

### JavaScript Example

```js
import { toCamelCase } from "@codewithraheem/devkit/string";

console.log(toCamelCase("user_profile_id")); // "userProfileId"
console.log(toCamelCase("hello-world")); // "helloWorld"
console.log(toCamelCase("APIResponse")); // "apiResponse"
console.log(toCamelCase("getUserID")); // "getUserId"
console.log(toCamelCase("version_2_build")); // "version2Build"
```

### Edge Cases & Errors

- **Empty or symbol-only strings**: Returns `""`.
- **Invalid argument**: Throws `TypeError` if `value` is not a string.

### Related Utilities

- [`toKebabCase`](#toKebabCase)
- [`toSnakeCase`](#toSnakeCase)

---

## `toKebabCase`

### Purpose & Behavior

Converts camelCase, PascalCase, snake_case, or spaced strings into hyphen-separated `kebab-case`.

### Exact TypeScript Signature

```ts
function toKebabCase(value: string): string;
```

### Parameters

- `value` (`string`): The string to convert.

### Return Type & Value

- **Returns**: `string` — The kebab-cased string.

### JavaScript Example

```js
import { toKebabCase } from "@codewithraheem/devkit/string";

console.log(toKebabCase("helloWorld")); // "hello-world"
console.log(toKebabCase("UserProfileId")); // "user-profile-id"
console.log(toKebabCase("APIResponse")); // "api-response"
console.log(toKebabCase("getHTTPSUrl")); // "get-https-url"
```

### Edge Cases & Errors

- **Empty string**: Returns `""`.
- **Invalid argument**: Throws `TypeError` if `value` is not a string.

---

## `toSnakeCase`

### Purpose & Behavior

Converts camelCase, PascalCase, kebab-case, or spaced strings into underscore-separated `snake_case`.

### Exact TypeScript Signature

```ts
function toSnakeCase(value: string): string;
```

### Parameters

- `value` (`string`): The string to convert.

### Return Type & Value

- **Returns**: `string` — The snake_cased string.

### JavaScript Example

```js
import { toSnakeCase } from "@codewithraheem/devkit/string";

console.log(toSnakeCase("helloWorld")); // "hello_world"
console.log(toSnakeCase("UserProfileId")); // "user_profile_id"
console.log(toSnakeCase("APIResponse")); // "api_response"
```

### Edge Cases & Errors

- **Empty string**: Returns `""`.
- **Invalid argument**: Throws `TypeError` if `value` is not a string.

---

## `truncate`

### Purpose & Behavior

Truncates a string if its character count exceeds `maxLength`, appending a `suffix` (default: `...`). Correctly handles Unicode surrogate pairs (such as emojis and non-BMP characters) by counting and slicing on complete code points rather than raw UTF-16 code units.

### Exact TypeScript Signature

```ts
function truncate(value: string, maxLength: number, suffix?: string): string;
```

### Parameters

- `value` (`string`): The source text to truncate.
- `maxLength` (`number`): The maximum length of the resulting string (including `suffix`).
- `suffix` (`string`, optional): The truncation suffix. Defaults to `"..."`.

### Return Type & Value

- **Returns**: `string` — The truncated string with suffix, or the original string if within limit.

### JavaScript Example

```js
import { truncate } from "@codewithraheem/devkit/string";

console.log(truncate("Hello, World!", 8));
// Output: "Hello..."

console.log(truncate("Hello, World!", 8, "…"));
// Output: "Hello, …"

// Unicode emoji handling: 5 rockets
console.log(truncate("🚀🚀🚀🚀🚀", 4));
// Output: "🚀..." (never breaks a surrogate pair into an invalid character!)
```

### TypeScript Example

```ts
import { truncate } from "@codewithraheem/devkit/string";

const title: string = "Building Scalable TypeScript Systems with CodeWithRaheem";
const summary: string = truncate(title, 25, " [read more]");
// summary: "Building Scal [read more]"
```

### Edge Cases & Errors

- **`maxLength <= 0`**: Returns `""`.
- **`value.length <= maxLength`**: Returns original `value`.
- **`suffix.length >= maxLength`**: Returns `suffix.slice(0, maxLength)`.
- **Invalid arguments**: Throws `TypeError` if `value` or `suffix` is not a string, or `maxLength` is not a valid number.

---

## `slugify`

### Purpose & Behavior

Converts an arbitrary string into a URL-safe, lowercase slug.

1. Normalizes Unicode characters using NFD decomposition to remove accents/diacritical marks (e.g. `é` becomes `e`).
2. Converts to lowercase.
3. Replaces non-alphanumeric characters with hyphens.
4. Collapses consecutive hyphens and trims leading and trailing hyphens.

### Exact TypeScript Signature

```ts
function slugify(value: string): string;
```

### Parameters

- `value` (`string`): The text to slugify.

### Return Type & Value

- **Returns**: `string` — The URL-safe slug.

### JavaScript Example

```js
import { slugify } from "@codewithraheem/devkit/string";

console.log(slugify("Hello, World!"));
// Output: "hello-world"

console.log(slugify("Café & Crème brûlée 101"));
// Output: "cafe-creme-brulee-101"

console.log(slugify("   ---DevKit---Guide---   "));
// Output: "devkit-guide"
```

### Edge Cases & Errors

- **Empty or symbol-only strings**: Returns `""`.
- **Invalid argument**: Throws `TypeError` if `value` is not a string.

---

## `isBlank`

### Purpose & Behavior

Checks whether a value is `null`, `undefined`, or a string containing only whitespace characters. Recognizes all standard and Unicode whitespace characters (including non-breaking spaces `\u00A0` and ideographic spaces `\u3000`).

### Exact TypeScript Signature

```ts
function isBlank(value: unknown): boolean;
```

### Parameters

- `value` (`unknown`): The value to inspect.

### Return Type & Value

- **Returns**: `boolean` — `true` if `value` is null, undefined, or empty/whitespace; else `false`.

### JavaScript Example

```js
import { isBlank } from "@codewithraheem/devkit/string";

isBlank(""); // true
isBlank("   "); // true
isBlank("\t\n\r"); // true
isBlank(null); // true
isBlank(undefined); // true

isBlank("  hello  "); // false
isBlank("a"); // false
isBlank(123); // false (numbers are not blank strings)
```

### Edge Cases & Errors

- Safely handles any unknown input without throwing. Non-string, non-null values return `false`.

### Related Utilities

- [`isEmpty`](object.md#isempty) — For checking collections, arrays, and objects.

---

## Summary Table

| Utility       | Unicode-Aware            | Input Type | Output on Empty |
| ------------- | ------------------------ | ---------- | --------------- |
| `capitalize`  | Yes                      | `string`   | `""`            |
| `toCamelCase` | Yes                      | `string`   | `""`            |
| `toKebabCase` | Yes                      | `string`   | `""`            |
| `toSnakeCase` | Yes                      | `string`   | `""`            |
| `truncate`    | Yes (Code Points)        | `string`   | `""`            |
| `slugify`     | Yes (NFD normalization)  | `string`   | `""`            |
| `isBlank`     | Yes (Unicode whitespace) | `unknown`  | `true`          |
