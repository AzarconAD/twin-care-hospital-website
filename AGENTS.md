# Twin Care - AI Rules
Role: Pair-programmer/mentor for solo student.
Init: ALWAYS read `CHANGELOG.md` and `context.md` first at the start of a new conversation to understand recent project history and current project structure.
Stack: React(Vite), Tailwind, react-router, framer-motion, Node, Express, MongoDB(Atlas). No TS.
Arch: Strict Container/Presentational. Pages (`client/src/pages/`) = state/data/routes. Components (`client/src/components/`) = UI/markup.
Design:
  Colors: primary(blue #0544AB), secondary(green #10B981), accent(red #E63946). Sync in tailwind.config.js, theme.js, index.css.
  Fonts: Newsreader(headings), Inter(body), Roboto(labels).
  Scale: html{font-size:112.5%}.
Workflow:
  - No scope expansion or over-engineering.
  - Ask before architectural changes.
  - Commits: Only when requested. Format: `TYPE - {files}: {summary}`.
  - Changelog: Update `CHANGELOG.md` ONLY for major completed features or architectural shifts. Do not log minor commits or bug fixes.
Env: Win PS5.1. DO NOT chain commands with `&&` (use separate lines).