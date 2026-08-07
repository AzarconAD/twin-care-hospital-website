# Twin Care Hospital Inc. — Website

An informational and operational web platform for Twin Care Hospital Incorporated, built as a solo internship side project. 

## 🎯 Purpose of the Website
The goal of this project is to provide a modern, fast, and user-friendly digital presence for Twin Care Hospital. It serves two main purposes:
1. **Public-Facing Portal**: Allows patients and visitors to learn about the hospital's core values, browse medical services, check real-time doctor availability (schedules), and submit contact inquiries.
2. **Admin Dashboard**: A secure, authenticated backend for hospital staff to manage the website's content dynamically. Admins can update doctor profiles, schedule doctor availabilities, manage news announcements, and reply directly to patient contact inquiries via email.

---

## 🏗️ How the Code Works (Architecture)

This is a full-stack application separated into two distinct apps:

### Frontend (`/client`)
- **Stack**: React (Vite), Tailwind CSS, React Router, Framer Motion.
- **Architecture**: Strictly follows the **Container/Presentational pattern**. 
  - `client/src/pages/`: Act as "Containers". They handle routing, data fetching (from the API), and state management.
  - `client/src/components/`: Act as "Presentational" UI components. They are grouped by domain (e.g., `/home`, `/admin`, `/doctors`) and handle purely visual rendering and animations. 
- **Styling**: Tailwind CSS is used alongside custom CSS variables (`index.css`) mapped to a cohesive design system (Newsreader and Roboto fonts, specific brand colors).

### Backend (`/server`)
- **Stack**: Node.js, Express, MongoDB (Atlas), Mongoose.
- **Architecture**: A standard RESTful API.
  - `models/`: Mongoose schemas defining the database structure (Services, Doctors, Schedules, Contacts, News, Admin).
  - `routes/`: Express routers handling CRUD operations. Public routes allow fetching data, while Admin routes are protected by session-based authentication (`requireAuth` middleware).
  - **Email Integration**: Uses `nodemailer` to allow admins to reply to patient inquiries directly from the dashboard.

---

## 🚀 Getting Started (Local Development)

The client and server run completely independently.

### 1. Backend API (Server)
```bash
cd server
npm install
cp .env.example .env
```
1. Fill in `.env` with a real `MONGODB_URI` from your MongoDB Atlas cluster.
2. (Optional) Add Gmail SMTP credentials to test the email reply feature.
```bash
npm run dev
```
*Runs at `http://localhost:5000`.*

### 2. Frontend (Client)
```bash
cd client
npm install
npm run dev
```
*Opens at `http://localhost:5173`. It automatically proxies API requests to the local server.*

---

## 🗺️ How the Website Works (Features & Routes)

### Public Pages
- **`/` (Home)**: Features a dynamic Hero section and live News/Updates fetched from the database.
- **`/about`**: Details the hospital's history and the "TWIN CARE" core values.
- **`/services`**: Displays available medical departments and services (Live DB).
- **`/doctors`**: Features a monthly calendar and daily schedule modal to view doctor availability (Live DB).
- **`/contact`**: Contains location info, an appointment booking form (UI-only), and a general contact form that saves to the database.

### Admin Dashboard (Protected)
- **`/admin/login`**: Secure session-based authentication.
- **`/admin/dashboard`**: View and reply to patient contact submissions (sends real emails via SMTP).
- **`/admin/doctors`**: Full CRUD management for doctor profiles and a scheduling tool to mark doctor availability.
- **`/admin/news`**: Content management for the homepage news feed, including live image previews.

---

## 🤖 AI Agent Context
If you're an AI coding assistant, do **not** rely on this README for your operational rules. You must read `AGENTS.md` and `CHANGELOG.md` upon initialization for the strict architectural rules, design system tokens, and recent project history.

## 🚢 Deployment
- **Frontend**: Deploys to Vercel (auto-deploys from GitHub on push to `main`).
- **Backend**: Deploys to Render. Requires setting the environment variables from `.env`.
- **Database**: Hosted on MongoDB Atlas.
*(Note: After deploying the backend, ensure the frontend's API base URL is updated to the live Render URL).*
