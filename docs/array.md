# Array Utilities (`@codewithraheem/devkit/array`)

The Array module delivers pure, zero-dependency helper functions for manipulating, transforming, and partitioning arrays.

```ts
import {
  chunk,
  unique,
  groupBy,
  partition,
  compact,
  flatten,
  shuffle,
} from "@codewithraheem/devkit/array";
```

---

## Table of Contents

- [`chunk`](#chunk)
- [`unique`](#unique)
- [`groupBy`](#groupBy)
- [`partition`](#partition)
- [`compact`](#compact)
- [`flatten`](#flatten)
- [`shuffle`](#shuffle)

---

## `chunk`

### Purpose & Behavior

Splits an array into an array of smaller arrays (chunks) where each subarray has a maximum length of `size`. The final chunk contains the remaining elements if the array cannot be split evenly.

### Exact TypeScript Signature

```ts
function chunk<T>(array: readonly T[], size: number): T[][];
```

### Parameters

- `array` (`readonly T[]`): The source array to chunk.
- `size` (`number`): The maximum size of each chunk. Must be a positive integer greater than `0`.

### Return Type & Value

- **Returns**: `T[][]` — A new array containing the chunked subarrays.
- **Mutation**: **Does NOT mutate** the input array.

### JavaScript Example

```js
import { chunk } from "@codewithraheem/devkit/array";

const items = ["a", "b", "c", "d", "e"];
const chunks = chunk(items, 2);
console.log(chunks);
// Output: [["a", "b"], ["c", "d"], ["e"]]
```

### TypeScript Example

```ts
import { chunk } from "@codewithraheem/devkit/array";

interface Product {
  id: number;
  name: string;
}

const products: Product[] = [
  { id: 1, name: "Keyboard" },
  { id: 2, name: "Mouse" },
  { id: 3, name: "Monitor" },
];

const batches: Product[][] = chunk(products, 2);
// batches: [[{ id: 1, ... }, { id: 2, ... }], [{ id: 3, ... }]]
```

### Edge Cases & Errors

- **Empty array**: `chunk([], 3)` returns `[]`.
- **Size larger than array length**: `chunk([1, 2], 10)` returns `[[1, 2]]`.
- **Non-array input**: Throws `TypeError` if `array` is null, undefined, or not an array.
- **Invalid size**: Throws `RangeError` if `size` is `<= 0`, floating point, or not a number.

### Related Utilities

- [`partition`](#partition) — For splitting an array by a boolean condition.

---

## `unique`

### Purpose & Behavior

Creates a duplicate-free version of an array, keeping the first occurrence of each element.

### Exact TypeScript Signature

```ts
function unique<T>(array: readonly T[]): T[];
```

### Parameters

- `array` (`readonly T[]`): The array to deduplicate.

### Return Type & Value

- **Returns**: `T[]` — A new array containing unique elements in the order they first appeared.
- **Mutation**: **Does NOT mutate** the input array.

### JavaScript Example

```js
import { unique } from "@codewithraheem/devkit/array";

const tags = ["javascript", "typescript", "javascript", "react"];
console.log(unique(tags));
// Output: ["javascript", "typescript", "react"]
```

### TypeScript Example

```ts
import { unique } from "@codewithraheem/devkit/array";

const mixedNumbers: number[] = [1, 2, 2, 3, 1, 4];
const distinct: number[] = unique(mixedNumbers);
// distinct: [1, 2, 3, 4]
```

### Edge Cases & Errors

- **`NaN` values**: Accurately deduplicated using ECMAScript `Set` semantics (`NaN === NaN`). E.g., `unique([NaN, 1, NaN])` returns `[NaN, 1]`.
- **Object references**: Compares objects by reference. Two identical object literals `{ a: 1 }` are distinct references and are preserved.
- **Empty array**: `unique([])` returns `[]`.
- **Invalid input**: Throws `TypeError` if `array` is not an array.

### Related Utilities

- [`compact`](#compact) — For removing falsy elements.

---

## `groupBy`

### Purpose & Behavior

Groups elements of an array into an object dictionary based on the key returned by a key-generating function.

### Exact TypeScript Signature

```ts
function groupBy<T, K extends PropertyKey>(
  array: readonly T[],
  keyFn: (item: T, index: number) => K
): Record<K, T[]>;
```

### Parameters

- `array` (`readonly T[]`): The source array.
- `keyFn` (`(item: T, index: number) => K`): Callback function returning the grouping key.

### Return Type & Value

- **Returns**: `Record<K, T[]>` — An object where keys map to arrays of matching elements.
- **Mutation**: **Does NOT mutate** the input array.

### JavaScript Example

```js
import { groupBy } from "@codewithraheem/devkit/array";

const words = ["one", "two", "three", "four", "five"];
const byLength = groupBy(words, (w) => w.length);
console.log(byLength);
// Output: { 3: ["one", "two"], 4: ["four", "five"], 5: ["three"] }
```

### TypeScript Example

```ts
import { groupBy } from "@codewithraheem/devkit/array";

interface Task {
  title: string;
  priority: "low" | "medium" | "high";
}

const tasks: Task[] = [
  { title: "Write docs", priority: "high" },
  { title: "Refactor CSS", priority: "low" },
  { title: "Fix bug", priority: "high" },
];

const grouped = groupBy(tasks, (t) => t.priority);
// grouped: Record<"low" | "medium" | "high", Task[]>
```

### Edge Cases & Errors

- **Empty array**: Returns `{}`.
- **Preserved order**: Elements within each group preserve their relative order from the input array.
- **Invalid arguments**: Throws `TypeError` if `array` is not an array or `keyFn` is not a function.

### Related Utilities

- [`partition`](#partition) — For splitting into two groups based on a predicate.

---

## `partition`

### Purpose & Behavior

Splits an array into a tuple of two arrays: the first containing elements that satisfy the predicate, and the second containing elements that do not. Supports TypeScript type guards to narrow the truthy partition.

### Exact TypeScript Signatures

```ts
function partition<T, S extends T>(
  array: readonly T[],
  predicate: (item: T, index: number) => item is S
): [S[], Exclude<T, S>[]];

function partition<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean
): [T[], T[]];
```

### Parameters

- `array` (`readonly T[]`): The array to partition.
- `predicate` (`(item: T, index: number) => boolean`): The predicate function evaluated for each item.

### Return Type & Value

- **Returns**: `[T[], T[]]` — A tuple `[truthyElements, falsyElements]`.
- **Mutation**: **Does NOT mutate** the input array.

### JavaScript Example

```js
import { partition } from "@codewithraheem/devkit/array";

const numbers = [1, 2, 3, 4, 5, 6];
const [evens, odds] = partition(numbers, (n) => n % 2 === 0);
console.log(evens); // [2, 4, 6]
console.log(odds); // [1, 3, 5]
```

### TypeScript Example (With Type Guard)

```ts
import { partition } from "@codewithraheem/devkit/array";

const mixed: (string | number)[] = ["alpha", 10, "beta", 20];

const [strings, numbers] = partition(
  mixed,
  (val): val is string => typeof val === "string"
);
// strings: string[]
// numbers: number[]
```

### Edge Cases & Errors

- **Empty array**: Returns `[[], []]`.
- **All match truthy**: Returns `[[...elements], []]`.
- **All match falsy**: Returns `[[], [...elements]]`.
- **Invalid arguments**: Throws `TypeError` if `array` is not an array or `predicate` is not a function.

---

## `compact`

### Purpose & Behavior

Filters out all falsy values (`false`, `null`, `0`, `""`, `undefined`, and `NaN`) from an array.

### Exact TypeScript Signature

```ts
type Falsy = false | "" | 0 | 0n | null | undefined;

function compact<T>(array: readonly (T | Falsy)[]): T[];
```

### Parameters

- `array` (`readonly (T | Falsy)[]`): The array to compact.

### Return Type & Value

- **Returns**: `T[]` — A new array containing only truthy elements.
- **Mutation**: **Does NOT mutate** the input array.

### JavaScript Example

```js
import { compact } from "@codewithraheem/devkit/array";

const dirty = [0, "hello", false, "", 42, null, undefined, NaN];
console.log(compact(dirty));
// Output: ["hello", 42]
```

### TypeScript Example

```ts
import { compact } from "@codewithraheem/devkit/array";

const optionalStrings: (string | null | undefined)[] = [
  "item1",
  null,
  "item2",
  undefined,
];
const clean: string[] = compact(optionalStrings);
// clean: ["item1", "item2"]
```

### Edge Cases & Errors

- **Empty array**: Returns `[]`.
- **Truthy containers**: Empty objects `{}` and arrays `[]` are truthy in JavaScript and are preserved.
- **Invalid input**: Throws `TypeError` if `array` is not an array.

---

## `flatten`

### Purpose & Behavior

Flattens nested arrays a single level deep or up to a specified maximum depth.

### Exact TypeScript Signature

```ts
function flatten<T = unknown>(array: readonly unknown[], depth?: number): T[];
```

### Parameters

- `array` (`readonly unknown[]`): The array to flatten.
- `depth` (`number`, optional): The maximum depth to recursively flatten. Defaults to `1`.

### Return Type & Value

- **Returns**: `T[]` — A new flattened array.
- **Mutation**: **Does NOT mutate** the input array.

### JavaScript Example

```js
import { flatten } from "@codewithraheem/devkit/array";

const deeplyNested = [1, [2, [3, [4]], 5]];

console.log(flatten(deeplyNested));
// Output (depth 1): [1, 2, [3, [4]], 5]

console.log(flatten(deeplyNested, 2));
// Output (depth 2): [1, 2, 3, [4], 5]

console.log(flatten(deeplyNested, Infinity));
// Output (full): [1, 2, 3, 4, 5]
```

### TypeScript Example

```ts
import { flatten } from "@codewithraheem/devkit/array";

const matrix: number[][] = [[1, 2], [3, 4], [5]];
const flat: number[] = flatten<number>(matrix);
// flat: [1, 2, 3, 4, 5]
```

### Edge Cases & Errors

- **Depth 0**: Returns a shallow copy of the original array.
- **Empty array**: Returns `[]`.
- **Invalid depth**: Throws `RangeError` if `depth < 0` or is `NaN`.
- **Invalid input**: Throws `TypeError` if `array` is not an array.

---

## `shuffle`

### Purpose & Behavior

Generates a new array with elements randomized in place using the Fisher-Yates (Knuth) algorithm. Includes an injectable random generator for deterministic testing.

### Exact TypeScript Signature

```ts
function shuffle<T>(array: readonly T[], random?: () => number): T[];
```

### Parameters

- `array` (`readonly T[]`): The array to shuffle.
- `random` (`() => number`, optional): A custom random generator returning a floating point number in `[0, 1)`. Defaults to `Math.random`.

### Return Type & Value

- **Returns**: `T[]` — A new array containing the shuffled elements.
- **Mutation**: **Does NOT mutate** the input array.

### JavaScript Example

```js
import { shuffle } from "@codewithraheem/devkit/array";

const deck = [1, 2, 3, 4, 5];
const shuffled = shuffle(deck);
console.log(shuffled);
// Output: e.g. [3, 1, 5, 2, 4]
```

### TypeScript Example (Deterministic Testing)

```ts
import { shuffle } from "@codewithraheem/devkit/array";

// Injected pseudo-random generator for unit testing
const deterministic = () => 0.42;

const items: string[] = ["a", "b", "c", "d"];
const result1 = shuffle(items, deterministic);
const result2 = shuffle(items, deterministic);

console.log(result1); // Deterministic output
console.log(result1.join("") === result2.join("")); // true
```

### Edge Cases & Errors

- **Single element or empty array**: Returns a new shallow copy (`[]` or `[elem]`).
- **Invalid arguments**: Throws `TypeError` if `array` is not an array or `random` is not a function.

---

## Summary Table

| Utility     | Input Mutation | Empty Input Output | Error Cases                                         |
| ----------- | -------------- | ------------------ | --------------------------------------------------- |
| `chunk`     | No             | `[]`               | `TypeError` on non-array; `RangeError` on size <= 0 |
| `unique`    | No             | `[]`               | `TypeError` on non-array                            |
| `groupBy`   | No             | `{}`               | `TypeError` on non-array or non-function `keyFn`    |
| `partition` | No             | `[[], []]`         | `TypeError` on non-array or non-function predicate  |
| `compact`   | No             | `[]`               | `TypeError` on non-array                            |
| `flatten`   | No             | `[]`               | `TypeError` on non-array; `RangeError` on depth < 0 |
| `shuffle`   | No             | `[]`               | `TypeError` on non-array or non-function `random`   |
