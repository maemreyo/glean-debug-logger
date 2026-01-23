# [5.0.0](https://github.com/maemreyo/glean-debug-logger/compare/v4.0.0...v5.0.0) (2026-01-23)


### Bug Fixes

* **lint:** resolve eslint errors in test files ([99ed259](https://github.com/maemreyo/glean-debug-logger/commit/99ed259d5cd82b4660a5f8cad530b20b6c092e0a))
* **xhr:** prevent duplicate event handler calls and improve cleanup ([5ae345e](https://github.com/maemreyo/glean-debug-logger/commit/5ae345eef8a78c6e05cac5d540f896cc54d715d5))


### Code Refactoring

* **logger:** implement singleton console interceptor and improve request tracking ([1166e6f](https://github.com/maemreyo/glean-debug-logger/commit/1166e6f7d8d800fe0d59cfc498082eca7dc9f8fb))
* **logger:** implement singleton console interceptor and improve request tracking ([21fa145](https://github.com/maemreyo/glean-debug-logger/commit/21fa145c61fa6790246426df082f602558a8089e))
* **logger:** implement singleton interceptors and improve memory management ([ed092a4](https://github.com/maemreyo/glean-debug-logger/commit/ed092a4a4666683372a05694ec6149f57b0b8a0a))
* **logger:** update singleton interceptors with current config ([4aa06f9](https://github.com/maemreyo/glean-debug-logger/commit/4aa06f9eb6acc41694370a23582dfe483f303652))


### Features

* **config:** add persistAcrossReloads option to control log persistence behavior ([f4f3600](https://github.com/maemreyo/glean-debug-logger/commit/f4f36006224d437c616bf47840dffe478af4065b))
* **interceptors:** add callback removal methods to prevent memory leaks ([bc3f596](https://github.com/maemreyo/glean-debug-logger/commit/bc3f5963d551f80d4aedca75d9be737f4e0fc4cc))
* **interceptors:** add callback removal methods to prevent memory leaks ([2527714](https://github.com/maemreyo/glean-debug-logger/commit/2527714bf26a8918be42c198c2d274398e165b8f))
* **test:** expand network request testing capabilities ([a7815c4](https://github.com/maemreyo/glean-debug-logger/commit/a7815c4cd0a6de45c5d01d9aa9946b07c1272b5e))
* **ui:** add settings dropdown management and improve panel interactions ([4420577](https://github.com/maemreyo/glean-debug-logger/commit/44205776bf7b54093224d34d3118d840dc77a733))
* **ui:** enhance debug panel interactions and settings dropdown ([f8eb811](https://github.com/maemreyo/glean-debug-logger/commit/f8eb81184a01169bd0c30e4f3acad1eed7b08ffd))
* **ui:** enhance debug panel with refined dropdown styling and improved session details ([f0bdb4e](https://github.com/maemreyo/glean-debug-logger/commit/f0bdb4e0a0812edd6f7070fd0691ed299dd94586))
* **ui:** enhance debug panel with session details dropdown and warm editorial styling ([d80a67a](https://github.com/maemreyo/glean-debug-logger/commit/d80a67a565ad00f8b8f8410f44f98068f9fd47cb))
* **ui:** migrate to Radix UI components and enhance debug panel ([033c7a0](https://github.com/maemreyo/glean-debug-logger/commit/033c7a06abfecd7d86d45d19047b93eb5b38e9b0))
* **ui:** migrate to Radix UI components and enhance debug panel ([4c39f86](https://github.com/maemreyo/glean-debug-logger/commit/4c39f86d7e346b2f5162b1f1e2c4a07fd9bc5de6))


### BREAKING CHANGES

* **test:** Removed simple XHR simulation functions in favor of
comprehensive test suite with multiple scenarios
* **xhr:** The XHR interceptor now uses both property overrides and event listeners for better compatibility. Tests that rely on specific event handling behavior may need updates.
* **logger:** Interceptors now require explicit config updates in useEffect
* **logger:** NetworkInterceptor and XHRInterceptor now use singleton pattern
* **logger:** ConsoleInterceptor now uses singleton pattern by default. Use `createNew()` for testing to create isolated instances.
* **logger:** ConsoleInterceptor constructor is now private. Use ConsoleInterceptor.getInstance() instead of new ConsoleInterceptor().
* **interceptors:** Interceptor cleanup behavior has changed. Components using
interceptors must now explicitly remove callbacks to prevent memory leaks.
* **ui:** The click-outside behavior for closing the debug panel has been moved from DebugPanel to DebugPanelHeader component. This changes the component interaction flow and may require updates to any custom implementations that rely on the previous behavior.
* **ui:** The custom dropdown and scroll implementations have been replaced with Radix UI components. If you were relying on the specific DOM structure or CSS classes of the previous implementation, you may need to update your code.

# [4.0.0](https://github.com/maemreyo/glean-debug-logger/compare/v3.1.0...v4.0.0) (2026-01-22)


### Code Refactoring

* **hooks:** extract reusable helper functions in useLogRecorder ([ac9b3bb](https://github.com/maemreyo/glean-debug-logger/commit/ac9b3bb820737f99f3ed5704d557f29d827b6a78))


### Features

* **panel:** add filter button UI components ([c076fc7](https://github.com/maemreyo/glean-debug-logger/commit/c076fc796d5cc75c9deee8c0c54ed91586092b55))
* **panel:** add handleCopyFiltered function ([16206b9](https://github.com/maemreyo/glean-debug-logger/commit/16206b95e0a7ff0c8b3fb88f6b2adf354d7682a1))
* **plans:** mark all debugpanel-copy-filter TODO items complete ([a9d7eb0](https://github.com/maemreyo/glean-debug-logger/commit/a9d7eb0b3a261a4ed1c322535525aec610d0f2f7))
* **plans:** mark debugpanel-copy-filter plan as complete ([57e1938](https://github.com/maemreyo/glean-debug-logger/commit/57e1938de8c0dd71888e4acd589c65df0d6c63a7))
* **ui:** add new button styles and enhance debug panel interactions ([ff265e8](https://github.com/maemreyo/glean-debug-logger/commit/ff265e81d976f5173076d634d72ceb0eb6b3aa21))
* **ui:** add session tooltip with metadata display ([3ea0112](https://github.com/maemreyo/glean-debug-logger/commit/3ea0112de63a9cbc66b2b1aa89320f1707585deb))
* **ui:** enhance debug panel with improved status messages and controls ([5c6bf49](https://github.com/maemreyo/glean-debug-logger/commit/5c6bf49c068e837bab5f419828b11887f667a227))
* **ui:** enhance debug panel with modern design and animations ([97430ca](https://github.com/maemreyo/glean-debug-logger/commit/97430ca3a94cdc784ef8a83ff84ed67752880873))
* **ui:** refactor debug panel into modular components ([74eaf22](https://github.com/maemreyo/glean-debug-logger/commit/74eaf22454a997de01a581f2e94adda80292dd5e))
* **ui:** reorganize debug panel action buttons ([f9bd7e1](https://github.com/maemreyo/glean-debug-logger/commit/f9bd7e1df7507cdc41ec77fe3b95a098389eaeb2))


### Tests

* **ui:** add comprehensive test coverage for toggle panel functionality ([be4f4df](https://github.com/maemreyo/glean-debug-logger/commit/be4f4dfdb1546762293a9465ad495655c9cee68c))


### BREAKING CHANGES

* **ui:** Adds new test infrastructure and extends existing test suite
* **hooks:** None

# [3.1.0](https://github.com/maemreyo/glean-debug-logger/compare/v3.0.0...v3.1.0) (2026-01-22)


### Features

* **demo:** add glean-debug-logger demo application ([0927ed3](https://github.com/maemreyo/glean-debug-logger/commit/0927ed382e97ab991e993c0cfc9a11d525f77479))

# [3.0.0](https://github.com/maemreyo/glean-debug-logger/compare/v2.1.0...v3.0.0) (2026-01-22)


### Bug Fixes

* **release:** rename .releaserc to .releaserc.js ([6a27118](https://github.com/maemreyo/glean-debug-logger/commit/6a2711811baecfbef04d1d166c578a8f3b1f305f))
* **tests:** resolve GleanDebugger.test.tsx failures ([e32abd2](https://github.com/maemreyo/glean-debug-logger/commit/e32abd2598e7adb0e588d4dd8191ecc5eab6699c))


### Features

* **components:** add GleanDebugger component with smart activation logic ([04722f7](https://github.com/maemreyo/glean-debug-logger/commit/04722f71435ab3e0120f0a818d1437b6dcd39fe9))


### BREAKING CHANGES

* **components:** The new GleanDebugger component replaces the previous DebugPanel activation logic with a more comprehensive system that includes URL parameter detection, localStorage persistence, and user role-based activation.

# [2.1.0](https://github.com/maemreyo/glean-debug-logger/compare/v2.0.0...v2.1.0) (2026-01-22)


### Features

* **components:** add GleanDebugger component with activation detection ([c54e279](https://github.com/maemreyo/glean-debug-logger/commit/c54e279857e55e5c8b9bcb5dae0e92e56b23c6fc))

# [2.0.0](https://github.com/maemreyo/glean-debug-logger/compare/v1.5.0...v2.0.0) (2026-01-21)


### doc

* **planning:** add comprehensive DX improvement plans for GleanDebugger component ([7c8f596](https://github.com/maemreyo/glean-debug-logger/commit/7c8f5964b3c70be556f81a4c4d837c4cc2bc0d1f))


### BREAKING CHANGES

* **planning:** This introduces new planning documents that will guide the implementation of the GleanDebugger component, which will change the integration pattern for the library.

# [1.5.0](https://github.com/maemreyo/glean-debug-logger/compare/v1.4.2...v1.5.0) (2026-01-21)


### Features

* test release trigger ([c2f515e](https://github.com/maemreyo/glean-debug-logger/commit/c2f515ed647a45cfeccab46543aa39de3e50f68f))

## [1.4.2](https://github.com/maemreyo/glean-debug-logger/compare/v1.4.1...v1.4.2) (2026-01-21)


### Bug Fixes

* **ci:** add @semantic-release/npm plugin to publish to npm registry ([872fd7b](https://github.com/maemreyo/glean-debug-logger/commit/872fd7bf675aa615b9bd674406529792ab27753e))

## [1.4.1](https://github.com/maemreyo/glean-debug-logger/compare/v1.4.0...v1.4.1) (2026-01-21)


### Bug Fixes

* **ci:** remove [skip ci] from release commits to trigger GitHub Action ([715ac97](https://github.com/maemreyo/glean-debug-logger/commit/715ac97f0c448bd41ab8e2712c577f71521234bb))

# [1.4.0](https://github.com/maemreyo/glean-debug-logger/compare/v1.3.0...v1.4.0) (2026-01-21)


### Features

* **ui:** add copy format settings and refactor debug panel layout ([52e363d](https://github.com/maemreyo/glean-debug-logger/commit/52e363d5a99fa572ba30189eb2c1ecaae8b45a44))


### BREAKING CHANGES

* **ui:** The copy functionality now defaults to ECS JSON format instead of plain JSON. Users can change this in the new settings dropdown.

# [1.3.0](https://github.com/maemreyo/glean-debug-logger/compare/v1.2.0...v1.3.0) (2026-01-21)


### Bug Fixes

* correct regex pattern in sanitizeFilename function ([beedee3](https://github.com/maemreyo/glean-debug-logger/commit/beedee3520b4561fddbe195781957c25813589e8))


### chore

* **build:** remove deprecated type declaration files ([e4e8cc7](https://github.com/maemreyo/glean-debug-logger/commit/e4e8cc70e195d7828ddb26b2a12c12072c92f8cc))


### Features

* **export:** add AI-friendly log formats (JSONL, ECS JSON, AI-TXT) ([286261c](https://github.com/maemreyo/glean-debug-logger/commit/286261c8591a51f9aba47d656882eff11fcaa722))


### BREAKING CHANGES

* **build:** Removes dist/index.d.mts, dist/index.d.ts, dist/index.js, and dist/index.mjs files. Users should update to use the newer type definitions and build artifacts.
* **export:** The ExportFormat type now includes 'jsonl', 'ecs.json', and 'ai.txt' options

# [1.2.0](https://github.com/maemreyo/glean-debug-logger/compare/v1.1.0...v1.2.0) (2026-01-21)


### Bug Fixes

* **xhr:** fix XHRInterceptor prototype patching and test expectations ([9877d6d](https://github.com/maemreyo/glean-debug-logger/commit/9877d6d2607e26a1755d32e270ff82dc3a7fbc28))
* **xhr:** fix XHRInterceptor prototype patching and test expectations ([20aee4e](https://github.com/maemreyo/glean-debug-logger/commit/20aee4e5eb19bbf23fa7ed4c66023b705d715216))


### Features

* **storybook:** add complete Storybook setup with stories, tests, and documentation ([ed75d4f](https://github.com/maemreyo/glean-debug-logger/commit/ed75d4f7970858c397d92e7f190362cea88286d0))
* **interceptors:** add console, network, and XHR interception services ([f74e735](https://github.com/maemreyo/glean-debug-logger/commit/f74e735ac9614cd592bccc5b030776a0e6e53419))
* **debug-panel:** add copy to clipboard functionality with comprehensive UI improvements ([a93687c](https://github.com/maemreyo/glean-debug-logger/commit/a93687c144e1d2c4d2c59a79743c7057bc343404))
* **xhr:** comment out all tests in XHRInterceptor.test.ts ([44c55d4](https://github.com/maemreyo/glean-debug-logger/commit/44c55d49a5febe34ac94abe4c6d8ddc89924793d))
* **debug-panel:** refactor UI with Goober styling and accessibility enhancements ([3fe2014](https://github.com/maemreyo/glean-debug-logger/commit/3fe2014a4a29ee093215e719e4856683b41a36eb))
* **debug-panel:** refactor UI with improved styling, accessibility, and internationalization ([3b38e34](https://github.com/maemreyo/glean-debug-logger/commit/3b38e344d9ba56c9c9672f10753a287b4d9f8ba7))
* **xhr:** uncomment all tests in XHRInterceptor.test.ts ([988e515](https://github.com/maemreyo/glean-debug-logger/commit/988e51532eabfb7f920ee9c73dae746567273e7b))


### BREAKING CHANGES

* **xhr:** The XHRInterceptor now requires explicit attach() call before use
* **debug-panel:** The DebugPanel component now requires additional state management for copy functionality and has updated styling classes.
* **debug-panel:** The DebugPanel component now requires Goober as a peer dependency. Projects using this component must install goober@^2.1.18.
* **interceptors:** The interceptors introduce new API surfaces that may require
adjustments to existing logging and network monitoring implementations.

# [1.1.0](https://github.com/maemreyo/glean-debug-logger/compare/v1.0.0...v1.1.0) (2026-01-20)


### Features

* **planning:** add custom download directory feature implementation plan ([dea0123](https://github.com/maemreyo/glean-debug-logger/commit/dea0123941fa0cc455fddcec61af6261bc022fa5))
* **download:** add directory picker support for log downloads ([463eef9](https://github.com/maemreyo/glean-debug-logger/commit/463eef9692658fece80b085ac9cf8134d5582cbd))


### Tests

* add comprehensive test suite for log recorder and metadata utilities ([481cb65](https://github.com/maemreyo/glean-debug-logger/commit/481cb654be95306d21b344308cf43a49c9d45ef0))


### BREAKING CHANGES

* **download:** The `downloadLogs()` function signature has changed to include an optional `options` parameter. Existing code using this function will continue to work as the parameter is optional and has a fallback to the original behavior.
* Edge browser detection now uses 'Edg' instead of 'Edge' in user agent string

# 1.0.0 (2026-01-20)


### Bug Fixes

* **ci:** resolve release pipeline issues ([288882c](https://github.com/maemreyo/glean-debug-logger/commit/288882c6a49f570e07cfc7b6ac76cedb31a0f648))
* update workflow permissions and package.json exports order ([6b8760f](https://github.com/maemreyo/glean-debug-logger/commit/6b8760fbdf64c4c11cd7214994a08e4824ede3f5))


### Features

* **debug-logger:** add backend upload examples for multiple storage solutions ([d23a7f2](https://github.com/maemreyo/glean-debug-logger/commit/d23a7f2fc3471557546f28d96b17f65770859898))
* **debug-logger:** add debug panel components with logging capabilities ([1acff79](https://github.com/maemreyo/glean-debug-logger/commit/1acff7970b6b94ec0f00e2ad2df7cf4c713ba085))
* **debug-logger:** implement core debug logging library with console/network interception ([30e95b2](https://github.com/maemreyo/glean-debug-logger/commit/30e95b240889e0536d808b6863376be8f5c6f89e))


### BREAKING CHANGES

* **debug-logger:** Introduces new upload endpoint structure that requires
configuration changes for existing debug logger implementations.
* **debug-logger:** This introduces new components that may require
configuration updates for existing debug logger implementations.
* **debug-logger:** Initial implementation of @zaob/glean-debug-logger package
