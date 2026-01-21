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
