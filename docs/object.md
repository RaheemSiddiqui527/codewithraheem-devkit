# Object Utilities (`@codewithraheem/devkit/object`)

The Object module provides secure, type-safe utilities for inspecting, picking, omitting, querying, and cloning JavaScript objects.

All utilities in this module include proactive defenses against **Prototype Pollution** attacks (`__proto__`, `constructor`, and `prototype` injection).

```ts
import { pick, omit, isEmpty, getPath, deepClone } from "@codewithraheem/devkit/object";
```

---

## Table of Contents

- [`pick`](#pick)
- [`omit`](#omit)
- [`isEmpty`](#isEmpty)
- [`getPath`](#getPath)
- [`deepClone`](#deepClone)

---

## `pick`

### Purpose & Behavior

Creates a new object composed of only the specified own enumerable properties of the source object. Unmatched keys or prototype pollution keys (`__proto__`, `constructor`, `prototype`) are safely ignored.

### Exact TypeScript Signature

```ts
function pick<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Pick<T, K>;
```

### Parameters

- `object` (`T`): The source object.
- `keys` (`readonly K[]`): An array of property keys to pick.

### Return Type & Value

- **Returns**: `Pick<T, K>` — A new object containing only the chosen properties.
- **Mutation**: **Does NOT mutate** the input object.

### JavaScript Example

```js
import { pick } from "@codewithraheem/devkit/object";

const user = { id: 1, name: "Raheem", email: "raheem@example.com", secret: "hash123" };
const publicProfile = pick(user, ["id", "name", "email"]);

console.log(publicProfile);
// Output: { id: 1, name: "Raheem", email: "raheem@example.com" }
```

### TypeScript Example

```ts
import { pick } from "@codewithraheem/devkit/object";

interface Account {
  id: string;
  username: string;
  apiKey: string;
}

const account: Account = { id: "a_1", username: "dev", apiKey: "secret" };
const safeAccount: Pick<Account, "id" | "username"> = pick(account, ["id", "username"]);
```

### Edge Cases & Errors

- **Prototype pollution keys**: Attempting to pick `__proto__`, `constructor`, or `prototype` is silently ignored and never assigned to the result.
- **Missing keys**: If a specified key does not exist on `object`, it is omitted without error.
- **Invalid arguments**: Throws `TypeError` if `object` is null, undefined, or not an object, or if `keys` is not an array.

### Related Utilities

- [`omit`](#omit) — For excluding specific properties.

---

## `omit`

### Purpose & Behavior

Creates a new object composed of the own enumerable properties of the source object, excluding the specified keys.

### Exact TypeScript Signature

```ts
function omit<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Omit<T, K>;
```

### Parameters

- `object` (`T`): The source object.
- `keys` (`readonly K[]`): An array of property keys to omit.

### Return Type & Value

- **Returns**: `Omit<T, K>` — A new object excluding the specified properties.
- **Mutation**: **Does NOT mutate** the input object.

### JavaScript Example

```js
import { omit } from "@codewithraheem/devkit/object";

const record = { id: 10, title: "Post", passwordHash: "secret" };
const safeRecord = omit(record, ["passwordHash"]);

console.log(safeRecord);
// Output: { id: 10, title: "Post" }
```

### TypeScript Example

```ts
import { omit } from "@codewithraheem/devkit/object";

interface Session {
  token: string;
  userId: string;
  internalFlag: boolean;
}

const session: Session = { token: "xyz", userId: "u_1", internalFlag: true };
const clientSession: Omit<Session, "internalFlag"> = omit(session, ["internalFlag"]);
```

### Edge Cases & Errors

- **Prototype keys**: Automatically ignores prototype pollution vectors.
- **Non-existent keys**: If keys to omit do not exist, a copy of the object is returned.
- **Invalid input**: Throws `TypeError` if `object` is null or not an object, or if `keys` is not an array.

---

## `isEmpty`

### Purpose & Behavior

Checks whether a value is empty. Determines emptiness across primitives, strings, arrays, Maps, Sets, TypedArrays, and objects.

### Exact TypeScript Signature

```ts
function isEmpty(value: unknown): boolean;
```

### Emptiness Rules

- `null` and `undefined` are empty (`true`).
- Primitives without length/size (`boolean`, `number`, `bigint`, `symbol`) are empty (`true`).
- Strings and arrays with `length === 0` are empty (`true`).
- Maps and Sets with `size === 0` are empty (`true`).
- TypedArrays and ArrayBuffers with `byteLength === 0` are empty (`true`).
- Plain objects with no own enumerable string keys are empty (`true`).
- All other values return `false`.

### JavaScript Example

```js
import { isEmpty } from "@codewithraheem/devkit/object";

isEmpty(null); // true
isEmpty(""); // true
isEmpty([]); // true
isEmpty({}); // true
isEmpty(new Set()); // true
isEmpty(new Map()); // true

isEmpty("hello"); // false
isEmpty([1, 2]); // false
isEmpty({ a: 1 }); // false
isEmpty(new Set([1])); // false
```

### Edge Cases & Errors

- Does not throw. Safely inspects any unknown JavaScript value.
- Non-empty whitespace string `"   "` has `length > 0`, so `isEmpty("   ")` is `false`. (Use `isBlank` from the String module if you want to consider whitespace-only strings empty).

### Related Utilities

- [`isBlank`](string.md#isblank) — For detecting empty or whitespace-only strings.

---

## `getPath`

### Purpose & Behavior

Safely retrieves the value at a nested path of an object using either dot notation (`"user.profile.name"`), bracket notation (`"users[0].name"`), or an array of keys (`["users", 0, "name"]`). If the resolved value is `undefined` or cannot be reached, the specified `fallback` is returned.

Includes built-in prototype pollution protection: any attempt to traverse into `__proto__` or `prototype` immediately returns `fallback`.

### Exact TypeScript Signature

```ts
function getPath<T = unknown>(
  object: unknown,
  path: string | readonly (string | number)[],
  fallback?: T
): T;
```

### Parameters

- `object` (`unknown`): The object to query.
- `path` (`string | readonly (string | number)[]`): The path to retrieve.
- `fallback` (`T`, optional): The fallback value returned when undefined or unreachable.

### Return Type & Value

- **Returns**: `T` — The resolved property value, or `fallback`.
- **Mutation**: **Does NOT mutate** the input object.

### JavaScript Example

```js
import { getPath } from "@codewithraheem/devkit/object";

const database = {
  teams: [{ name: "DevOps", leader: { name: "Raheem", tags: ["admin", "lead"] } }],
};

// Dot & bracket string notation
console.log(getPath(database, "teams[0].leader.name"));
// Output: "Raheem"

console.log(getPath(database, "teams[0].leader.tags[1]"));
// Output: "lead"

// Fallback on missing property
console.log(getPath(database, "teams[0].leader.age", 30));
// Output: 30

// Array notation
console.log(getPath(database, ["teams", 0, "leader", "name"]));
// Output: "Raheem"
```

### TypeScript Example

```ts
import { getPath } from "@codewithraheem/devkit/object";

interface Config {
  settings?: {
    timeoutMs?: number;
  };
}

const config: Config = {};
const timeout: number = getPath<number>(config, "settings.timeoutMs", 5000);
// timeout: 5000
```

### Edge Cases & Errors

- **Null or undefined object**: Returns `fallback`.
- **Traversing primitive**: If a path tries to access a property on a number or boolean, returns `fallback`.
- **Prototype attack**: Path `"__proto__.polluted"` or `["__proto__", "x"]` returns `fallback` immediately.
- **Empty path**: Returns `fallback`.

---

## `deepClone`

### Purpose & Behavior

Creates a deep copy of a value. Handles recursive structures, circular references, and diverse JavaScript built-ins without data loss or memory leaks.

### Supported Types

- **Primitives**: `string`, `number`, `boolean`, `bigint`, `null`, `undefined`, `symbol`.
- **Plain Objects**: Preserves own enumerable string and symbol keys. Prototype is cleanly preserved.
- **Arrays**: Recursively cloned.
- **`Date`**: Cloned via `new Date(value.getTime())`.
- **`RegExp`**: Cloned via `new RegExp(value.source, value.flags)`.
- **`Map` & `Set`**: Keys and values are recursively deep-cloned.
- **`ArrayBuffer` & TypedArrays**: `Uint8Array`, `Int32Array`, `Float64Array`, `DataView`, etc., are allocated to fresh buffers.

### By-Reference Types (Documented Limits)

- **Functions, Promises, WeakMap, WeakSet, Error instances**: Copied by reference. (Functions and Promises cannot be cloned meaningfully in standard ECMAScript without side effects).

### Exact TypeScript Signature

```ts
function deepClone<T>(value: T): T;
```

### Parameters

- `value` (`T`): The value to clone.

### Return Type & Value

- **Returns**: `T` — The deep-cloned copy.
- **Mutation**: **Does NOT mutate** the input value.

### JavaScript Example

```js
import { deepClone } from "@codewithraheem/devkit/object";

const user = {
  name: "Raheem",
  preferences: { theme: "dark", notifications: true },
  createdAt: new Date(),
};

const copy = deepClone(user);
copy.preferences.theme = "light";

console.log(user.preferences.theme); // "dark" (unmutated!)
console.log(copy.preferences.theme); // "light"
```

### TypeScript Example (Circular References)

```ts
import { deepClone } from "@codewithraheem/devkit/object";

interface Node {
  id: string;
  next?: Node;
}

const first: Node = { id: "node_1" };
first.next = first; // Circular reference!

const cloned = deepClone(first);
console.log(cloned.id); // "node_1"
console.log(cloned.next === cloned); // true (circular reference accurately preserved!)
console.log(cloned !== first); // true (completely distinct memory instance)
```

### Edge Cases & Errors

- **Circular references**: Handled cleanly using an internal `WeakMap`. Does not cause stack overflows.
- **Prototype pollution**: Skips assigning `__proto__`, `constructor`, or `prototype` as own properties.

---

## Summary Table

| Utility     | Input Mutation | Prototype-Safe                       | Circular-Safe       |
| ----------- | -------------- | ------------------------------------ | ------------------- |
| `pick`      | No             | Yes                                  | N/A                 |
| `omit`      | No             | Yes                                  | N/A                 |
| `isEmpty`   | No             | Yes                                  | Yes                 |
| `getPath`   | No             | Yes (blocks `__proto__`/`prototype`) | Yes                 |
| `deepClone` | No             | Yes (cleans prototype pollution)     | Yes (via `WeakMap`) |
