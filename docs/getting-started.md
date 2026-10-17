# Getting Started with CodeWithRaheem DevKit

Welcome to **CodeWithRaheem DevKit** (`@codewithraheem/devkit`)! This guide covers everything you need to install, configure, and start using the toolkit in your JavaScript and TypeScript applications.

---

## 1. Requirements

Before installing, ensure your environment meets the minimum version requirements:

- **Node.js**: `v18.0.0` or higher (Active LTS and Current versions recommended)
- **TypeScript**: `v5.0.0` or higher (recommended for type checking and declaration resolution)
- **Package Manager**: npm `v9+`, pnpm `v8+`, yarn `v1.22+` / `v3+`, or bun `v1.0+`
- **Browsers**: Modern evergreen browsers supporting ES2022 (Chrome, Edge, Firefox, Safari)

---

## 2. Installation

Install `@codewithraheem/devkit` as a dependency in your project:

### Using npm

```bash
npm install @codewithraheem/devkit
```

### Using pnpm

```bash
pnpm add @codewithraheem/devkit
```

### Using yarn

```bash
yarn add @codewithraheem/devkit
```

### Using bun

```bash
bun add @codewithraheem/devkit
```

---

## 3. Module Resolution & Setup

### TypeScript Configuration (`tsconfig.json`)

To enable optimal type inference with modern subpath exports, configure your `tsconfig.json` with `moduleResolution` set to `Bundler` or `NodeNext`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "skipLibCheck": true
  }
}
```

---

## 4. Import Patterns

`@codewithraheem/devkit` is packaged as a dual-format library providing native ES Modules (`.mjs`) and CommonJS (`.cjs`), with dedicated declaration files (`.d.ts` and `.d.cts`).

### Pattern A: Root Import (Convenient)

Ideal for rapid prototyping, full-stack backends, or applications with modern bundlers configured for tree-shaking:

```ts
import {
  chunk,
  clamp,
  sleep,
  safeJsonParse,
  normalizeError,
} from "@codewithraheem/devkit";
```

### Pattern B: Focused Subpath Imports (Recommended for Frontend & Microservices)

Each module is exposed via a clean, dedicated subpath. Subpath imports guarantee that bundlers only process the specific code you need:

```ts
// Array utilities
import { chunk, unique, partition } from "@codewithraheem/devkit/array";

// Object utilities
import { pick, omit, getPath, deepClone } from "@codewithraheem/devkit/object";

// String utilities
import { capitalize, toCamelCase, slugify } from "@codewithraheem/devkit/string";

// Number utilities
import { clamp, roundTo, sum } from "@codewithraheem/devkit/number";

// Async utilities
import { sleep, retry, withTimeout } from "@codewithraheem/devkit/async";

// Validation utilities
import { safeJsonParse, isEmail, isURL } from "@codewithraheem/devkit/validation";

// Error utilities
import { normalizeError, getErrorMessage } from "@codewithraheem/devkit/error";

// Date utilities
import { daysBetween, startOfDay, endOfDay } from "@codewithraheem/devkit/date";
```

### Pattern C: CommonJS `require`

For legacy Node.js services or CommonJS scripts:

```cjs
// Root require
const { chunk, clamp, sleep } = require("@codewithraheem/devkit");

// Subpath require
const { pick, getPath } = require("@codewithraheem/devkit/object");
const { safeJsonParse } = require("@codewithraheem/devkit/validation");
```

---

## 5. Quick-Start Examples

### Example 1: Batching & Deduplicating Arrays

```ts
import { chunk, unique } from "@codewithraheem/devkit/array";

const userIds = [101, 102, 103, 101, 104, 102, 105];

// Deduplicate preserving original order
const uniqueIds = unique(userIds);
// => [101, 102, 103, 104, 105]

// Batch requests in chunks of 2
const batches = chunk(uniqueIds, 2);
// => [[101, 102], [103, 104], [105]]
```

### Example 2: Safe Object Property Navigation

```ts
import { getPath, pick } from "@codewithraheem/devkit/object";

const response = {
  data: {
    users: [{ id: "u_1", profile: { name: "Raheem", role: "maintainer" } }],
  },
};

// Safe nested lookup with fallback (guarded against prototype pollution)
const name = getPath(response, "data.users[0].profile.name", "Anonymous");
// => "Raheem"

const missingRole = getPath(response, "data.users[1].profile.role", "Guest");
// => "Guest"
```

### Example 3: Resilient Network Retries with Timeout

```ts
import { retry, withTimeout, TimeoutError } from "@codewithraheem/devkit/async";

async function fetchUserData(userId: string) {
  // Retry with exponential backoff: attempts at 0ms, 200ms, 400ms
  return retry(
    async (attempt) => {
      // Enforce a strict 2-second timeout per attempt
      return withTimeout(
        fetch(`https://api.example.com/users/${userId}`).then((r) => r.json()),
        2000
      );
    },
    {
      retries: 3,
      delay: 200,
      backoff: 2,
      shouldRetry: (error) => !(error instanceof TimeoutError),
    }
  );
}
```

### Example 4: Discriminated Union JSON Parsing

```ts
import { safeJsonParse } from "@codewithraheem/devkit/validation";

interface AppConfig {
  apiUrl: string;
  debug: boolean;
}

const rawPayload = '{"apiUrl": "https://api.domain.com", "debug": true}';

const result = safeJsonParse<AppConfig>(rawPayload);

if (result.success) {
  // TypeScript strictly knows result.data is AppConfig
  console.log("Connecting to:", result.data.apiUrl);
} else {
  // TypeScript strictly knows result.error is Error
  console.error("Failed to parse config:", result.error.message);
}
```

---

## 6. Tree-Shaking & Bundle Optimization

`@codewithraheem/devkit` is marked with `"sideEffects": false` in its `package.json`. When using bundlers such as Vite, esbuild, Webpack 5, or Rollup, any unimported utilities are completely eliminated from your production bundle during compilation.

For instance, if your application only imports `clamp` and `roundTo`:

```ts
import { clamp, roundTo } from "@codewithraheem/devkit/number";
```

Your compiled bundle will only include the few bytes required for those two numeric utilities.

---

## 7. Next Steps

Explore the individual module documentation for comprehensive function guides and signatures:

- [Array Utilities](array.md) — `chunk`, `unique`, `groupBy`, `partition`, `compact`, `flatten`, `shuffle`
- [Object Utilities](object.md) — `pick`, `omit`, `isEmpty`, `getPath`, `deepClone`
- [String Utilities](string.md) — `capitalize`, `toCamelCase`, `toKebabCase`, `toSnakeCase`, `truncate`, `slugify`, `isBlank`
- [Number Utilities](number.md) — `clamp`, `roundTo`, `randomInt`, `sum`, `average`, `isFiniteNumber`
- [Async Utilities](async.md) — `sleep`, `retry`, `withTimeout`, `debounce`, `throttle`
- [Validation Utilities](validation.md) — `safeJsonParse`, `isValidJSON`, `isEmail`, `isURL`, `isUUID`, `isPlainObject`
- [Error Utilities](errors.md) — `normalizeError`, `getErrorMessage`, `isErrorLike`
- [Date Utilities](date.md) — `isValidDate`, `startOfDay`, `endOfDay`, `daysBetween`
- [TypeScript Guide](typescript.md) — Generic usage and type inference
- [Browser & Node Compatibility](browser-and-node.md) — Platform support details
- [API Reference Index](api-reference.md) — Alphabetical function index
- [Frequently Asked Questions (FAQ)](faq.md) — Common questions and tips
