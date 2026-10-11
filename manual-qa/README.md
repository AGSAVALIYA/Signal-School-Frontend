# Manual testing (QA)

Everything a tester needs to check Signal School by hand, as a teacher, office clerk, principal and trust owner would
use it, on a phone and on a computer.

| File | What it is |
|---|---|
| `Signal-School-QA-Guide.pdf` | **Start here.** What Signal Shala is, what the app does, how to test, logins and test data (8 pages) |
| `Signal-School-Test-Cases.xlsx` | The test cases (screen, steps, test data, expected result, status, comments), logins, prepared children, a bug sheet and a summary |
| `test-files/` | Photos, a logo, files that must be refused, and Excel/CSV sheets for the student import |

The app must run on the QA data, which the test cases name (children such as Riya Kale and Kiran Thakur, logins such
as `newteacher@demo.test`). It is loaded with `npm run db:seed:qa` in the API repository, or `npm run stack -- qa` for the
Docker setup; running it again resets the data for a new round of testing.

For developers: the Excel and the PDF are built from `scripts/manual-qa/` (`python3 scripts/manual-qa/test_cases.py`
needs `pip install openpyxl`; `node scripts/manual-qa/build-guide.mjs` prints `guide.html`). The QA data is defined in
the API's `scripts/demo/qa.js`; keep the three in step.
