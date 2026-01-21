# Development Guide

This guide covers the development workflow, coding conventions, and build process for `@zaob/glean-debug-logger`.

## 🛠 Prerequisites

- Node.js (Version defined in `.nvmrc`)
- npm or yarn
- React 17+ (as a peer dependency)

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/maemreyo/glean-debug-logger.git
   cd glean-debug-logger
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development mode (Storybook):
   ```bash
   npm run storybook
   ```

## 🏗 Build Process

We use `tsup` for bundling the library into multiple formats.

```bash
npm run build
```

The build process generates:
- `dist/index.js` (CommonJS)
- `dist/index.mjs` (ES Modules)
- `dist/index.d.ts` (TypeScript Declarations)

**Constraints**: The bundle size must remain under 20KB (minzipped) to ensure minimal impact on the consumer application.

## 🧪 Testing

We use `vitest` for unit testing.

```bash
npm run test         # Run all tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

## 📏 Coding Conventions

### Exports
- **Named Exports ONLY**: To support tree-shaking, we do not use default exports.
- **Index Exports**: All public APIs must be exported from `src/index.ts`.

### TypeScript
- We use strict TypeScript mode.
- Avoid using `any` whenever possible. Use structured interfaces defined in `src/types/`.

### React
- Use functional components and hooks.
- Prefix all custom hooks with `use`.

### Code Style
- We use **ESLint** and **Prettier** for code quality and formatting.
- Run `npm run lint` and `npm run format` before committing.

## 📝 Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This is enforced by `commitlint`.

**Format**: `<type>(<scope>): <description>`

**Types**:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Scopes**: `hooks`, `components`, `utils`, `interceptors`, etc. (e.g., `feat(hooks): add XHR interception`)

## 🚀 Release Process

We use `semantic-release` to automate the versioning and publishing process.

1. Commits to the `main` branch trigger a GitHub Action.
2. `semantic-release` analyzes the commits to determine the next version number.
3. It generates a `CHANGELOG.md`, creates a Git tag, and publishes the package to npm.

## 🚫 Anti-Patterns

- **No `TODO`/`FIXME`**: Do not merge code with `TODO` or `FIXME` comments into the main branch.
- **No `console.log`**: Avoid using `console.log` in production code. If necessary, use a prefixed version that won't be captured by the logger itself.
- **Safe Serialization**: Never use `JSON.stringify` on unknown objects without using the `safeStringify` utility to handle circular references.
