# DebugPanel Copy Filter - Decisions & Rationale

## Key Decisions Made

### 1. Network Category Definition

**Question**: What does "Network" include?

**Options Considered**:

- A: All network requests + responses (FETCH_REQ, FETCH_RES, XHR_REQ, XHR_RES)
- B: Network errors only (FETCH_ERR, XHR_ERR)
- C: All network entries (requests + responses + errors)

**Decision**: Option A - All network requests + responses (excluding errors)

**Rationale**:

- Matches typical user expectation of "network" (the actual requests made)
- Network errors are tracked separately in the UI stats
- Added "Network Errors" as a 4th option to match existing UI patterns

### 2. UI Pattern Selection

**Question**: How to present filter buttons?

**Options Considered**:

- A: 3 new buttons alongside existing Copy button
- B: Replace Copy with dropdown
- C: Filter section with radio buttons + single Copy

**Decision**: Option A - 3 new buttons alongside existing Copy

**Rationale**:

- Maintains discoverability (all options visible)
- Matches existing button grid pattern
- No extra clicks required
- Clear separation of concerns

### 3. Persistence Decision

**Question**: Should filter selection persist in localStorage?

**Decision**: No - session-scoped only

**Rationale**:

- Different use cases may need different filters each time
- Copy format persists because it's a preference
- Filter is more situational
- Simpler state management

### 4. Filter Options Set

**Final Set**:

- Copy All (existing button, renamed to Copy)
- Copy Logs (new) - CONSOLE entries
- Copy Errors (new) - CONSOLE level === 'ERROR'
- Copy Network (new) - network requests + responses
- Copy Network Errors (new) - network errors

### 5. Status Message Format

**Format**: "Copied X [filter-type] to clipboard"

Examples:

- "Copied 5 logs to clipboard"
- "Copied 3 errors to clipboard"
- "Copied 10 network requests to clipboard"
- "Copied 2 network errors to clipboard"

Empty state: "No logs to copy", "No errors to copy", etc.
