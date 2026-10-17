# Error Utilities (`@codewithraheem/devkit/error`)

The Error module provides utilities for handling `unknown` thrown values in TypeScript, standardizing them into authentic `Error` instances, and safely extracting human-readable messages without leaking internal system state.

```ts
import {
  normalizeError,
  getErrorMessage,
  isErrorLike,
} from "@codewithraheem/devkit/error";
```

---

## Table of Contents

- [`normalizeError`](#normalizeerror)
- [`getErrorMessage`](#geterrormessage)
- [`isErrorLike`](#iserrorlike)

---

## `normalizeError`

### Purpose & Behavior

In modern TypeScript (with `useUnknownInCatchVariables: true`), any `try...catch (err)` block treats `err` as `unknown` because JavaScript allows throwing arbitrary values:

```js
throw "network dropped";
throw { code: 500, message: "Server down" };
throw 404;
```

`normalizeError` converts any thrown value into an authentic JavaScript `Error` instance:

- If already an `instanceof Error`, returns it directly.
- If a string, returns `new Error(string)`.
- If an object with `message` and `name` properties (an `ErrorLike` object), constructs a new `Error` preserving its `name`, `message`, `stack`, and `cause`.
- If a primitive (such as a number or boolean), constructs an `Error` with a safe generic message, assigning the original thrown value to `error.cause`.

### Exact TypeScript Signature

```ts
function normalizeError(error: unknown): Error;
```

### Parameters

- `error` (`unknown`): The thrown value to normalize.

### Return Type & Value

- **Returns**: `Error` — A genuine JavaScript `Error` instance.

### JavaScript Example

```js
import { normalizeError } from "@codewithraheem/devkit/error";

try {
  throw "Failed to connect to database";
} catch (err) {
  const error = normalizeError(err);
  console.log(error instanceof Error); // true
  console.log(error.message); // "Failed to connect to database"
}
```

### TypeScript Example (Preserving Cause & Stack)

```ts
import { normalizeError } from "@codewithraheem/devkit/error";

async function executeTask() {
  try {
    await externalServiceCall();
  } catch (err: unknown) {
    const error = normalizeError(err);

    // Guaranteed to be an Error with standard properties
    logger.error({
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
  }
}
```

### Edge Cases & Errors

- Never throws. Always successfully produces an `Error`.
- Does not expose full memory dumps or circular references by default.

---

## `getErrorMessage`

### Purpose & Behavior

Safely extracts a readable string error message from any value. If no descriptive message can be determined (e.g. `null` or `{}`), returns the provided `fallback` string (defaulting to `"An unknown error occurred"`).

### Exact TypeScript Signature

```ts
function getErrorMessage(error: unknown, fallback?: string): string;
```

### Parameters

- `error` (`unknown`): The error to inspect.
- `fallback` (`string`, optional): The fallback message if no description exists. Defaults to `"An unknown error occurred"`.

### Return Type & Value

- **Returns**: `string` — A clean error message string.

### JavaScript Example

```js
import { getErrorMessage } from "@codewithraheem/devkit/error";

getErrorMessage(new Error("Disk full")); // "Disk full"
getErrorMessage("Network timeout"); // "Network timeout"
getErrorMessage({ message: "Invalid token" }); // "Invalid token"
getErrorMessage(null); // "An unknown error occurred"
getErrorMessage(undefined, "Operation failed"); // "Operation failed"
```

### TypeScript Example (User-Facing UI Alerts)

```ts
import { getErrorMessage } from "@codewithraheem/devkit/error";

function displayErrorNotification(err: unknown) {
  const message = getErrorMessage(err, "Something went wrong. Please try again.");
  showToast({ type: "error", message });
}
```

---

## `isErrorLike`

### Purpose & Behavior

A TypeScript type guard that checks whether an unknown value conforms to the `ErrorLike` interface (an object possessing both `name` and `message` string properties).

### Exact TypeScript Signature

```ts
interface ErrorLike {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
}

function isErrorLike(value: unknown): value is ErrorLike;
```

### Parameters

- `value` (`unknown`): The value to test.

### Return Type & Value

- **Returns**: `value is ErrorLike` — `true` if conforming to `ErrorLike`, else `false`.

### JavaScript Example

```js
import { isErrorLike } from "@codewithraheem/devkit/error";

isErrorLike(new TypeError("Bad type")); // true
isErrorLike({ name: "CustomError", message: "x" }); // true

isErrorLike("Error string"); // false
isErrorLike({ message: "No name" }); // false
isErrorLike(null); // false
```

---

## Summary Table

| Utility           | Input Type | Return Type          | Never Throws |
| ----------------- | ---------- | -------------------- | ------------ |
| `normalizeError`  | `unknown`  | `Error`              | Yes          |
| `getErrorMessage` | `unknown`  | `string`             | Yes          |
| `isErrorLike`     | `unknown`  | `value is ErrorLike` | Yes          |
