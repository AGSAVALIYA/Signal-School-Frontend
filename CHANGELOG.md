# Changelog

All notable changes to the Signal School web app. Format: [Keep a Changelog](https://keepachangelog.com/);
versions: [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed
- Attendance: P / A / L buttons per child instead of tap-to-cycle; counts as coloured chips (#3).
- Student list, attendance sheet and staff list show small photo thumbnails (`thumbUrl`, lazy-loaded) instead of
  downloading every full photo.
- Faster on cheap phones (measured with the CPU slowed 4×): one attendance tap 141 → 16 ms, one keystroke in marks
  188 → 17 ms, one change in the new-year wizard with 1,200 children 5.5 s → 0.14 s (memoised rows).
- First download 313 → 244 KB (gzip): other languages, the form libraries and unused font subsets load only when
  needed; the offline cache on first visit is 1.4 MB instead of 2.0 MB.
- Student list and activity log keep the current rows on screen while more rows, a search or the next page load.

### Added
- `Dockerfile` (Vite build served by nginx with the API proxied under `/api` and `/files`); CI builds it.
- Text size setting (Normal / Large / Extra large) under Me (#4).
- Activity log filters by person and kind of change, with paging (#5).
- "Is this child already in the school records?" check when adding a student.
- Dashboard card for children absent several school days in a row, with call/WhatsApp.
- Calendar of a child's attendance for any month (Past years tab).
- `AGENTS.md`, `CONTRIBUTING.md`, README screenshots and `npm run screenshots` (#7).

### Fixed
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
