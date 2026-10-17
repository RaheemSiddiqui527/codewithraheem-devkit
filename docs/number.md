# Number Utilities (`@codewithraheem/devkit/number`)

The Number module provides mathematical, bounding, rounding, and statistical helpers engineered for precision and safety.

```ts
import {
  clamp,
  roundTo,
  randomInt,
  sum,
  average,
  isFiniteNumber,
} from "@codewithraheem/devkit/number";
```

---

## Table of Contents

- [`clamp`](#clamp)
- [`roundTo`](#roundTo)
- [`randomInt`](#randomInt)
- [`sum`](#sum)
- [`average`](#average)
- [`isFiniteNumber`](#isFiniteNumber)

---

## `clamp`

### Purpose & Behavior

Restricts a numeric value to an inclusive range defined by `min` and `max`. If `value` is less than `min`, returns `min`; if greater than `max`, returns `max`.

### Exact TypeScript Signature

```ts
function clamp(value: number, min: number, max: number): number;
```

### Parameters

- `value` (`number`): The number to clamp.
- `min` (`number`): The lower inclusive bound.
- `max` (`number`): The upper inclusive bound.

### Return Type & Value

- **Returns**: `number` — The clamped value in `[min, max]`.

### JavaScript Example

```js
import { clamp } from "@codewithraheem/devkit/number";

console.log(clamp(15, 0, 10)); // 10 (upper bound)
console.log(clamp(-5, 0, 10)); // 0  (lower bound)
console.log(clamp(4, 0, 10)); // 4  (within bounds)
```

### TypeScript Example

```ts
import { clamp } from "@codewithraheem/devkit/number";

function setVolume(requestedLevel: number): number {
  return clamp(requestedLevel, 0, 100);
}

console.log(setVolume(120)); // 100
```

### Edge Cases & Errors

- **Invalid bounds**: Throws `RangeError` if `min > max`.
- **NaN or non-number**: Throws `TypeError` if any argument is `NaN` or not of type `number`.

---

## `roundTo`

### Purpose & Behavior

Rounds a number to a specified number of decimal places using exponential notation (`e-notation`) to eliminate binary IEEE 754 floating-point inaccuracies. Implements symmetric half-away-from-zero rounding standard in financial and scientific applications.

#### Why native `Math.round` fails:

In standard JavaScript:

```js
1.005 * 100; // = 100.49999999999999
Math.round(1.005 * 100) / 100; // = 1.00 (INCORRECT!)
```

`roundTo` handles this correctly:

```js
roundTo(1.005, 2); // = 1.01 (CORRECT!)
```

### Exact TypeScript Signature

```ts
function roundTo(value: number, decimals?: number): number;
```

### Parameters

- `value` (`number`): The number to round.
- `decimals` (`number`, optional): The number of decimal places (non-negative integer). Defaults to `0`.

### Return Type & Value

- **Returns**: `number` — The rounded number.

### JavaScript Example

```js
import { roundTo } from "@codewithraheem/devkit/number";

console.log(roundTo(1.005, 2)); // 1.01
console.log(roundTo(123.456, 1)); // 123.5
console.log(roundTo(123.456, 0)); // 123
console.log(roundTo(-1.005, 2)); // -1.01 (symmetric)
```

### Edge Cases & Errors

- **Infinity**: Preserves `Infinity` and `-Infinity`.
- **Invalid decimals**: Throws `RangeError` if `decimals < 0` or is not an integer.
- **NaN or non-number**: Throws `TypeError` if `value` is `NaN` or invalid.

---

## `randomInt`

### Purpose & Behavior

Generates a pseudo-random integer between `min` and `max` (inclusive). Accepts an injected random generator function for deterministic unit testing.

### Exact TypeScript Signature

```ts
function randomInt(min: number, max: number, random?: () => number): number;
```

### Parameters

- `min` (`number`): The minimum integer (inclusive).
- `max` (`number`): The maximum integer (inclusive).
- `random` (`() => number`, optional): Custom random generator returning a float in `[0, 1)`. Defaults to `Math.random`.

### Return Type & Value

- **Returns**: `number` — An integer in `[min, max]`.

### JavaScript Example

```js
import { randomInt } from "@codewithraheem/devkit/number";

const roll = randomInt(1, 6);
console.log(roll); // Random integer 1, 2, 3, 4, 5, or 6
```

### TypeScript Example (Deterministic Unit Testing)

```ts
import { randomInt } from "@codewithraheem/devkit/number";

// Testing minimum bound deterministically
const atMin = randomInt(1, 10, () => 0);
console.log(atMin); // 1

// Testing maximum bound deterministically
const atMax = randomInt(1, 10, () => 0.999999);
console.log(atMax); // 10
```

### Edge Cases & Errors

- **`min === max`**: Returns `min`.
- **Invalid range**: Throws `RangeError` if `min > max`.
- **Non-integers**: Throws `TypeError` if `min` or `max` are not safe integers, or `random` is not a function.

---

## `sum`

### Purpose & Behavior

Calculates the arithmetic sum of an array of numbers.

### Exact TypeScript Signature

```ts
function sum(values: readonly number[]): number;
```

### Parameters

- `values` (`readonly number[]`): An array of numbers to sum.

### Return Type & Value

- **Returns**: `number` — The total sum.
- **Mutation**: **Does NOT mutate** the input array.

### JavaScript Example

```js
import { sum } from "@codewithraheem/devkit/number";

console.log(sum([1, 2, 3, 4])); // 10
console.log(sum([-5, 5, 10])); // 10
console.log(sum([])); // 0
```

### Edge Cases & Errors

- **Empty array**: Returns `0`.
- **Invalid elements**: Throws `TypeError` if any element in `values` is not a valid number or is `NaN`.
- **Invalid input**: Throws `TypeError` if `values` is not an array.

### Related Utilities

- [`average`](#average)

---

## `average`

### Purpose & Behavior

Calculates the arithmetic mean of an array of numbers.

### Exact TypeScript Signature

```ts
function average(values: readonly number[]): number;
```

### Parameters

- `values` (`readonly number[]`): An array of numbers to average.

### Return Type & Value

- **Returns**: `number` — The mean average. Returns `0` for an empty array.
- **Mutation**: **Does NOT mutate** the input array.

### JavaScript Example

```js
import { average } from "@codewithraheem/devkit/number";

console.log(average([1, 2, 3, 4, 5])); // 3
console.log(average([10, 20])); // 15
console.log(average([])); // 0
```

### Edge Cases & Errors

- **Empty array**: Returns `0`.
- **Invalid elements**: Throws `TypeError` if any element is not a number or is `NaN`.

---

## `isFiniteNumber`

### Purpose & Behavior

A strict TypeScript type guard that checks whether a value is a finite number. Unlike JavaScript's global `isFinite()` function, `isFiniteNumber` does **not** coerce non-numeric values to numbers (e.g. strings like `"42"` or booleans like `true` evaluate to `false`).

### Exact TypeScript Signature

```ts
function isFiniteNumber(value: unknown): value is number;
```

### Parameters

- `value` (`unknown`): The value to test.

### Return Type & Value

- **Returns**: `value is number` — `true` if `value` is a finite number, else `false`.

### Comparison with Global `isFinite`

| Input      | `isFiniteNumber(val)` | Global `isFinite(val)` | Reason                          |
| ---------- | --------------------- | ---------------------- | ------------------------------- |
| `42`       | `true`                | `true`                 | Valid finite number             |
| `3.14`     | `true`                | `true`                 | Valid finite float              |
| `"42"`     | **`false`**           | `true`                 | Global coerced string to number |
| `true`     | **`false`**           | `true`                 | Global coerced boolean to `1`   |
| `null`     | **`false`**           | `true`                 | Global coerced null to `0`      |
| `Infinity` | `false`               | `false`                | Non-finite                      |
| `NaN`      | `false`               | `false`                | Not a number                    |

### TypeScript Example

```ts
import { isFiniteNumber } from "@codewithraheem/devkit/number";

function processReading(input: unknown) {
  if (isFiniteNumber(input)) {
    // TypeScript narrows input to type: number
    console.log(input.toFixed(2));
  } else {
    console.error("Invalid reading");
  }
}
```

---

## Summary Table

| Utility          | Empty Array Output | Throws On NaN     | Precision-Safe             |
| ---------------- | ------------------ | ----------------- | -------------------------- |
| `clamp`          | N/A                | Yes (`TypeError`) | Yes                        |
| `roundTo`        | N/A                | Yes (`TypeError`) | Yes (avoid IEEE 754 drift) |
| `randomInt`      | N/A                | Yes (`TypeError`) | Integer arithmetic         |
| `sum`            | `0`                | Yes (`TypeError`) | Yes                        |
| `average`        | `0`                | Yes (`TypeError`) | Yes                        |
| `isFiniteNumber` | N/A                | Returns `false`   | Strict type guard          |
