# Frequently Asked Questions (FAQ)

Answers to common questions regarding installation, imports, TypeScript configuration, and architectural design choices in `@codewithraheem/devkit`.

---

## 1. General & Architecture

### Why use `@codewithraheem/devkit` instead of Lodash or Ramda?

- **Zero Dependencies**: `@codewithraheem/devkit` has **zero runtime dependencies**, eliminating transitive vulnerability exposure and supply-chain risk.
- **Modern TypeScript-First**: Engineered natively for TypeScript with discriminated unions, type guards, and precise generic inference.
- **Subpath Tree-Shaking**: Clean modular entry points (`@codewithraheem/devkit/array`, etc.) ensure only the code you actually use ends up in your production bundle.
- **Proactive Security**: Prototype-pollution guards and ReDoS-safe regexes are built-in from the ground up.

### Does the package support CommonJS?

**Yes.** `@codewithraheem/devkit` is published with dual builds. You can import using standard ES Modules (`import`) or require using CommonJS (`require`).

```cjs
const { chunk, sleep } = require("@codewithraheem/devkit");
const { pick } = require("@codewithraheem/devkit/object");
```

---

## 2. Imports & Bundlers

### How do subpath imports work in Next.js, Vite, and Webpack?

Modern Node.js and bundlers resolve subpath imports through the `"exports"` field in `package.json`. You can import directly from subpaths:

```ts
import { chunk } from "@codewithraheem/devkit/array";
import { pick } from "@codewithraheem/devkit/object";
```

### What if TypeScript cannot find module `@codewithraheem/devkit/array`?

Ensure your `tsconfig.json` has `moduleResolution` configured to `NodeNext` or `Bundler`:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

---

## 3. Function Behavior & Edge Cases

### Why does `safeJsonParse` return `{ success, data }` instead of throwing?

Traditional `JSON.parse` requires surrounding every call with `try...catch` blocks, which interrupts control flow and defaults caught errors to `unknown`.

`safeJsonParse` uses a **discriminated union**:

```ts
const res = safeJsonParse(jsonString);
if (res.success) {
  console.log(res.data);
} else {
  console.error(res.error.message);
}
```

This enables clean, functional error handling without exceptions.

### Can `withTimeout` cancel an active `fetch` request?

In JavaScript, native Promises are eager and non-cancellable by default. While `withTimeout` rejects immediately and clears its internal timer upon expiration, the background promise will continue running unless you pass an `AbortSignal`:

```ts
const controller = new AbortController();
const promise = fetch("https://api.example.com", { signal: controller.signal });

try {
  await withTimeout(promise, 3000, { signal: controller.signal });
} catch (err) {
  controller.abort(); // Cooperatively abort the underlying HTTP request
}
```

### How does `daysBetween` handle Daylight Saving Time (DST) shifts?

Dividing elapsed milliseconds by `86,400,000` (24 hours) fails on DST transition days (when days are 23 or 25 hours long). `daysBetween` extracts local calendar dates (`getFullYear()`, `getMonth()`, `getDate()`) and computes differences using UTC midnight timestamps (`Date.UTC`), guaranteeing 100% accurate calendar day calculations without DST drift.

### Why is `isFiniteNumber` preferred over JavaScript's global `isFinite`?

Global `isFinite` coerces non-numeric types to numbers:

```js
isFinite("42"); // true (string coerced to number!)
isFinite(true); // true (boolean coerced to 1!)
isFinite(null); // true (null coerced to 0!)
```

`isFiniteNumber` performs a strict check (`typeof value === "number" && Number.isFinite(value)`), rejecting strings, booleans, and null.

### How is prototype pollution prevented?

Object manipulation functions (`pick`, `omit`, `getPath`, `deepClone`) maintain a forbidden key blacklist (`__proto__`, `constructor`, `prototype`). They never traverse or assign to prototype properties, protecting applications against object injection attacks.
