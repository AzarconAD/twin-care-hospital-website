# Project: Twin Care Hospital Website

## Context
Solo dev (student), beginner with React/Node/Tailwind, comfortable with core HTML/CSS/JS.
Internship side project, no hard deadline. Simple, well-commented code, minimal deps.
Briefly comment non-trivial logic.

## Stack (fixed — do not change or add alternatives)
React (Vite) + Tailwind CSS + React Router + Framer Motion.
Node.js + Express + MongoDB/Mongoose (Atlas). No TypeScript.

MongoDB is in active use (Services, Doctors, Contact, future Admin) — disregard any older "no database" notes elsewhere.

## Site Structure
- `/` — Home: Hero, About, Services stacked as one scrollable page (anchors `#home`, `#about`, `#services`)
- `/doctors` — own route, doctor cards
- `/contact` — own route, public contact form
- `/admin/login`, `/admin/dashboard` — planned only. Do not build unless explicitly asked — see `.agents/skills/admin-auth.md`

## Navbar
Sticky top; transparent at page top, solid after scroll. Uses real logo file.
Home/About/Services links scroll to the matching section on `/` (navigate to `/` first if on another page).
Doctors/Contact links are normal route navigation.

## Design System
Colors (functional, not decorative — e.g. Services uses these to color-code categories):
red `#E63946` · green `#10B981` · blue `#0544AB` · ink `#1A2E2E` · cream `#F7FAF6` · white `#FFFFFF` · border `#E7E7E5`

> **⚠️ IMPORTANT:** Brand colors exist in *three* places that must be kept manually in sync. If a color changes, you MUST update all three:
> 1. `tailwind.config.js` (Tailwind classes)
> 2. `client/src/theme.js` (Dynamic JS colors)
> 3. `client/src/index.css` (`:root` variables)

Fonts: Fraunces (display/headings), Inter (body), IBM Plex Mono (labels/eyebrows).

Match `AboutSection.jsx` / `ServicesSection.jsx` for spacing, card style, and Framer Motion pattern (`whileInView`, `viewport={{ once: true }}`).

## Images
`client/public/hospital-bg.jpg` is a real photo of the hospital — use as an actual photo (e.g. in a card), not a decorative background.
Other placeholder photos (stock/picsum) are temporary — keep them easy to find and swap later.

## Workflow Rules
- Stay within the given task/phase — no scope expansion
- If a request conflicts with this file, ask before proceeding
- After finishing a task, summarize exactly what files were created/changed
- Commits: small, frequent, format `TYPE - {file(s)}: {summary}` with bullet sub-points
- Deployment steps — see `.agents/skills/deployment.md` (not needed until ready to ship)

## Terminal / Shell

This project's terminal is Windows PowerShell (version 5.1, the Windows default) — NOT bash, NOT
cmd, and NOT PowerShell 7. This matters for command syntax:

- Do NOT chain commands with `&&` (e.g. `git add . && git commit -m "..."`) — this is invalid
  syntax in PowerShell 5.1 and will throw a ParserError every time.
- Instead, run commands as separate lines/steps:
```powershell
  git add .
  git commit -m "TYPE - {file(s)}: {summary}"
```
- If you genuinely need to chain two commands into one line, use `;` instead of `&&` — but be aware
  `;` runs the second command regardless of whether the first succeeded (unlike `&&`, which stops
  if the first command fails). For git add/commit this distinction rarely matters, but don't rely
  on `;` for anything where a failed first command should block the second.