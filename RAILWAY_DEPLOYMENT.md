# Deploying APR Services to Railway (Frontend + Backend)

This project is configured to run both the **React / Vite Frontend** and the **Node.js / Express Backend** inside a single, high-performance, multi-stage Docker container.

---

## 🏗️ Architecture Overview

- **Single Container Deployment**: The Express server serves both `/api/*` REST endpoints and the compiled React SPA static files from `/app/dist`.
- **Automatic Schema Initialization**: When the server starts up, it automatically connects to PostgreSQL and applies idempotent schema definitions (`backend/src/db/schema.ts`).
- **Zero CORS Friction**: Since the frontend and backend are served from the same domain, API calls route smoothly with full cookie and session support.

---

## 🚀 Step-by-Step Railway Deployment

### Step 1: Push Changes to GitHub
Make sure the new `Dockerfile`, `.dockerignore`, `railway.json`, and updated `backend/src/server.ts` are committed and pushed to your repository:
```bash
git add .
git commit -m "feat: add multi-stage Dockerfile and Railway configuration"
git push origin main
```

### Step 2: Create a New Project on Railway
1. Go to [Railway Dashboard](https://railway.com/dashboard).
2. Click **"New Project"** -> **"Deploy from GitHub repo"**.
3. Select your repository (`Vivek-Jha-05/B2B-Procurement-website` or your repo name).
4. Railway will automatically detect the root `Dockerfile` and `railway.json`.

### Step 3: Add Environment Variables in Railway
In your Railway service dashboard, navigate to the **"Variables"** tab and add the following environment variables:

| Variable | Description | Example / Note |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode | `production` |
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://user:pass@ep-xyz.neon.tech/dbname?sslmode=require` |
| `JWT_SECRET` | Secret for Access Tokens | Secure random string (e.g. `openssl rand -hex 32`) |
| `JWT_REFRESH_SECRET` | Secret for Refresh Tokens | Secure random string (e.g. `openssl rand -hex 32`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | (From your Cloudinary dashboard) |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | (From your Cloudinary dashboard) |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | (From your Cloudinary dashboard) |
| `RESEND_API_KEY` | Resend API Key for emails | `re_...` |
| `EMAIL_FROM` | Verified sender email | `info@b2b.vivek-jha.me` or your domain |
| `EMAIL_TO` | Inquiries recipient email | `owner@example.com` |
| `EMAIL_REPLY_TO` | Reply-to email | `Aprservices20@gmail.com` |
| `INITIAL_ADMIN_EMAIL` | Default Admin Email | `admin@example.com` |
| `INITIAL_ADMIN_PASSWORD`| Default Admin Password | Strong password |

> **Note**: Railway automatically provides the `$PORT` environment variable. Do not hardcode `PORT`.

### Step 4: Generate a Public Domain
1. In the Railway Service dashboard, go to **"Settings"** -> **"Networking"**.
2. Click **"Generate Domain"** (e.g., `apr-services.up.railway.app`) or attach a custom domain (e.g., `b2b.vivek-jha.me` / `aprsvs.com`).

---

## 🗄️ Database Initialization & Seeding

### Automatic Migration
The database schema (`initSchema()`) runs automatically when the container boots up. All table creations (`CREATE TABLE IF NOT EXISTS`) and migrations are idempotent.

### Running the Seed Script (Optional)
If you want to seed initial categories, certifications, products, and admin credentials into your production database:

**Option A: Using Railway CLI**
```bash
railway run npm run seed --prefix backend
```

**Option B: Locally against your remote database**
Set `DATABASE_URL` in `backend/.env` to your remote database and run:
```bash
cd backend
npm run seed
```

---

## 🐳 Testing Docker Locally

If you have Docker installed on your development machine:

### Build and Run with Docker:
```bash
# Build the Docker image
docker build -t apr-services-fullstack .

# Run the container
docker run -p 3001:3001 --env-file backend/.env apr-services-fullstack
```

### Or using Docker Compose:
```bash
docker-compose up --build
```
Then visit `http://localhost:3001` in your browser.

---

## 🔍 Health Check & Monitoring

- Health check endpoint: `GET /api/health`
- Logs: View real-time logs in the Railway dashboard or via `railway logs`.
