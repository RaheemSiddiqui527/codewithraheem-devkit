# Date Utilities (`@codewithraheem/devkit/date`)

The Date module provides pure, non-mutating date constructors and calendar calculation utilities that are completely free of third-party dependencies.

```ts
import {
  isValidDate,
  startOfDay,
  endOfDay,
  daysBetween,
} from "@codewithraheem/devkit/date";
```

---

## Table of Contents

- [`isValidDate`](#isvaliddate)
- [`startOfDay`](#startofday)
- [`endOfDay`](#endofday)
- [`daysBetween`](#daysbetween)
- [Daylight Saving Time (DST) & Timezone Semantics](#daylight-saving-time-dst--timezone-semantics)

---

## `isValidDate`

### Purpose & Behavior

A TypeScript type guard that checks whether a value is an authentic JavaScript `Date` instance with a valid timestamp (i.e. `!Number.isNaN(date.getTime())`).

### Exact TypeScript Signature

```ts
function isValidDate(value: unknown): value is Date;
```

### Parameters

- `value` (`unknown`): The value to check.

### Return Type & Value

- **Returns**: `value is Date` — `true` if a valid Date instance, else `false`.

### JavaScript Example

```js
import { isValidDate } from "@codewithraheem/devkit/date";

isValidDate(new Date()); // true
isValidDate(new Date("2025-01-01")); // true

// Invalid Date instances (NaN timestamp)
isValidDate(new Date("invalid-date")); // false

// Non-Date primitives
isValidDate("2025-01-01"); // false
isValidDate(1700000000000); // false
isValidDate(null); // false
```

---

## `startOfDay`

### Purpose & Behavior

Returns a **new `Date` instance** representing midnight (`00:00:00.000`) for the given date in local time.

### Exact TypeScript Signature

```ts
function startOfDay(date: Date): Date;
```

### Parameters

- `date` (`Date`): The source date. Must be a valid Date.

### Return Type & Value

- **Returns**: `Date` — A new Date object set to `00:00:00.000` in local time.
- **Mutation**: **Does NOT mutate** the input `date` object.

### JavaScript Example

```js
import { startOfDay } from "@codewithraheem/devkit/date";

const now = new Date(2025, 5, 15, 14, 30, 45);
const start = startOfDay(now);

console.log(start.getHours()); // 0
console.log(start.getMinutes()); // 0
console.log(start.getSeconds()); // 0
console.log(start.getMilliseconds()); // 0

// Original object is untouched
console.log(now.getHours()); // 14
```

### Edge Cases & Errors

- **Invalid Date**: Throws `TypeError` if `date` is not a valid Date instance.

---

## `endOfDay`

### Purpose & Behavior

Returns a **new `Date` instance** representing the final millisecond of the day (`23:59:59.999`) for the given date in local time.

### Exact TypeScript Signature

```ts
function endOfDay(date: Date): Date;
```

### Parameters

- `date` (`Date`): The source date. Must be a valid Date.

### Return Type & Value

- **Returns**: `Date` — A new Date object set to `23:59:59.999` in local time.
- **Mutation**: **Does NOT mutate** the input `date` object.

### JavaScript Example

```js
import { endOfDay } from "@codewithraheem/devkit/date";

const appointment = new Date(2025, 5, 15, 10, 0, 0);
const end = endOfDay(appointment);

console.log(end.getHours()); // 23
console.log(end.getMinutes()); // 59
console.log(end.getSeconds()); // 59
console.log(end.getMilliseconds()); // 999
```

### Edge Cases & Errors

- **Invalid Date**: Throws `TypeError` if `date` is not a valid Date instance.

---

## `daysBetween`

### Purpose & Behavior

Calculates the signed number of full calendar days between two dates. Returns a positive integer if `end` is after `start`, negative if `end` is before `start`, and `0` if both dates fall on the same local calendar day.

### Exact TypeScript Signature

```ts
function daysBetween(start: Date, end: Date): number;
```

### Parameters

- `start` (`Date`): The start date.
- `end` (`Date`): The end date.

### Return Type & Value

- **Returns**: `number` — The signed count of calendar days between `start` and `end`.
- **Mutation**: **Does NOT mutate** either input date.

### JavaScript Example

```js
import { daysBetween } from "@codewithraheem/devkit/date";

const d1 = new Date(2025, 2, 1); // March 1, 2025
const d2 = new Date(2025, 2, 10); // March 10, 2025

console.log(daysBetween(d1, d2)); // 9
console.log(daysBetween(d2, d1)); // -9
console.log(daysBetween(d1, d1)); // 0
```

### TypeScript Example (Handling Leap Years & Months)

```ts
import { daysBetween } from "@codewithraheem/devkit/date";

// 2024 is a leap year (February has 29 days)
const feb28 = new Date(2024, 1, 28);
const mar1 = new Date(2024, 2, 1);

console.log(daysBetween(feb28, mar1)); // 2 (includes Feb 29!)
```

### Edge Cases & Errors

- **Invalid Date**: Throws `TypeError` if either `start` or `end` is not a valid Date instance.

---

## Daylight Saving Time (DST) & Timezone Semantics

A common bug in date utility libraries is calculating day differences by dividing elapsed milliseconds by `86,400,000` (24 hours):

```js
// INACCURATE approach:
Math.round((end.getTime() - start.getTime()) / 86400000);
```

### Why Naive Millisecond Division Fails

1. **Daylight Saving Time (DST) Shift**: On days when clocks "spring forward", a local calendar day is only **23 hours long** (`82,800,000` ms).
2. **DST "Fall Back"**: On days when clocks "fall back", a local calendar day is **25 hours long** (`90,000,000` ms).
3. If two dates span across a DST transition, naive millisecond division produces fractional quotients (`0.958` or `1.042`) that produce subtle off-by-one errors when combined with timezone offsets.

### How `daysBetween` Solves This

`daysBetween` extracts the local calendar components (`getFullYear()`, `getMonth()`, `getDate()`) of each date and constructs equivalent **UTC midnight timestamps** (`Date.UTC(...)`):

```ts
const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
return Math.round((utcEnd - utcStart) / 86_400_000);
```

Because the UTC timeline has fixed 24-hour days without Daylight Saving Time shifts, this calculation is **100% mathematically exact** across all timezones, leap years, and DST transitions.

---

## Summary Table

| Utility       | Input Mutation | Timezone Behavior                    | Throws On Invalid Date |
| ------------- | -------------- | ------------------------------------ | ---------------------- |
| `isValidDate` | No             | Neutral                              | Returns `false`        |
| `startOfDay`  | No             | Local `00:00:00.000`                 | Yes (`TypeError`)      |
| `endOfDay`    | No             | Local `23:59:59.999`                 | Yes (`TypeError`)      |
| `daysBetween` | No             | Local Calendar Days via UTC Midnight | Yes (`TypeError`)      |
