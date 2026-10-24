# @allahjs/utils - AI Agent Instructions

## Project Overview
A modular TypeScript utility library with multi-environment support (Node.js, Browser, UniApp). The library is organized into namespaces (core, browser, request, uniapp) with each namespace exporting a default object containing utility functions.

## Architecture & Module Structure

### Directory Organization
- **src/core/** - Universal utilities (arrayUtils, stringUtils, objectUtils, etc.) - usable everywhere
- **src/browser/** - Browser-specific utilities (domUtils, cookieUtils, urlUtils)
- **src/request/** - HTTP request utilities with ReqQueue and different adapter patterns
- **src/uniapp/** - UniApp/WeChat mini-program specific utilities (cloudUtils, Tips, uniUtils)
- **src/types/** - Shared type definitions (e.g., ITablePage, IOptions2)

### Module Pattern
Each module follows this structure:
```
src/core/arrayUtils/
  ├── index.ts          // Default export: const arrayUtils = { unique(), chunk(), ... }
  └── index.md          // Public API documentation
```
Modules export a **default object** (not named exports). Example: `export default arrayUtils = { unique, chunk, ... }`

## Build & Output Configuration

### Rollup Configuration (rollup.config.mjs)
- **Dynamic multi-entry build**: Uses `scan-modules.mjs` to auto-discover all `index.ts` files
- **Output formats**:
  - CommonJS: `dist/` with `.cjs` extension (`dist/core.cjs`, `dist/browser.cjs`, etc.)
  - ESM: `dist/esm/` with `.js` extension
  - Types: TypeScript declarations (`dist/**/*.d.ts`)
- **preserveModules**: True - maintains directory structure in output
- **Entry points in package.json**: Configured for tree-shaking with dual format exports

### Build Commands
```bash
pnpm build       # Full build (cjs + esm + dts)
pnpm build:watch # Watch mode
pnpm clean       # Remove dist/
```

## Publishing Workflow

### Automated via semantic-release
- **Trigger**: Push to `main` branch (GitHub Actions)
- **Version calculation**: Based on Conventional Commits
  - `fix:` → patch (0.0.2 → 0.0.3)
  - `feat:` → minor (0.0.2 → 0.1.0)
  - `BREAKING CHANGE:` → major (0.0.2 → 1.0.0)
- **Automated steps**: 
  1. Analyzes commits
  2. Updates package.json version
  3. Generates CHANGELOG.md
  4. Creates GitHub Release
  5. Publishes to npm
- **Note**: Never manually edit version in package.json - semantic-release handles this

### Required GitHub Secrets
- `NPM_TOKEN` - From npmjs.com account settings
- `GITHUB_TOKEN` - Auto-provided by GitHub Actions

## Testing & Quality

### Jest Configuration (jest.config.mjs)
- **Root**: `<rootDir>/src`
- **Test patterns**: `**/__tests__/**/*.+(ts|tsx|js)` or `**/*.(test|spec).+(ts|tsx|js)`
- **Setup file**: `src/setupTests.ts`
- **Coverage**: HTML reports at `coverage/index.html`

### Linting
- **Config**: `eslint.config.mjs` (ESLint 9.x + custom @allahjs/eslint)
- **Commands**:
  ```bash
  pnpm lint       # Check
  pnpm lint:fix   # Auto-fix
  ```
- **Rules**: Strict TS settings, template literals enforced, camelCase disabled

### Other Commands
```bash
pnpm type-check  # tsc type validation
pnpm test        # Jest (passes with no tests)
pnpm test:watch  # Watch mode
```

## Key Patterns & Conventions

### 1. Function Documentation
All utility functions must have JSDoc comments:
```typescript
/**
 * Brief description
 * @param paramName - Parameter description
 * @returns Return value description
 */
function myUtil(paramName: string): Type {}
```

### 2. Utility Object Structure
Export as default object with methods:
```typescript
const stringUtils = {
  capitalize(str: string): string { ... },
  toCamelCase(str: string): string { ... },
  // ...
};
export default stringUtils;
```

### 3. Generic Types
Use generics for array/object utilities:
```typescript
unique<T>(arr: T[]): T[]
flatten<T>(arr: any[], depth?: number): T[]
```

### 4. TypeScript Configuration
- **Target**: ES2020
- **Strict mode**: Enabled (`noUnusedLocals`, `noImplicitReturns`, etc.)
- **Declaration maps**: Enabled for IDE support
- **Source maps**: Enabled for debugging

## File Naming & Organization

- **Files**: All lowercase with hyphens (e.g., `setupTests.ts`, `array-utils/`)
- **Types**: Shared in `src/types/data/index.ts` (e.g., `IOptions2`, `ITablePage`)
- **Documentation**: Every module has `index.md` - update when adding/removing functions

## Common Development Tasks

### Adding a New Utility Function
1. Add JSDoc + function to `src/core/stringUtils/index.ts` (or appropriate module)
2. Add test to `**/__tests__/**/*` or `*.test.ts`
3. Update `src/core/stringUtils/index.md` documentation
4. Run `pnpm test` and `pnpm lint:fix`
5. Commit with `feat: add newFunctionName utility`

### Adding a New Module
1. Create `src/core/newModule/` directory
2. Create `index.ts` with default export: `const newModule = { ... }`
3. Create `index.md` with API documentation
4. Export from `src/index.ts`: `export { default as newModule }`
5. Rollup auto-discovers via scan-modules.mjs

### Before Pushing
```bash
pnpm clean && pnpm build && pnpm test
pnpm lint:fix
# Use Conventional Commit message for automatic versioning
```

## Important Notes

- **Never manually update package.json version** - semantic-release manages this
- **Always use default exports** for utility objects, not named exports
- **Keep types in src/types/** for cross-module reuse
- **Documentation must be in index.md** - auto-discovered by dumi
- **Preserve module structure in output** - rollup's preserveModules is critical

## Related Configuration Files
- `tsconfig.json` - TypeScript strict mode enabled
- `.releaserc.json` - semantic-release plugins & configuration
- `.github/workflows/npm-publish.yml` - GitHub Actions automation
