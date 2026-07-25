# Twin Care Hospital Inc. — Website

Info site for Twin Care Hospital Incorporated. Built by [your team name] as an internship side project.

**Stack:** React (Vite) + Tailwind CSS on the frontend, Node.js + Express on the backend (just handles the contact form email).

## Project structure

```
twincare-hospital/
├── client/     React + Tailwind app (everything visitors see)
└── server/     Tiny Express API (just /api/contact, sends an email)
```

Two separate apps on purpose — the client can be deployed to Vercel/Netlify and the server to Render/Railway independently.

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

Fill in `.env` with real values (see comments in the file), then:

```bash
npm run dev
```

Runs at `http://localhost:5000`. The contact form on the frontend sends to `http://localhost:5000/api/contact` while developing locally.

## Team workflow (please read before pushing code)

- `main` branch = always working. Don't push straight to it.
- Create a branch per feature: `git checkout -b feature/doctors-page`
- Commit small and often, push your branch, then open a Pull Request into `main`
- One of us reviews/merges the PR (avoids everyone stepping on each other's files)
- Pull `main` before you start a new session so you're not working on stale code:
  ```bash
  git checkout main
  git pull
  git checkout -b feature/your-thing
  ```

## Placeholder content

Real hospital content (logo, doctor bios/photos, exact services, address, hours) isn't in yet — everything in `client/src/data/placeholderData.js` and the page copy is a placeholder. Swap it out once the hospital sends real material; you shouldn't have to touch component code to do that, just the data file.

## Deployment (once ready)

- **Frontend:** deploy `client/` to Vercel or Netlify (both have free tiers, both auto-deploy from GitHub on push to `main`)
- **Backend:** deploy `server/` to Render or Railway (free tier). Set the same env vars from `.env.example` in their dashboard.
- After deploying the backend, update the API URL the frontend calls (see `client/src/pages/Contact.jsx`) from `localhost:5000` to your live Render/Railway URL.

## Pages

| Page | Status |
|---|---|
| Home | scaffolded, placeholder copy |
| About | scaffolded, placeholder copy |
| Services | scaffolded, placeholder data |
| Doctors | scaffolded, placeholder data |
| Contact | scaffolded, working form wired to backend |
