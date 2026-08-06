# Twin Care Hospital Inc. — Website

Informational website for Twin Care Hospital Incorporated, built as a solo internship side project.

**Stack:**
- Frontend: React (Vite) + Tailwind CSS + React Router + Framer Motion
- Backend: Node.js + Express + MongoDB (via Mongoose), hosted on MongoDB Atlas

## Project structure

twincare-hospital/
├── client/ React + Tailwind app (everything visitors see)
└── server/ Express API (Services, Doctors, Contact, and later Admin auth)


Two separate apps on purpose — the client deploys to Vercel and the server to Render, independently.

## Getting started

### 1. Frontend (client)

```bash
cd client
npm install
npm run dev
```

Opens at `http://localhost:5173`.

### 2. Backend (server)

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env` with a real `MONGODB_URI` from your MongoDB Atlas cluster (see comments in `.env.example`), then:

```bash
npm run dev
```

Runs at `http://localhost:5000`. The frontend calls this locally at `http://localhost:5000/api/...` while developing.

## AI agent context

If you're an AI coding agent working on this project, read `AGENTS.md` first — it has the current
architecture, design system, and rules that supersede any older assumptions baked into this README
or leftover comments elsewhere in the code.

## Recent Updates

- **Architecture Refactor**: Separated the single-page scroll layout into independent routes (`/`, `/about`, `/services`). Replaced `ScrollLink` and scroll spy logic with standard React Router `NavLink`s.
- **News Section**: Added a dynamic News & Updates section to the Home page, connected to an interactive featured news card in the Hero component.
- **Global Scaling**: Root font-size adjusted to `112.5%` for optimal proportional sizing.
- **Styling**: Standardized descriptive text to blue (`text-primary/70`). Replaced hardcoded button colors with CSS variables synced to the Tailwind theme. Added `.btn-fill` and `.secondary-button` custom animated button classes.
- **Scroll Navigation**: *Deprecated.* We previously used a single-page architecture with `ScrollLink`, but the site has since been refactored to use standard, separate routes for each page.
- **Maintenance**: Cleaned up dead CSS classes and removed form debug logs.

## Git workflow (solo project)

- Commit directly to `main` — small, frequent commits, no PR process needed since it's just one person
- Commit message format: `TYPE - {file(s)}: {summary}`, with bullet sub-points for individual changes
- Use a separate branch only before a risky change you might want to revert easily

## Design system

- Colors: red `#E63946`, green `#10B981`, blue `#0544AB`, plus neutral ink/paper/white/border — used
  functionally (e.g. Services categories), not just decoratively
- Fonts: Fraunces (headings), Inter (body), IBM Plex Mono (small labels)
- See `AboutSection.jsx` or `ServicesSection.jsx` for the reference implementation of both

## Placeholder content

Real hospital content (logo, doctor bios, exact services, address, hours) isn't fully in yet.
Placeholder data currently lives directly inside each component as a `default...` array/prop
(e.g. `defaultServices` in `ServicesSection.jsx`, `defaultDoctors` in `Doctors.jsx`) — edit those
arrays directly, or once Phase 5 (backend integration) is done, this data will come from MongoDB
instead. `client/public/hospital-bg.jpg` is a real photo of the hospital building, already in use.

## Deployment (once ready)

- **Frontend:** deploy `client/` to Vercel (auto-deploys from GitHub on push to `main`)
- **Backend:** deploy `server/` to Render. Set the same env vars from `.env.example` in its dashboard
- **Database:** MongoDB Atlas (already cloud-hosted, no separate deployment step)
- After deploying the backend, update the API base URL the frontend calls from `localhost:5000` to
  the live Render URL

## Pages
**Public Routes:**
- `/` — Hero + News Section
- `/about` — Overview + TWIN CARE Core Values
- `/services` — Services and Departments (Live DB)
- `/doctors` — Monthly schedule calendar, daily schedule modal with time slots (Live DB)
- `/contact` — Location info, General Contact (Live DB), and Appointment form (UI only)

**Admin Routes (Session Auth):**
- `/admin/login` — Admin authentication
- `/admin/dashboard` — Submissions dashboard
- `/admin/doctors` — Doctor CRUD and schedule management
- `/admin/news` — News CRUD management
