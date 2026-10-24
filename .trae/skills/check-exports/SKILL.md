---
name: "check-exports"
description: "Scans the project for missing module exports in index files and package.json. Invoke when user asks to check exports, verify module structure, or fix missing exports."
---

# Check Exports Skill

This skill scans the project's source code to identify modules that are not properly exported. It checks:
1. `src/index.ts` for top-level exports.
2. `src/<module>/index.ts` for sub-module exports.
3. `package.json` for module exports configuration.

## Usage

When invoked, this skill will run the `npm run check-exports` command, which executes `scripts/check-exports.mjs`.

## How to fix issues

If the skill reports warnings:
- **Missing index export**: Add `export * from './moduleName'` or `export { default as moduleName } from './moduleName'` to the relevant `index.ts`.
- **Missing package export**: Add the module path to the `exports` section in `package.json`.

## Command

To run the check manually:
```bash
npm run check-exports
```
