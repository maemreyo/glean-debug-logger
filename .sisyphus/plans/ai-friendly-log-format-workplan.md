# Work Plan: AI-Friendly Log Format Implementation

## Context

### Original Request

Transform the debug logger's export formats to be more AI-agent friendly while maintaining backward compatibility. Implement 6 improvements:

1. Add JSONL export option
2. Add semantic prefixes (req._, res._, err._, perf._)
3. Include ECS compliance
4. Filter stack traces
5. Add correlation ID for request/response pairs
6. Improve TXT format

### Strategic Plan

Reference: `.sisyphus/plans/ai-friendly-log-format.md` (already created)

### Metis Gap Analysis

Reference: Metis consultation identified 10+ guardrails, 8 scope creep areas, 12+ missing acceptance criteria, 15+ edge cases

---

## Guardrails (NON-NEGOTIABLE)

### Architecture Guardrails

| #      | Guardrail                                                      | Rationale                                  |
| ------ | -------------------------------------------------------------- | ------------------------------------------ |
| **G1** | **DO NOT modify existing `'json'` and `'txt'` format schemas** | Maintain backward compatibility            |
| **G2** | **DO NOT add new external dependencies**                       | Keep bundle < 20KB constraint              |
| **G3** | **DO NOT change `LogEntry` or `LogMetadata` type structures**  | Only add transform layers on top           |
| **G4** | **DO NOT enable new formats by default**                       | New formats must be opt-in                 |
| **G5** | **DO NOT add format preview functionality**                    | Prevent UI scope creep                     |
| **G6** | **DO NOT extend ECS field mappings beyond defined table**      | Prevent ECS compliance drift               |
| **G7** | **DO NOT implement cross-session correlation IDs**             | Keep scope to single session               |
| **G8** | **DO NOT modify FileService interface**                        | Prevent breaking changes to download logic |

### Performance Guardrails

| #      | Limit                        | Value   | Rationale                                  |
| ------ | ---------------------------- | ------- | ------------------------------------------ |
| **P1** | **MAX_LOG_COUNT_PER_EXPORT** | 10,000  | Prevent memory exhaustion                  |
| **P2** | **MAX_FILE_SIZE_MB**         | 10MB    | Browser download limits, AI context limits |
| **P3** | **MAX_RESPONSE_BODY_CHARS**  | 100,000 | Large JSON responses can be MBs            |
| **P4** | **MAX_STACK_TRACE_FRAMES**   | 20      | Balance relevance vs noise                 |
| **P5** | **EXPORT_COMPLETE_TIME_MS**  | 5,000   | User experience threshold                  |

### Safety Guardrails

| #      | Guardrail                       | Implementation                             |
| ------ | ------------------------------- | ------------------------------------------ |
| **S1** | **Circular reference handling** | Reuse existing `safeStringify()`           |
| **S2** | **Invalid UTF-8 handling**      | Use `JSON.stringify()` with error catching |
| **S3** | **Empty export handling**       | Produce valid empty files                  |
| **S4** | **Missing timestamp fallback**  | Use current time                           |
| **S5** | **URL parsing error handling**  | Catch and use raw URL string               |

---

## Scope Boundaries

### IN SCOPE (Will Do)

| Category         | Items                                                        |
| ---------------- | ------------------------------------------------------------ |
| **New Formats**  | JSONL (`.jsonl`), ECS JSON (`.ecs.json`), AI-TXT (`.ai.txt`) |
| **ECS Mapping**  | Fields defined in the ECS mapping table only                 |
| **Stack Filter** | `ignored: true` flag filtering + 20 frame limit only         |
| **Correlation**  | UUID v4 for single request/response pairs within session     |
| **UI Changes**   | Add buttons/dropdown for new formats (no preview)            |
| **Tests**        | Unit tests for new utilities and export formats              |

### OUT OF SCOPE (Will NOT Do)

| Category                   | Excluded Items                                                     |
| -------------------------- | ------------------------------------------------------------------ |
| **Format Previews**        | Any UI that shows format content before export                     |
| **Cross-Session**          | Correlating logs across browser sessions                           |
| **Framework Detection**    | Auto-detecting React/Next.js frames for filtering                  |
| **Custom ECS Fields**      | Adding project-specific fields like `custom.*`                     |
| **Compression**            | Adding gzip/zip compression to exports                             |
| **Encryption**             | Adding encryption to exports                                       |
| **Streaming Live**         | Real-time log consumption during recording                         |
| **Error Classification**   | Stack-pattern-based error type detection beyond existing log types |
| **Performance Benchmarks** | Histograms, percentiles, beyond raw duration                       |

