# Changelog

All notable changes to the Signal School web app. Format: [Keep a Changelog](https://keepachangelog.com/);
versions: [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed
- Attendance: P / A / L buttons per child instead of tap-to-cycle; counts as coloured chips (#3).

### Added
- Text size setting (Normal / Large / Extra large) under Me (#4).
- Activity log filters by person and kind of change, with paging (#5).
- "Is this child already in the school records?" check when adding a student.
- Dashboard card for children absent several school days in a row, with call/WhatsApp.
- Calendar of a child's attendance for any month (Past years tab).
- `AGENTS.md`, `CONTRIBUTING.md`, README screenshots and `npm run screenshots` (#7).

### Fixed
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
