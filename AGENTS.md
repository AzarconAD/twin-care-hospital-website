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
red `#E63946` · green `#10B981` · blue `#0544AB` · ink `#1C1E1F` · paper `#FAFAF9` · white `#FFFFFF` · border `#E7E7E5`

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