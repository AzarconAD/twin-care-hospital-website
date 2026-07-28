# AGENTS.md

Instructions for AI coding agents (Claude Code, Cursor, Copilot, etc.) working in this repository. Human contributors should read `README.md` and `TEAM_GUIDE.md` instead.

## Project overview

Twin Care Hospital Incorporated — a marketing/info website with an admin dashboard for contact inquiries. Built by a solo developer (3rd-year Computer Engineering student) learning the MERN stack. Favor simple, readable solutions and well-commented code over unnecessary abstractions.

## Tech stack

- **Frontend:** React 18 + Vite, React Router, Tailwind CSS, Framer Motion — in `client/`
- **Backend:** Node.js + Express, MongoDB (Mongoose), Nodemailer, session auth — in `server/`
- **No TypeScript.** Keep it that way unless explicitly asked.

## Setup & commands

```bash
# Frontend
cd client
npm install
npm run dev        # http://localhost:5173
npm run build       # production build

# Backend
cd server
npm install
cp .env.example .env   # then fill in real values, see comments in that file
npm run dev          # http://localhost:5000
```

There is no test suite yet. If you add one, use Vitest for the client (keeps it consistent with Vite) and document the run command here.

## Project structure

```
client/src/
  pages/         one component per route (Home.jsx, About.jsx, Services.jsx, Doctors.jsx, Contact.jsx)
  components/    shared UI (Navbar, Footer, Button, Card)
  data/          placeholderData.js — all hospital content (services, doctors) lives here
server/
  index.js       Express app entry, CORS + JSON middleware, mounts routes
  routes/        one file per route group (currently just contact.js)
```

## Conventions

- **Content vs. code separation:** hospital-specific text (service names, doctor bios, contact info) belongs in `client/src/data/placeholderData.js`, not hardcoded inside page/component JSX. When asked to update copy, edit the data file first and check whether the component already reads from it before hardcoding new strings.
- **Design tokens live in `tailwind.config.js`:** colors (`primary`, `secondary`, `accent`, `cream`, `ink`) and fonts (`font-display`, `font-body`, `font-mono`) are defined there. Use those token classes (e.g. `text-primary`, `font-display`) instead of raw hex values or arbitrary Tailwind colors like `text-blue-600`.
- **Component style:** functional components, hooks (`useState`/`useEffect`), no class components. Keep components small — one page = one file in `pages/`, reusable pieces extracted to `components/`.
- **Placeholder content stays labeled:** anything not yet confirmed by the actual hospital should keep a `[Placeholder]` marker in the text so it's obviously not final.
- **Comments:** this codebase is a learning project — prefer a few extra explanatory comments over terse, uncommented code, especially in `server/`.

## Environment variables (server only)

Defined in `server/.env` (never commit this — it's gitignored). Template is `server/.env.example`. Required: `PORT`, `CLIENT_URL`, `HOSPITAL_INBOX_EMAIL`, `SMTP_EMAIL`, `SMTP_PASSWORD`.

## Git workflow — please follow this even when acting autonomously

- Never commit or push directly to `main`. Work on a branch named `feature/<short-description>` or `fix/<short-description>`.
- Commit message format:
  ```
  TYPE - {file(s)}: {summary}
  - {sub-point if needed}
  ```
  `TYPE` is one of `FEAT`, `FIX`, `STYLE`, `DOCS`, `CHORE`.
- Don't merge your own PRs — leave them open for human review.
- Never commit `.env`, `node_modules/`, or `dist/` — already covered by `.gitignore`; don't work around it.

## Things not to do

- Don't use TypeScript or add complex frontend frameworks (e.g., Next.js) unless explicitly requested.
- Don't introduce new npm dependencies for things achievable with what's already installed.
- Don't rewrite the design tokens or swap fonts without being asked.
- Don't remove `[Placeholder]` markers or invent real-sounding hospital details (names, addresses, phone numbers) — flag what's still needed instead.