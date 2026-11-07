# Loop Technical Evaluation

A JavaScript and Playwright test suite for the Asana-like demo application.

## Requirements

- Node.js 18 or newer
- npm
- Google Chrome or Playwright's Chromium browser

## Setup

```bash
npm install
npx playwright install chromium
```

## Run the tests

```bash
npm test
```

Run with a visible browser:

```bash
npm run test:headed
```

Open Playwright's interactive test runner:

```bash
npm run test:ui
```

Open the HTML report after a run:

```bash
npm run report
```

## Test coverage

The six scenarios are stored in `test-data/tasks.json`. The test in
`tests/tasks.spec.js` loops over that data, so each scenario reuses the same
login, navigation, task, column, and tag-checking logic.

To add a scenario, add another object to `test-data/tasks.json`; do not copy
and paste another test function.

## Credentials

The evaluation PDF supplies the demo credentials. They are used as defaults
for this local evaluation project:

- Username/email: `admin`
- Password: `password123`

You can override them with environment variables:

PowerShell:

```powershell
$env:APP_EMAIL="admin"
$env:APP_PASSWORD="password123"
npm test
```

## Important validation note

The demo site could not be inspected from this environment, so the login and
board locators are written to use accessible labels, placeholders, visible
text, and conservative fallbacks. Before submitting, run the suite against
the live demo and adjust selectors if its actual markup differs.

In particular, confirm that the task-to-column relationship and tags are
scoped to each task card. The current implementation verifies task visibility,
the expected column text in an ancestor of the task, and required tag text on
the page. If the app exposes stable task-card or column test IDs, prefer those
selectors and scope tag assertions to the matching task card for the strongest
possible checks.

## Suggested GitHub submission

1. Create a public repository named `loop-technical-evaluation`.
2. Upload the project files (do not upload `node_modules`, test results, or
   reports).
3. Run `npm test` and resolve any failures before submitting.
4. Include the repository URL in the Google Form.
5. Record a 2–3 minute walkthrough explaining the JSON-driven test cases,
   shared test logic, and how you validated the results.
