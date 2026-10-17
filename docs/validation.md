# Validation Utilities (`@codewithraheem/devkit/validation`)

The Validation module delivers format validators, type guards, and safe JSON parsers without heavy external dependencies.

```ts
import {
  safeJsonParse,
  isValidJSON,
  isEmail,
  isURL,
  isUUID,
  isPlainObject,
} from "@codewithraheem/devkit/validation";
```

---

## Table of Contents

- [`safeJsonParse`](#safejsonparse)
- [`isValidJSON`](#isvalidjson)
- [`isEmail`](#isemail)
- [`isURL`](#isurl)
- [`isUUID`](#isuuid)
- [`isPlainObject`](#isplainobject)

---

## `safeJsonParse`

### Purpose & Behavior

Safely parses a JSON string into a JavaScript value using a **discriminated union** return type (`{ success: true, data } | { success: false, error }`). This eliminates the need for boilerplate `try...catch` blocks.

> **Compile-Time Type Assertion Notice**: The generic type parameter `safeJsonParse<T>(...)` is a TypeScript compile-time assertion and does **not** validate untrusted external JSON data at runtime. Pair this with a runtime schema validator or type guard if runtime schema guarantees are required.

### Exact TypeScript Signature

```ts
type SafeJsonResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: Error };

function safeJsonParse<T = unknown>(
  text: unknown,
  reviver?: (this: unknown, key: string, value: unknown) => unknown
): SafeJsonResult<T>;
```

### Parameters

- `text` (`unknown`): The JSON string to parse.
- `reviver` (`Function`, optional): A reviver function prescribed by standard `JSON.parse`.

### Return Type & Value

- **Returns**: `SafeJsonResult<T>` — Discriminated union with either `data` or `error`.

### JavaScript Example

```js
import { safeJsonParse } from "@codewithraheem/devkit/validation";

const result = safeJsonParse('{"user": "Raheem"}');

if (result.success) {
  console.log("Parsed:", result.data.user);
} else {
  console.error("Parse failed:", result.error.message);
}
```

### TypeScript Example (Discriminated Union Narrowing)

```ts
import { safeJsonParse } from "@codewithraheem/devkit/validation";

interface ApiResponse {
  status: "ok" | "error";
  code: number;
}

const response = safeJsonParse<ApiResponse>(rawJsonString);

if (response.success) {
  // TypeScript narrows response.data to ApiResponse
  console.log("Status:", response.data.status);
} else {
  // TypeScript narrows response.error to Error
  console.error("Syntax error:", response.error.message);
}
```

### Edge Cases & Errors

- **Non-string input**: If `text` is not a string, returns `{ success: false, error: TypeError }`. Does not throw.
- **Malformed syntax**: Returns `{ success: false, error: SyntaxError }`. Does not throw.

---

## `isValidJSON`

### Purpose & Behavior

Tests whether an arbitrary value is a string of valid JSON syntax.

### Exact TypeScript Signature

```ts
function isValidJSON(value: unknown): boolean;
```

### Parameters

- `value` (`unknown`): The value to test.

### Return Type & Value

- **Returns**: `boolean` — `true` if `value` is valid JSON, else `false`.

### JavaScript Example

```js
import { isValidJSON } from "@codewithraheem/devkit/validation";

isValidJSON('{"a": 1}'); // true
isValidJSON("[1, 2, 3]"); // true
isValidJSON('"string"'); // true
isValidJSON("null"); // true

isValidJSON("bad json"); // false
isValidJSON(123); // false (numbers are not JSON strings)
isValidJSON(null); // false
```

---

## `isEmail`

### Purpose & Behavior

Validates whether a string matches a standard email address format using a linear, ReDoS-safe regular expression conforming to RFC 5321 length limits and RFC 5322 syntax.

### Format Rules

- **Total length**: Maximum 254 characters (RFC 5321).
- **Local part**: 1-64 characters. Allowed characters: alphanumeric and `.!#$%&'*+/=?^_{|}~-`. Cannot begin or end with a dot, nor contain consecutive dots (`..`).
- **Domain part**: Valid domain labels separated by dots, each 1-63 characters, not starting or ending with a hyphen, ending with a TLD of at least 2 characters.

> **Security & Deliverability Disclaimer**: Syntactic validation confirms the string matches standard email formatting rules. It does **not** check whether the mailbox exists, whether DNS MX records are configured, or whether the inbox will accept messages.

### Exact TypeScript Signature

```ts
function isEmail(value: unknown): boolean;
```

### Parameters

- `value` (`unknown`): The value to check.

### Return Type & Value

- **Returns**: `boolean` — `true` if valid email format, else `false`.

### JavaScript Example

```js
import { isEmail } from "@codewithraheem/devkit/validation";

isEmail("raheem@example.com"); // true
isEmail("user.name+tag@sub.domain.co"); // true

isEmail("missing-at.com"); // false
isEmail("@missing-local.com"); // false
isEmail("invalid..dots@domain.com"); // false
isEmail(".leadingdot@domain.com"); // false
```

---

## `isURL`

### Purpose & Behavior

Validates whether a string is a valid, parseable URL using the standard WHATWG `URL` constructor. Allows restricting acceptable protocols (defaults to `http` and `https`).

### Exact TypeScript Signature

```ts
interface IsUrlOptions {
  protocols?: string[]; // default: ["http", "https"]
  requireProtocol?: boolean; // default: true
}

function isURL(value: unknown, options?: IsUrlOptions): boolean;
```

### Parameters

- `value` (`unknown`): The string to test.
- `options` (`IsUrlOptions`, optional): Allowed protocols configuration.

### Return Type & Value

- **Returns**: `boolean` — `true` if valid URL matching options, else `false`.

### JavaScript Example

```js
import { isURL } from "@codewithraheem/devkit/validation";

isURL("https://codewithraheem.dev"); // true
isURL("http://localhost:3000/api"); // true

// Custom allowed protocols
isURL("ftp://files.example.com", { protocols: ["ftp"] }); // true

// Disallowed or dangerous schemes
isURL("javascript:alert(1)"); // false
isURL("data:text/html,<b>hi</b>"); // false
isURL("not a url"); // false
```

---

## `isUUID`

### Purpose & Behavior

Validates whether a string conforms to the RFC 4122 UUID format (`8-4-4-4-12` hex characters). Supports checking any valid UUID (including the nil UUID `00000000-0000-0000-0000-000000000000`) or targeting specific versions 1, 2, 3, 4, or 5.

### Exact TypeScript Signature

```ts
type UuidVersion = 1 | 2 | 3 | 4 | 5 | "all";

function isUUID(value: unknown, version?: UuidVersion): boolean;
```

### Parameters

- `value` (`unknown`): The value to inspect.
- `version` (`UuidVersion`, optional): Target version. Defaults to `"all"`.

### JavaScript Example

```js
import { isUUID } from "@codewithraheem/devkit/validation";

// Version 4 UUID
const v4 = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
isUUID(v4); // true
isUUID(v4, 4); // true
isUUID(v4, 1); // false

// Nil UUID
isUUID("00000000-0000-0000-0000-000000000000"); // true
```

---

## `isPlainObject`

### Purpose & Behavior

A strict type guard checking whether a value is a plain object created by `{}` or `Object.create(null)` or `new Object()`. Returns `false` for null, arrays, functions, dates, regexes, Maps, Sets, and class instances.

### Exact TypeScript Signature

```ts
function isPlainObject(value: unknown): value is Record<PropertyKey, unknown>;
```

### Parameters

- `value` (`unknown`): The value to test.

### Return Type & Value

- **Returns**: `value is Record<PropertyKey, unknown>` — `true` if plain object, else `false`.

### Comparison of Object Types

| Value                 | `isPlainObject(val)` | `typeof val === "object"` |
| --------------------- | -------------------- | ------------------------- |
| `{ a: 1 }`            | `true`               | `true`                    |
| `Object.create(null)` | `true`               | `true`                    |
| `new Object()`        | `true`               | `true`                    |
| `[1, 2]`              | **`false`**          | `true`                    |
| `new Date()`          | **`false`**          | `true`                    |
| `new Map()`           | **`false`**          | `true`                    |
| `null`                | **`false`**          | `true`                    |
| `new Error()`         | **`false`**          | `true`                    |

### TypeScript Example

```ts
import { isPlainObject } from "@codewithraheem/devkit/validation";

function mergePayload(data: unknown) {
  if (isPlainObject(data)) {
    // TypeScript narrows data to Record<PropertyKey, unknown>
    console.log("Keys:", Object.keys(data));
  }
}
```

---

## Summary Table

| Utility         | Return Type            | Never Throws | Primary Use Case                                         |
| --------------- | ---------------------- | ------------ | -------------------------------------------------------- |
| `safeJsonParse` | `SafeJsonResult<T>`    | Yes          | Safe parsing without `try/catch`                         |
| `isValidJSON`   | `boolean`              | Yes          | Syntax pre-validation                                    |
| `isEmail`       | `boolean`              | Yes          | RFC email format checking                                |
| `isURL`         | `boolean`              | Yes          | WHATWG URL verification                                  |
| `isUUID`        | `boolean`              | Yes          | RFC 4122 UUID verification                               |
| `isPlainObject` | `boolean` (type guard) | Yes          | Discriminating plain objects from class instances/arrays |
