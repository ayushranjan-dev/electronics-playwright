# Raj Electronics Ledger QA Suite

Comprehensive manual and automation QA for [`rajdbg1971.netlify.app`](https://rajdbg1971.netlify.app), with realistic developer-style comments and intentional minor bug simulations for resilience coverage.

## What's included

- Live smoke tests for visible production anchors (`tests/smoke.spec.ts`)
- Mock API contract harness with bug simulations (`tests/mock-api-harness.spec.ts`)
- Offline banner regression guard (`tests/offline-banner.spec.ts`)
- Manual QA checklist and high-risk scenarios (`qa/MANUAL_SCENARIOS.md`)
- JSON/JUnit/HTML test reports in `test-results/` and `playwright-report/`

## Quick start

```bash
npm install
PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium
npm test
```

## Useful commands

- `npm test` -> full suite
- `npm run test:mock` -> only mock API harness
- `npm run test:headed` -> run with headed browser
- `npm run test:ui` -> Playwright UI mode
- `npm run report` -> open HTML report

## CI

GitHub Actions workflow: `.github/workflows/playwright.yml`

- Runs on push/pull_request and manual dispatch
- Installs Chromium + dependencies
- Runs suite against `BASE_URL=https://rajdbg1971.netlify.app`
- Uploads `playwright-report/` and `test-results/` artifacts

## Triage flow for failures

1. Open `playwright-report/index.html` and identify first failing test.
2. Check `test-results/` for screenshot/video/trace tied to that test.
3. If failure is copy/selector drift, confirm live deploy changed content.
4. If failure is API-shape drift, update fixtures in `fixtures/api/` first, then assertions.
5. For flaky behavior, annotate test with a concise reason and link to issue ID.

## Notes

- This suite intentionally keeps a "human" QA tone and includes minor realistic bug-sim cases (missing fields, rate limiting).
- Some fully authenticated and data-mutating flows are kept in manual QA until stable test credentials and contract docs are available.
