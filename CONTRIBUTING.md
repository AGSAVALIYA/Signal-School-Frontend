# Contributing

Read [AGENTS.md](AGENTS.md) first: setup, project map and the rules every change must follow.

## Workflow
1. Open or pick an issue; describe the problem as the teacher or clerk experiences it.
2. Branch from `main` (`feature/<short-name>` or `fix/<short-name>`); keep commits focused, message = what and why,
   ending with `Fixes #<issue>`.
3. Before pushing: `npm run lint && npm test && npm run build`, and `npx playwright test` against a seeded API for UI changes.
4. Pull request to `main` with before/after screenshots at phone width for visual changes; CI must be green.
   If the change needs a new API, link the API pull request.

## UX rules of thumb (for non-technical users)
- One obvious primary action per screen; big buttons; no icon-only buttons without a label or tooltip.
- Plain words from teachers, in all four languages; no jargon such as "submit", "sync" or "entity".
- Always confirm success ("Saved at 09:10") and never lose input on an error.
- Test at 360 px and with **Me → Text size → Extra large**.
