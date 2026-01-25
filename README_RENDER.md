# Deploying this MERN app to Render

This repository is a monorepo containing `backend/` (Express + Mongoose) and `frontend/` (React) folders. The provided `render.yaml` config is set up to deploy:

- `mern-ecom-backend` — Node web service (uses `backend/server.js`).
- `mern-ecom-frontend` — Static site (build output from `frontend/build`).

Quick manual steps
1. Push your repo to GitHub (or other Git provider).
2. Go to https://dashboard.render.com and create a new service using "Create new" → "Blueprint from repository" or "Connect a repository".
3. Choose **Import via render.yaml** (recommended) or create two services manually:
   - Web Service (Backend): set root to `backend`, start command `node server.js`.
   - Static Site (Frontend): set root to `frontend`, build command `npm install && npm run build`, publish directory `build`.
4. After creating the backend service, set these Environment Variables in Render (use the Secrets UI — do NOT commit secrets into repo):
   - `MONGO_URI` — your MongoDB connection string
   - `JWT_SECRET` — your JWT secret
   - `FRONTEND_URL` — the URL where frontend will be hosted (e.g. `https://my-frontend.onrender.com`)
   - `BACKEND_URL` — the backend public URL (e.g. `https://my-backend.onrender.com`)
   - `STRIPE_API_KEY`, `EMAIL_USER`, `EMAIL_PASS`, etc. as used by your app

Notes & troubleshooting
- CORS / Cookies: This app uses cookie-based auth. Ensure the frontend domain is allowed and, for production, cookies are sent with `sameSite` and `secure` flags as appropriate. If authentication fails, check Network → Request Headers → `Cookie` to ensure cookies are present.
- Build errors: If the frontend build fails on Render, check the full build logs. Locally test building first with:

```bash
cd frontend
npm install
npm run build
```

- Logs: Use Render's real-time logs (Dashboard → your service → Logs) to inspect server startup errors, env var values, and request handling.

Advanced: If you want the backend to serve the frontend (single service), build the frontend locally or in a build step and copy `frontend/build` into `backend/public` and let Express serve static files. I can add that wiring if you prefer a single deploy.
