/**
 * @zaob/glean-debug-logger - React debug logging library
 *
 * A production-ready React hook that captures console logs, network requests (Fetch + XHR),
 * exports with smart filenames, and supports server upload.
 *
 * @packageDocumentation
 */

// Hooks
export { useLogRecorder } from "./hooks/useLogRecorder";

// Components
export { DebugPanel } from "./components/DebugPanel";
export { DebugPanelMinimal } from "./components/DebugPanelMinimal";

// Utils
export * from "./utils";

// Types
export * from "./types";
