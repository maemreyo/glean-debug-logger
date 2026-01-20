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
