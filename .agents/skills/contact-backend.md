# Skill: Contact Form Backend

Only relevant when wiring the Contact form to MongoDB.

## Requirements
- Mongoose schema: name, email, message, submittedAt (default: Date.now)
- POST /api/contact — validate required fields server-side, save to Mongo, return success/error JSON
- No email notifications yet unless explicitly asked (Nodemailer is in the stack for later)
- Frontend: replace form's current no-op submit with a fetch call to this endpoint; show a simple success/error state