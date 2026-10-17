# Contributing to CodeWithRaheem DevKit

Thank you for your interest in contributing to **CodeWithRaheem DevKit**! We welcome community contributions, bug reports, and enhancements.

---

## Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Development Setup

### 1. Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**

### 2. Fork and Clone

```bash
git clone https://github.com/RaheemSiddiqui527/codewithraheem-devkit.git
cd codewithraheem-devkit
```

### 3. Install Dependencies

```bash
npm install
```

---

## Available Scripts

| Command                 | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `npm test`              | Runs the Vitest test suite once                  |
| `npm run test:watch`    | Runs Vitest in interactive watch mode            |
| `npm run test:coverage` | Generates and checks test coverage report        |
| `npm run typecheck`     | Validates TypeScript compilation with `--noEmit` |
| `npm run lint`          | Lints codebase using ESLint                      |
| `npm run lint:fix`      | Fixes autofixable lint errors                    |
| `npm run format:check`  | Verifies code formatting with Prettier           |
| `npm run format`        | Auto-formats code with Prettier                  |
| `npm run build`         | Compiles ESM, CJS, and DTS output files          |
| `npm pack --dry-run`    | Verifies tarball contents before release         |

---

## Pull Request Guidelines

1. **Branch Naming**: Use clear branches, e.g. `feat/array-chunk`, `fix/roundTo-negative`.
2. **Tests are Mandatory**: Every new function or bugfix must include automated unit tests under `tests/`.
3. **No Unsafe Dependencies**: `@codewithraheem/devkit` maintains **zero production runtime dependencies**. Do not add packages to `dependencies`.
4. **Preserve Compatibility**: Keep exports dual ESM and CommonJS compatible.
5. **Run Verification Before Committing**:
   ```bash
   npm run lint
   npm run typecheck
   npm run test:coverage
   npm run build
   ```

---

## Licensing

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
