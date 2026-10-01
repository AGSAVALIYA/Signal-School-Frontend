# System Review & Improvement Plan (round 1)

The full review covers the **frontend and the backend together**. It lives in the backend repository so there is a single source of truth:

**`Signal-School-Backend/docs/system-review/`** (branch `ccr-61b11ce9-g6fan3`)

| Doc | Contents relevant to this repo |
|---|---|
| `01-inventory.md` §4–5, §7 | Every page and component of this app, with tester feedback and recommendations |
| `03-test-cases.md` | UI test cases (teacher and admin), language, accessibility and UX sessions |
| `04-ux-walkthrough.md` | Non-technical teacher/principal journeys and redesigned screens |
| `05-issues-register.md` | Frontend bugs (FE paths with line numbers), performance, code quality |
| `06-multilingual-design.md` | Replacing GTranslate with i18next (en/hi/mr/gu) |
| `09-folder-structure-and-conventions.md` §2 | Target Vite + feature-folder structure for this repo |
| `10-implementation-plan.md` | Phased plan; frontend tasks in every phase |

Top frontend issues: the admin student "Academics" tab shows fake grades (BUG-029); the teacher list filter/sort crashes (BUG-040); chapter delete never sends auth (BUG-031); "Mark topic completed" shows an error after succeeding (BUG-032); unmarked students are shown as "Absent" (BUG-019); no handling of expired sessions (BUG-044); multi-language is a Google Translate overlay (BUG-067).
