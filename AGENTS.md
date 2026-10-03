# AGENTS.md — working in Signal-School-Frontend

Brief for anyone (human or AI coding agent) changing this repository. Product, API and architecture docs live in the
sibling repo **Signal-School-Backend** (`docs/`, `AGENTS.md`).

## What this is
The web app (installable PWA) for Signal School. Users are mostly **non-technical teachers on cheap Android phones with
patchy internet**, reading Marathi, Hindi, Gujarati or English. Every decision favours: few taps, big targets, plain
words, never losing data. Stack: React 19, MUI 9, React Router 7, TanStack Query 5, react-hook-form + zod, i18next,
Vite 8 + vite-plugin-pwa, Vitest, Playwright.

## Commands
```bash
npm ci
npm run dev            # http://localhost:5173 — proxies /api and /files to the API on :3000 (start it first)
npm run lint           # ESLint 9 flat config, incl. i18next/no-literal-string
npm test               # Vitest unit tests (locale parity, offline queue, components, utils)
npm run build          # production build + service worker
npx playwright test    # e2e at 360×740 and 1280×800; needs the API running with `npm run db:seed` data
npm run screenshots    # refresh docs/screenshots (same requirement)
E2E_BASE_URL=http://localhost:8080 npx playwright test   # e2e against the Docker stack (`npm run stack -- demo` in the API repo)
docker build -t signal-school-web .                      # nginx image (docker/nginx.conf.template)
```
Demo logins (password `password123`): `owner@demo.test`, `clerk@demo.test`, `sunita@demo.test` (teacher), `rahul@demo.test`.

## Map
| Path | What |
|---|---|
| `src/api/` | `client.js` (axios, token refresh, errors → `{ code, fields }`), `hooks.js` (`useGet`, `useSend`), `session.js` (shared across tabs) |
| `src/app/` | `App.jsx`, `routes.jsx` (lazy + `perm`), `AppLayout.jsx` (`NAV`, teacher bottom tabs), `AuthContext`, `YearContext`, `ErrorBoundary`, `theme.js` |
| `src/features/<area>/` | One folder per screen area (today, attendance, students, diary, syllabus, marks, health, classes, staff, years, holidays, school, dashboard, audit, profile, auth) |
| `src/shared/` | `components/` (ui, fields, PhotoPicker, SectionSelect, ContactButtons), `hooks/` (useNotify/useAction, useConfirm, useDraft, useTextSize…), `utils/` (format, permissions) |
| `src/i18n/locales/{en,hi,mr,gu}.json` | Every visible string |
| `e2e/` | Playwright: `smoke.spec.js` (all pages × roles, journeys), `a11y.spec.js` (axe WCAG 2.1 AA scan of every screen), `screenshots.spec.js` |

## Invariants — do not break
1. **No literal UI text.** Use `t('area.key')`; add the key to **all four** locale files with the same `{{placeholders}}`
   (plurals: `_one`/`_other`). `npm test` fails otherwise. Use the words teachers use; keep the same word for the same
   thing across a language (e.g. Hindi "उपस्थिति", "सहेजें"; Marathi "हजेरी", "जतन करा"; Gujarati "હાજરી", "સાચવો").
2. **MUI 9 APIs:** layout props go in `sx` (`<Stack sx={{ gap: 1, alignItems: 'center' }}>`, `<Typography sx={{ color: 'text.secondary' }}>`);
   `Grid size={{ xs: 12, md: 6 }}`; inputs use `slotProps={{ input, htmlInput, inputLabel }}`. Old props are silently ignored.
3. **Phones first:** must work at 360 px with no sideways page scroll (e2e checks it), touch targets ≥ 44 px, and at 130% text size.
   Wide tables either get a stacked phone layout (see Marks) or scroll inside a `role="region"` with `tabIndex={0}`.
   **Accessible:** `a11y.spec.js` must stay at zero violations — label progress bars and icon buttons, keep contrast ≥ 4.5:1,
   never put non-`li` children in a `<List>` (use `component="div"`/`"nav"` for lists of buttons).
4. **Server is the authority.** `can(role, perm)` only hides UI; keep `shared/utils/permissions.js` in sync with the API's matrix.
5. **Errors:** show `t('errors.' + err.code)` (via `useAction`/`useNotify`/`ErrorState`), keep the user's input, map field errors with `applyServerErrors`.
6. **Data:** fetch with `useGet(url, params)`; mutate with `useSend(fn, { invalidate: ['/prefix'] })`. Query keys include school and year.
7. **Past years are read-only:** hide write actions when `useYear().readOnly`.
8. **Offline attendance** goes through `features/attendance/offlineQueue.js`: temporary errors keep the item, refusals are shown; logout clears it.
9. **Children's data:** never log it, never send it to third parties; WhatsApp/call links only open the user's own apps.

## Adding a screen (checklist)
- [ ] `src/features/<area>/<Page>.jsx`, route in `app/routes.jsx` with `perm`, menu entry in `NAV` if needed.
- [ ] Strings in en/hi/mr/gu.
- [ ] Add the path for the relevant roles to `PAGES` in `e2e/smoke.spec.js` and `e2e/a11y.spec.js`; add a journey test if it has a task flow.
- [ ] `npm run lint && npm test && npm run build`, and e2e against a seeded API.
- [ ] `CHANGELOG.md` entry; update screenshots if the screen is in the README.

## Gotchas
- `useDraft(source)` resets local edits when the server object changes; don't copy server data into `useState` by hand.
- The service worker caches some GET endpoints (see `vite.config.js`); logout deletes that cache.
- List avatars use `thumbUrl` (160 px) with `loading: 'lazy'`; `photoUrl` is the full photo, only for profile pages.
- `Intl.Segmenter` is used for initials (Indic grapheme clusters); there is a code-point fallback.
- Playwright uses the preinstalled Chromium at `/opt/pw-browsers/...` when present (see `playwright.config.js`).
