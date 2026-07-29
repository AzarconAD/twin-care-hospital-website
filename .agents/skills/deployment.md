# Skill: Deployment

Only relevant when deploying or changing deployment config.

## Steps
- client/ → Vercel (auto-deploys from GitHub main)
- server/ → Render, same env vars as .env.example
- After first backend deploy: update frontend's API base URL from localhost:5000 to the live Render URL
- MongoDB Atlas is already cloud-hosted — no separate deploy step