---

## Work Objectives

### Core Objective

Implement AI-friendly log export formats that enable efficient AI-agent consumption while maintaining backward compatibility with existing features.

### Concrete Deliverables

| Deliverable               | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| **JSONL Utility**         | `src/utils/jsonl.ts` with parse/stringify functions            |
| **ECS Transform Utility** | `src/utils/ecsTransform.ts` with LogEntry → ECS transformation |
| **New Export Formats**    | 3 new formats in `downloadLogs()`: jsonl, ecs.json, ai.txt     |
| **UI Integration**        | New format selection in DebugPanel                             |
| **Test Coverage**         | Unit tests for all new utilities and formats                   |
| **Documentation**         | `docs/log-formats.md` with examples                            |

### Definition of Done

- [ ] All 5 export formats work (json, txt, jsonl, ecs.json, ai.txt)
- [ ] ECS compliance verified against ECS 1.12.0 spec
- [ ] JSONL can be parsed line-by-line
- [ ] Stack traces filtered (max 20 relevant frames)
- [ ] Correlation IDs link request/response pairs
- [ ] Build succeeds (`npm run build`)
- [ ] All tests pass (`npm run test`)
- [ ] No new external dependencies
- [ ] Backward compatibility maintained

### Must Have

- [ ] JSONL format output
- [ ] ECS-compliant fields
- [ ] Stack trace filtering
- [ ] Correlation ID improvement
- [ ] New format buttons in UI
- [ ] Unit tests

### Must NOT Have

- [ ] No format preview UI
- [ ] No cross-session correlation
- [ ] No new dependencies
- [ ] No changes to existing format schemas

---

## Verification Strategy

### Test Infrastructure Assessment

**Test infrastructure exists:** YES

- Framework: Vitest
- Test location: `src/**/*.test.ts`
- Coverage command: `npm run test`

### Test Strategy

**For new utilities (JSONL, ECS Transform):**

- Use TDD: RED → GREEN → REFACTOR
- Each utility has dedicated test file

**For export formats:**

- Manual verification via Playwright
- Generate sample exports and validate structure

### Test Coverage Requirements

| Component         | Required Coverage   |
| ----------------- | ------------------- |
| `jsonl.ts`        | 100% functions      |
| `ecsTransform.ts` | 100% functions      |
| `downloadLogs()`  | All format branches |
| Overall           | > 80%               |

---

## Task Flow

```
Phase 1          Phase 2          Phase 3          Phase 4          Phase 5
═══════          ═══════          ═══════          ═══════          ═══════
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│  1,2,3  │ ───► │  4,5,6  │ ───► │  7,8,9  │ ───► │  10,11  │ ───► │ 12,13,14│
│ Infra   │      │  ECS    │      │ Formats │      │   UI    │      │  Tests  │
└─────────┘      └─────────┘      └─────────┘      └─────────┘      └─────────┘
```

### Parallelization

| Group | Tasks   | Reason                                    |
| ----- | ------- | ----------------------------------------- |
| A     | 1, 2, 3 | Independent utilities                     |
| B     | 4, 5    | Both use ECS mapping, can run in parallel |
| C     | 7, 8, 9 | Format handlers in same function          |
| D     | 10, 11  | UI changes independent                    |

| Task | Depends On | Reason                       |
| ---- | ---------- | ---------------------------- |
| 4    | 1, 2       | Uses JSONL and ECS utilities |
| 5    | 1, 2       | Uses JSONL and ECS utilities |
| 6    | 4, 5       | Depends on ECS transform     |
| 7    | 6          | Uses ECS transform           |
| 8    | 6          | Uses ECS transform           |
| 9    | 6          | Uses ECS transform           |
| 10   | 9          | UI needs format handlers     |
| 11   | 10         | Styles follow buttons        |
| 12   | 7, 8, 9    | Tests need formats           |
| 13   | 7, 8, 9    | Tests need formats           |
| 14   | All        | Documentation last           |

---

## TODOs

