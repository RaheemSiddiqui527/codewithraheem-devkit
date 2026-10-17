# Browser & Node.js Compatibility

`@codewithraheem/devkit` is designed to be fully isomorphic and runtime-neutral, functioning identically across backend server runtimes, client-side browsers, and modern edge environments.

---

## 1. Verified Runtime Matrix

| Environment       | Supported Versions              | Verification Status                                        | Notes                                    |
| ----------------- | ------------------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| **Node.js**       | `>= 18.0.0`                     | Verified on `v18.x`, `v20.x`, `v22.x`, `v24.x`             | Native ESM and CommonJS support          |
| **Browsers**      | Chrome, Edge, Safari, Firefox   | Verified (ES2022 baseline)                                 | Zero DOM/Window hard requirements        |
| **Bun**           | `>= 1.0.0`                      | Verified                                                   | Full compatibility                       |
| **Deno**          | `>= 1.30.0`                     | Verified via npm specifiers (`npm:@codewithraheem/devkit`) | Full compatibility                       |
| **Edge Runtimes** | Cloudflare Workers, Vercel Edge | Verified                                                   | Free of Node.js-specific native binaries |

---

## 2. Why CodeWithRaheem DevKit is Truly Isomorphic

Many utility packages claim browser and Node compatibility but fail in practice due to hidden dependencies on Node-only modules (such as `crypto`, `fs`, `path`, or `process`).

`@codewithraheem/devkit` achieves pure runtime neutrality by adhering to universal web standard standards:

1. **Standard WHATWG URL**: `isURL` uses the global `URL` constructor available in all modern browsers, Node.js 18+, Bun, and Deno.
2. **Standard AbortController & AbortSignal**: Asynchronous cancellation in `sleep`, `retry`, and `withTimeout` uses web-standard `AbortSignal`.
3. **Standard Timers**: Uses standard `setTimeout` and `clearTimeout`.
4. **Standard Math & Unicode**: Case conversion, rounding, and slugification use standard ECMAScript Unicode normalization (`normalize("NFD")`) and integer arithmetic.
5. **No Node-Only Built-ins**: The package does not import `fs`, `path`, `os`, `child_process`, or `buffer`.

---

## 3. Bundler & Framework Support

The package has been verified to work out-of-the-box with all major modern bundlers and meta-frameworks without special plugins or polyfills:

- **Next.js** (App Router & Pages Router)
- **Vite** (React, Vue, Svelte, Vanilla)
- **Remix**
- **Astro**
- **Nuxt**
- **Webpack 5**
- **esbuild**
- **Rollup**

### Tree-Shaking Configuration

In `package.json`:

```json
"sideEffects": false
```

Because the library is pure and free of module-level side-effects, modern bundlers automatically shake out any functions you do not import.

---

## 4. Subpath Resolution in Different Environments

### In Node.js (ESM)

```js
import { chunk } from "@codewithraheem/devkit/array";
```

### In Node.js (CommonJS)

```js
const { chunk } = require("@codewithraheem/devkit/array");
```

### In Deno

```ts
import { chunk } from "npm:@codewithraheem/devkit/array";
```

### In Browser via CDN (e.g. esm.sh)

```html
<script type="module">
  import { clamp } from "https://esm.sh/@codewithraheem/devkit/number";
  console.log(clamp(15, 0, 10)); // 10
</script>
```
