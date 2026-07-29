# Skill: Admin Auth

Only relevant once explicitly asked to build `/admin/login` or `/admin/dashboard`.
Not needed for any other task — do not load unless building this feature.

## Requirements
- Password hashing: `bcryptjs`
- Sessions: `express-session` + `connect-mongo`
- Single admin account only — created via a one-time seed script, not a public signup route
- Routes: `/admin/login` (public), `/admin/dashboard` (protected, session-gated)