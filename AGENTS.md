# Project: Twin Care Hospital Website

## Context
Solo developer (student), beginner with React/Node/Tailwind but comfortable with core HTML/CSS/JS.
Internship side project, no hard deadline. Keep code simple, well-commented, minimal dependencies.
Explain non-trivial logic briefly in comments.

## Tech Stack (fixed — do not change or add alternatives)
- Frontend: React (Vite) + Tailwind CSS + React Router + Framer Motion
- Backend: Node.js + Express + MongoDB via Mongoose, hosted on MongoDB Atlas
- No TypeScript

## Database Status
MongoDB IS used in this project. Any earlier note saying "no database" is outdated — ignore it.
Used for: Services, Doctors, Contact form submissions, and (later) a single Admin account for login.

## Site Structure
- `/` — Home page: Hero, About, and Services sections stacked as one scrollable page
  (anchors: `#home`, `#about`, `#services`)
- `/doctors` — own route, doctor cards
- `/contact` — own route, public contact form
- `/admin/login` and `/admin/dashboard` — planned, not yet built. Do not build until explicitly asked.

## Navbar Behavior
- Sticky at top; transparent/minimal at page top, becomes solid background after scrolling down
- Uses real logo file
- "Home"/"About"/"Services" links scroll to the matching section on `/` (navigate to `/` first if on another page)
- "Doctors" and "Contact" links are normal route navigation

## Design System
Colors (functional, not just decorative — e.g. Services uses these to color-code categories):

red: 
#E63946
green: 
#10B981
blue: 
#0544AB
ink: 
#1C1E1F
paper: 
#FAFAF9
white: 
#FFFFFF
border:
#E7E7E5

Fonts: 'Fraunces' (display/headings), 'Inter' (body), 'IBM Plex Mono' (small labels/eyebrows).
Match existing components (`AboutSection.jsx`, `ServicesSection.jsx`) for spacing, card style, and
Framer Motion animation patterns (`whileInView` + `viewport={{ once: true }}`) in any new component.

## Images
- `client/public/hospital-bg.jpg` is a REAL photo of the actual hospital building — use it as a real
  photo (e.g. in a card), not as a decorative background.
- Other placeholder photos (stock/picsum URLs) are temporary and should stay clearly swappable —
  don't hardcode them in ways that are hard to find and replace later.

## Admin / Auth (future work — do not build yet unless explicitly asked)
When asked to build this: bcryptjs for password hashing, express-session + connect-mongo for
sessions, single admin account created via a one-time seed script (not a public signup route).

## Workflow Rules
- Build in the phase/task given — do not expand scope or jump ahead to unrequested features
- If a request conflicts with something in this file, ask before proceeding
- After finishing a task, summarize exactly what files were created/changed
- Git commits: small and frequent, format `TYPE - {file(s)}: {summary}` with bullet sub-points