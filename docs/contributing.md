# Contributing Guide

Thank you for contributing to **CodeWithRaheem DevKit**! This guide details our development standards, local environment setup, testing requirements, and pull request review process.

---

## 1. Development Philosophy

1. **Zero Runtime Dependencies**: The core package must have zero external production dependencies. Everything is implemented using modern standard ECMAScript.
2. **Pure Functions**: Utilities should be pure and free of side-effects unless explicitly part of their purpose (e.g. `sleep`). Input arguments must **never** be mutated.
3. **Strict Type Safety**: All functions must have precise, generic TypeScript declarations. Never use `any` in public APIs.
4. **Security by Default**: Proactively defend against prototype pollution, ReDoS vulnerabilities, and memory leaks.

---

## 2. Local Environment Setup

### Prerequisites

- **Node.js**: `>= 18.0.0`
- **npm**: `>= 9.0.0`
- **Git**

### Installation

```bash
git clone https://github.com/RaheemSiddiqui527/codewithraheem-devkit.git
cd codewithraheem-devkit
npm install
```

---

## 3. Development Commands

| Command                 | Purpose                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `npm test`              | Runs the test suite via Vitest                                                                 |
| `npm run test:watch`    | Runs Vitest in interactive watch mode during development                                       |
| `npm run test:coverage` | Runs tests and verifies minimum coverage thresholds (95% lines/statements/funcs, 92% branches) |
| `npm run typecheck`     | Checks TypeScript compilation without emitting files                                           |
| `npm run lint`          | Runs ESLint 9 checks                                                                           |
| `npm run lint:fix`      | Automatically fixes autofixable ESLint errors                                                  |
| `npm run format:check`  | Verifies formatting with Prettier                                                              |
| `npm run format`        | Formats all code and markdown with Prettier                                                    |
| `npm run build`         | Builds ESM, CJS, and DTS files with `tsup`                                                     |
| `npm pack --dry-run`    | Verifies package tarball contents                                                              |

---

## 4. Coding Standards

- **Formatting**: Always format code using Prettier (`npm run format`). We enforce 2 spaces, double quotes, and trailing commas where appropriate.
- **Linting**: Keep code clean of unused parameters (`_` prefix allowed), `any` types, and `console.log` statements in source files.
- **JSDoc**: Every public function must include a descriptive JSDoc block with `@template`, `@param`, `@returns`, `@throws`, and a realistic `@example`.

---

## 5. Testing Requirements

Every new utility or bugfix must include automated unit tests under `tests/<module>/`:

- Normal usage with expected inputs.
- Boundary conditions (empty arrays, `0`, empty strings, negative numbers).
- Error conditions (invalid argument types throwing `TypeError` or `RangeError`).
- Prototype safety (ensuring `__proto__` cannot pollute the prototype chain).
- Mutation verification (verifying input arrays/objects are unchanged).
- Fake timer tests for async functions (`vi.useFakeTimers()`).

---

## 6. Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/my-new-utility
   ```
2. Implement your changes along with tests and documentation.
3. Run the full verification suite locally:
   ```bash
   npm run format:check
   npm run lint
   npm run typecheck
   npm run test:coverage
   npm run build
   ```
4. Commit your changes using descriptive commit messages:
   ```bash
   git commit -m "feat(array): add myNewUtility function"
   ```
5. Submit a Pull Request targeting `main`. Ensure all automated GitHub Actions CI checks pass.
