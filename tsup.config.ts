import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "array/index": "src/array/index.ts",
    "object/index": "src/object/index.ts",
    "string/index": "src/string/index.ts",
    "number/index": "src/number/index.ts",
    "async/index": "src/async/index.ts",
    "validation/index": "src/validation/index.ts",
    "error/index": "src/error/index.ts",
    "date/index": "src/date/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2022",
  outExtension({ format }) {
    return {
      js: format === "esm" ? ".mjs" : ".cjs",
    };
  },
});
