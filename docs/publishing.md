# Publishing Guide — `@codewithraheem/devkit`

This guide explains how maintainers publish releases of `@codewithraheem/devkit` to the npm registry.

---

## 1. Prerequisites

- Maintainer access to the `@codewithraheem` organization on npm.
- An npm account configured with Two-Factor Authentication (2FA).
- Clean working directory on the `main` branch.

---

## 2. Pre-release Verification

Run the full local verification pipeline:

```bash
# 1. Clean build and coverage
npm run clean

# 2. Type checking
npm run typecheck

# 3. Linting
npm run lint

# 4. Automated unit tests with coverage enforcement
npm run test:coverage

# 5. Build distribution artifacts
npm run build

# 6. Dry run package tarball inspection
npm pack --dry-run
```

Verify that:

- All tests pass with >90% coverage.
- No TypeScript or ESLint errors exist.
- Tarball size is lean (~100 KB).
- Only `dist/`, `package.json`, `README.md`, `LICENSE`, and `CHANGELOG.md` are packed.

---

## 3. Version Bump

Follow Semantic Versioning:

- **Patch** (`0.1.1`): Backwards-compatible bug fixes.
- **Minor** (`0.2.0`): New backwards-compatible features/utilities.
- **Major** (`1.0.0`): Breaking changes or stable public API graduation.

```bash
# Example minor bump
npm version minor -m "chore(release): bump version to %s"
```

Update `CHANGELOG.md` with the new version section and release notes.

---

## 4. Publish to npm

Log in to npm (if not already authenticated):

```bash
npm login
```

Because `@codewithraheem/devkit` is a scoped package (`@codewithraheem/...`), pass the `--access public` flag:

```bash
npm publish --access public
```

---

## 5. Post-Release

1. Push tags to GitHub:
   ```bash
   git push origin main --tags
   ```
2. Create a GitHub Release referencing the release notes from `CHANGELOG.md`.
3. Verify the published package in a clean test directory:
   ```bash
   npm init -y
   npm install @codewithraheem/devkit@latest
   node -e "const devkit = require('@codewithraheem/devkit'); console.log(devkit.clamp(15, 0, 10));"
   ```