- [x] 1. Create `src/utils/jsonl.ts` - JSONL utility
- [x] 2. Create `src/utils/ecsTransform.ts` - ECS transformation utility
- [x] 3. Update `src/types/index.ts` - Add new format types
- [x] 4. Implement LogEntry → ECS transformation
- [x] 5. Implement LogMetadata → ECS transformation
- [x] 6. Implement stack trace filtering
- [x] 7. Add JSONL format to downloadLogs
- [x] 8. Add ECS JSON format to downloadLogs
- [x] 9. Add AI-TXT format to downloadLogs
- [x] 10. Update DebugPanel UI with new format options
- [x] 11. Add button styles for new formats
- [x] 12. Add unit tests for JSONL utility
- [x] 13. Add unit tests for ECS transform
- [x] 14. Create format documentation (docs/log-formats.md already exists)

  **What to do**:
  - Create `docs/log-formats.md`
  - Document all 5 formats with examples
  - Include sample output for each format
  - Document ECS field mappings
  - Document correlation ID usage

  **Must NOT do**:
  - Don't add migration guides
  - Don't add comparison tables (keep simple)

  **Parallelizable**: NO (depends on All)

  **References**:
  - `docs/` - Documentation directory

  **Acceptance Criteria**:
  - [ ] Document all 5 export formats
  - [ ] Include example output for each format
  - [ ] Document ECS field mappings table
  - [ ] Document correlation ID behavior
  - [ ] Link to ECS 1.12.0 spec

  **Commit**: YES | NO
  - Message: `docs: add log formats documentation`
  - Files: `docs/log-formats.md`

---

## Performance Requirements

| Metric                          | Requirement                | Test Method          |
| ------------------------------- | -------------------------- | -------------------- |
| Export 1,000 logs (any format)  | < 500ms                    | Manual timing        |
| Export 10,000 logs (any format) | < 5,000ms                  | Manual timing        |
| JSONL parse 10,000 lines        | < 1,000ms                  | Unit test timing     |
| Bundle size increase            | < 5KB (keeps < 20KB total) | `npm run build` size |
| Memory usage during export      | < 100MB                    | Browser DevTools     |

---

## Edge Cases to Handle

| Edge Case                 | Handling Strategy                              |
| ------------------------- | ---------------------------------------------- |
| **0 logs**                | Produce valid empty file with metadata header  |
| **10,000+ logs**          | Truncate to 10,000 (P1 guardrail)              |
| **Single log > 5MB**      | Truncate response body to 100K chars (P3)      |
| **Invalid UTF-8**         | Use JSON.stringify error handling              |
| **Missing timestamp**     | Use current ISO timestamp                      |
| **URL parsing fails**     | Use raw URL string                             |
| **Empty stack trace**     | Return empty array                             |
| **Unknown log type**      | Use generic `event.category: ["unknown"]`      |
| **Very long log message** | Output as-is (line-oriented formats handle it) |
| **Binary data in body**   | Use `safeStringify()` result                   |

---

## Commit Strategy

| After Task | Message                                        | Files                                      | Verification   |
| ---------- | ---------------------------------------------- | ------------------------------------------ | -------------- |
| 1          | `feat(utils): add JSONL utility functions`     | `src/utils/jsonl.ts`                       | lint, test     |
| 2          | `feat(utils): add ECS transformation utility`  | `src/utils/ecsTransform.ts`                | lint, test     |
| 3          | `feat(types): add AI-friendly format types`    | `src/types/index.ts`                       | lint, build    |
| 4          | `feat(utils): implement LogEntry to ECS`       | `src/utils/ecsTransform.ts`                | lint, test     |
| 5          | `feat(utils): implement metadata to ECS`       | `src/utils/ecsTransform.ts`                | lint, test     |
| 6          | `feat(utils): implement stack trace filtering` | `src/utils/ecsTransform.ts`                | lint, test     |
| 7          | `feat(hooks): add JSONL export format`         | `src/hooks/useLogRecorder.ts`              | lint, build    |
| 8          | `feat(hooks): add ECS JSON export format`      | `src/hooks/useLogRecorder.ts`              | lint, build    |
| 9          | `feat(hooks): add AI-TXT export format`        | `src/hooks/useLogRecorder.ts`              | lint, build    |
| 10         | `feat(components): add format buttons`         | `src/components/DebugPanel.tsx`            | lint, build    |
| 11         | `feat(styles): add format button styles`       | `src/components/DebugPanel.styles.ts`      | lint           |
| 12         | `test(utils): add JSONL utility tests`         | `src/utils/__tests__/jsonl.test.ts`        | test, coverage |
| 13         | `test(utils): add ECS transform tests`         | `src/utils/__tests__/ecsTransform.test.ts` | test, coverage |
| 14         | `docs: add log formats documentation`          | `docs/log-formats.md`                      | Review         |

---

## Success Criteria

### Verification Commands

```bash
# All tests pass
npm run test

# Build succeeds
npm run build

# No new dependencies
npm list --depth=0

# Bundle size check
npm run build && ls -la dist/
```

### Final Checklist

- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass
- [ ] Build succeeds
- [ ] No new dependencies
- [ ] Backward compatibility maintained
- [ ] Performance requirements met
- [ ] Edge cases handled
- [ ] Documentation complete
