# Signal School — web app (v2)

React 18 + Vite PWA for teachers and school offices. Works on cheap phones, offline attendance, English / हिंदी / मराठी / ગુજરાતી.

## Run

```bash
cp .env.example .env      # VITE_API_URL is optional; dev proxies /api and /files to localhost:3000
npm install
npm run dev               # http://localhost:5173 (start Signal-School-Backend first)
npm test && npm run lint && npm run build
```

Demo logins come from the backend seed (`npm run db:seed`): `owner@demo.test`, `clerk@demo.test`, `sunita@demo.test`, `rahul@demo.test` / `password123`.

## Structure

```
src/
  api/        client.js (axios, token refresh, error normalisation) · hooks.js (useGet / useSend) · session.js
  app/        AuthContext, YearContext, AppLayout (nav), routes.jsx (lazy, permission-filtered), theme
  i18n/       index.js + locales/{en,hi,mr,gu}.json   ← every visible string lives here
  shared/     components/ (ui, fields, PhotoPicker, SectionSelect…) · hooks/ · utils/ (format, permissions)
  features/   one folder per area: today, attendance, students, diary, syllabus, marks, classes,
              staff, years (rollover wizard), holidays, school, dashboard, audit, profile, auth
```

## Conventions

- **Data:** `useGet(url, params)` / `useSend(fn, { invalidate })`. Query keys include school + academic year, so switching either refetches automatically.
- **Academic year:** the header switcher sets `X-Academic-Year`; past years render read-only (`useYear().readOnly`).
- **Permissions:** `can(role, 'perm')` in `shared/utils/permissions.js` mirrors the backend matrix (server stays the authority).
- **Text:** no literal UI strings (ESLint `i18next/no-literal-string`). Add the key to `en.json` and the other three locales; `npm test` fails if any locale is missing a key/placeholder or code uses an unknown key. Plurals use `_one` / `_other`.
- **Errors:** the API returns `{ error: { code, fields } }`; codes map to `errors.*` / `fieldErrors.*` translations.
- **Forms with server data:** `useDraft(source)` gives an editable copy that resets when the data refreshes.
- **Offline:** attendance saves to IndexedDB when offline (`features/attendance/offlineQueue.js`) and syncs on reconnect; the server keeps the newest mark.
- **Printing:** register and report card use browser print (`styles.css` print rules), which renders Indic scripts correctly.

## Adding a feature

1. Create `src/features/<area>/<Page>.jsx`.
2. Register it in `app/routes.jsx` (with `perm`) and, if it needs a menu entry, in `NAV` in `app/AppLayout.jsx`.
3. Add strings to all four locale files.
