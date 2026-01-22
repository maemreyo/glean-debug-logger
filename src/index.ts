/**
 * @zaob/glean-debug-logger - React debug logging library
 *
 * A production-ready React hook that captures console logs, network requests (Fetch + XHR),
 * exports with smart filenames, and supports server upload.
 *
 * @packageDocumentation
 */

// Hooks
export { useLogRecorder } from './hooks/useLogRecorder';

// Components
export { DebugPanel } from './components/DebugPanel';
export { DebugPanelMinimal } from './components/DebugPanelMinimal';
export { default as GleanDebugger } from './components/GleanDebugger';

// Utils (exclude ecsTransform types to avoid conflict with types/index.ts)
export * from './utils/sanitize';
export * from './utils/filename';
export { transformToECS, filterStackTrace, transformMetadataToECS } from './utils/ecsTransform';

// Types
export * from './types';
