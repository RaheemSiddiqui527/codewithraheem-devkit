# Architecture & Design Decisions

This document outlines the architectural philosophy, packaging decisions, and design principles behind `@codewithraheem/devkit`.

---

## 1. Zero Runtime Dependencies

One of the foundational tenets of `@codewithraheem/devkit` is that it ships with **zero production runtime dependencies**.

- Eliminates transitive dependency security risks.
- Reduces bundle sizes to the absolute minimum.
- Guarantees immunity to supply-chain package hijacking or breaking upstream changes.

---

## 2. Dual ESM & CommonJS Architecture

Modern JavaScript applications run across heterogeneous environments (ESM in modern browsers, Vite, Next.js, Cloudflare Workers; CJS in legacy Node backends and tools).

`@codewithraheem/devkit` uses `tsup` (powered by esbuild) to produce:

- Native ESM bundles (`.mjs`) with standard `import`/`export`.
- CommonJS bundles (`.cjs`) with `module.exports`.
- Dedicated TypeScript declaration bundles (`.d.ts` for ESM and `.d.cts` for CJS).

### Package Exports Mapping

In `package.json`:

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.mjs",
    "require": "./dist/index.cjs"
  },
  "./array": {
    "types": "./dist/array/index.d.ts",
    "import": "./dist/array/index.mjs",
    "require": "./dist/array/index.cjs"
  }
}
```

This prevents consumers from importing private internal build files and guarantees proper tree-shaking in modern bundlers.

---

## 3. Security First: Prototype Pollution Defense

JavaScript prototype pollution attacks occur when untrusted user input is allowed to write to properties such as `__proto__`, `constructor`, or `prototype`.

In `@codewithraheem/devkit`:

- `pick` and `omit` filter out forbidden keys.
- `getPath` prevents traversing prototype keys.
- `deepClone` skips cloning into prototype properties.

---

## 4. Date & DST Correctness

A common pitfall in utility libraries is assuming calendar days are always 24 hours (86,400,000 ms). Due to Daylight Saving Time shifts:

- A spring forward day is 23 hours.
- A fall backward day is 25 hours.

Naively dividing elapsed milliseconds by `86_400_000` causes off-by-one errors.
`daysBetween` solves this by normalizing calendar components (`getFullYear()`, `getMonth()`, `getDate()`) to UTC midnight (`Date.UTC(...)`), guaranteeing integer arithmetic without DST drift.
