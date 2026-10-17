# TypeScript Guide — Generics, Inference & Types

`@codewithraheem/devkit` is designed from the ground up in strict TypeScript. This guide explores the library's type system, generic inference patterns, discriminated unions, and custom type guards.

---

## 1. Automatic Generic Type Inference

All higher-order utilities automatically infer element and key types from your inputs without requiring manual type parameters.

### Array Generics

```ts
import { chunk, groupBy, partition } from "@codewithraheem/devkit/array";

interface Product {
  id: number;
  category: "electronics" | "books";
  price: number;
}

const inventory: Product[] = [
  { id: 1, category: "electronics", price: 100 },
  { id: 2, category: "books", price: 20 },
];

// TypeScript automatically infers Product[][]
const batches = chunk(inventory, 2);

// TypeScript automatically infers Record<"electronics" | "books", Product[]>
const byCategory = groupBy(inventory, (p) => p.category);
```

---

## 2. Type Guard Narrowing with `partition`

`partition` provides an overloaded signature supporting custom TypeScript type guards:

```ts
import { partition } from "@codewithraheem/devkit/array";

const mixedValues: (string | number)[] = ["alpha", 42, "beta", 100];

// Using a custom type guard:
const [strings, numbers] = partition(
  mixedValues,
  (val): val is string => typeof val === "string"
);

// strings is strictly typed as: string[]
// numbers is strictly typed as: number[]
```

---

## 3. Discriminated Unions (`safeJsonParse`)

Instead of throwing exceptions, `safeJsonParse` returns a **discriminated union**:

```ts
type SafeJsonResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: Error };
```

### Pattern Matching on the Discriminator (`success`)

```ts
import { safeJsonParse } from "@codewithraheem/devkit/validation";

interface UserPayload {
  username: string;
  permissions: string[];
}

const result = safeJsonParse<UserPayload>(rawInput);

if (result.success) {
  // TypeScript narrows result.data to UserPayload
  console.log("Logged in as:", result.data.username);
  console.log("Permissions:", result.data.permissions.join(", "));
} else {
  // TypeScript narrows result.error to Error
  console.error("Syntax error:", result.error.message);
}
```

> **Important**: The type parameter `T` in `safeJsonParse<T>` is a developer compile-time assertion. It does **not** validate the shape of external untrusted data at runtime. If you need runtime schema validation, pair `safeJsonParse` with a validator (such as Zod, Valibot, or custom type guards).

---

## 4. Built-in Type Guards

The toolkit includes strict type guards that narrow `unknown` values:

### `isFiniteNumber`

```ts
import { isFiniteNumber } from "@codewithraheem/devkit/number";

function calculate(value: unknown) {
  if (isFiniteNumber(value)) {
    // value is narrowed to: number
    return value * 2;
  }
  return 0;
}
```

### `isPlainObject`

```ts
import { isPlainObject } from "@codewithraheem/devkit/validation";

function inspect(value: unknown) {
  if (isPlainObject(value)) {
    // value is narrowed to: Record<PropertyKey, unknown>
    console.log("Object keys:", Object.keys(value));
  }
}
```

### `isValidDate`

```ts
import { isValidDate } from "@codewithraheem/devkit/date";

function formatTimestamp(value: unknown): string {
  if (isValidDate(value)) {
    // value is narrowed to: Date
    return value.toISOString();
  }
  return "N/A";
}
```

### `isErrorLike`

```ts
import { isErrorLike, type ErrorLike } from "@codewithraheem/devkit/error";

function logError(value: unknown) {
  if (isErrorLike(value)) {
    // value is narrowed to: ErrorLike ({ name: string; message: string; ... })
    console.warn(`${value.name}: ${value.message}`);
  }
}
```

---

## 5. Type-Safe Object Filtering (`pick` & `omit`)

`pick` and `omit` preserve key relations using `keyof T`:

```ts
import { pick, omit } from "@codewithraheem/devkit/object";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  privateNotes: string;
}

const profile: UserProfile = {
  id: "u_1",
  name: "Raheem",
  email: "raheem@example.com",
  privateNotes: "Internal note",
};

// Result is Pick<UserProfile, "id" | "name">
const publicSummary = pick(profile, ["id", "name"]);

// Result is Omit<UserProfile, "privateNotes">
const sanitized = omit(profile, ["privateNotes"]);
```

---

## 6. TypeScript Configuration Guidelines

For full support of subpath declarations (`.d.ts` and `.d.cts`), we recommend the following configuration in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "skipLibCheck": true
  }
}
```
