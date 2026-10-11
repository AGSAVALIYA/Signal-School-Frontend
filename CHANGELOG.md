# Changelog

All notable changes to the Signal School web app. Format: [Keep a Changelog](https://keepachangelog.com/);
versions: [Semantic Versioning](https://semver.org/).

## Unreleased

### Added
- **School looks (themes)**, chosen by the principal under School settings → Look and applied to everyone in the
  school: *Signal Shala* (default, the school website's red and traffic-light colours, DM Sans / Radio Canada Big),
  *Blackboard*, *Notebook*, *Marigold*, *Calm teal* (the previous look) and *Easy to read* (high contrast, larger
  letters). Each has its own colours, fonts, shapes, surfaces and icon set; there is no dark look. "Try it" previews a
  look on the principal's screen only until it is saved. Contrast is checked by unit tests and every look passes the
  axe scan (`e2e/looks.spec.js`).
- Bottom tabs on phones for every role (the four daily screens plus "More" with large tiles); the side menu on wider
  screens is grouped into daily work, school setup and other.
- `manual-qa/`: a testing guide (PDF), 116 test cases for teachers, office, principal, owner, looks and phones (Excel
  with status, comments, a bug sheet and a summary) and files to upload, all matching the API's QA data
  (`npm run db:seed:qa`). Built from `scripts/manual-qa/`.

### Changed
- Redesigned for teachers: a greeting card with today's to-do on the teacher home, class cards with clear done /
  not-done state, stat cards with icons, children shown with their faces and call / WhatsApp buttons in one row,
  classes as cards instead of a table on the attendance overview, absent rows tinted on the attendance sheet with the
  counts staying visible while scrolling, a profile card on the child's page, settings cards on Me, a branded login
  screen, list skeletons while loading, an "add student" button within thumb reach on phones, and empty states that
  say what to do next.
- Icons, fonts and colours come from the look (`useIcons()`, palette), never hard-coded in screens.
- Attendance: P / A / L buttons per child instead of tap-to-cycle; counts as coloured chips (#3).
- Student list, attendance sheet and staff list show small photo thumbnails (`thumbUrl`, lazy-loaded) instead of
  downloading every full photo.
- Faster on cheap phones (measured with the CPU slowed 4×): one attendance tap 141 → 16 ms, one keystroke in marks
  188 → 17 ms, one change in the new-year wizard with 1,200 children 5.5 s → 0.14 s (memoised rows).
- First download 313 → 244 KB (gzip): other languages, the form libraries and unused font subsets load only when
  needed; the offline cache on first visit is 1.4 MB instead of 2.0 MB.
- Student list and activity log keep the current rows on screen while more rows, a search or the next page load.
- Student list: ticking "Search all years" also shows children who left or finished school (it was limited to those
  studying, so a former student could not be found); one "Add student" button on phones when the list is empty.
- Attendance sheet for the office clerk is view-only with an explanation, instead of a Save button that was refused.
- Import problems name the field as on the form ("Date of birth: …") instead of the sheet column ("date_of_birth: …").

### Added
- `Dockerfile` (Vite build served by nginx with the API proxied under `/api` and `/files`); CI builds it.
- Text size setting (Normal / Large / Extra large) under Me (#4).
- Activity log filters by person and kind of change, with paging (#5).
- "Is this child already in the school records?" check when adding a student.
- Dashboard card for children absent several school days in a row, with call/WhatsApp.
- Calendar of a child's attendance for any month (Past years tab).
- `AGENTS.md`, `CONTRIBUTING.md`, README screenshots and `npm run screenshots` (#7).

### Fixed
- Photos stored in Cloudflare R2 were blocked by the content security policy (only AWS S3 was allowed).
- Vercel previews/deploys: `vercel.json` declares the Vite build (`dist/`), SPA routing and security headers
  (the project was still configured for the old Create React App `build/` output).
- Accessibility (axe WCAG 2.1 AA, every screen): labelled progress bars, readable avatar colours, valid list markup,
  keyboard-reachable scrolling tables, photo button visible to screen readers, calendar semantics.
- Marks on phones: one block per child instead of a sideways-scrolling table; "Maximum marks for everyone" fill-in.
- Register and Marks no longer flash "no classes" while classes are loading.
- Text size buttons show a sample letter and fit a phone; dashboard call/WhatsApp buttons no longer squeeze names.
- Avatar initials keep Hindi, Marathi and Gujarati syllables whole (#6).
- Student form no longer leaks an internal layout prop to the page.
- Hindi, Marathi and Gujarati messages use the same words as the buttons they mention.

## 1.0.0

First release for Signal School: React 19 + MUI 9 PWA; teacher home and one-screen attendance that works offline;
students with import, history, health check-ups and leaving certificate; diary with photos; syllabus; marks and report
cards; classes, staff, academic-year wizard; principal dashboard with call/WhatsApp to families in their language;
English, हिंदी, मराठी and ગુજરાતી throughout.
