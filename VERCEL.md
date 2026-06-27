# Deploy NVP Labs to Vercel

This project is configured to deploy the **entire app** (React frontend + FastAPI backend) to Vercel.

```
/api/index.py        → Vercel Python serverless function (FastAPI)
/frontend/           → React app (CRA)
/requirements.txt    → Python deps for the serverless function
/vercel.json         → Build + routing config
```

## Step 1 — Create a MongoDB Atlas cluster (free)

1. Go to https://cloud.mongodb.com → create a free **M0** cluster.
2. Add a Database User (username + password). Save the password.
3. In **Network Access**, add IP `0.0.0.0/0` (allow from anywhere). Required because Vercel uses dynamic IPs.
4. Click **Connect → Drivers → Python** and copy the SRV connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 2 — Push this repo to GitHub

```bash
cd /app
git init
git add -A
git commit -m "Initial NVP Labs"
gh repo create nvp-labs --public --source=. --remote=origin --push
# or push to your existing repo
```

## Step 3 — Import the project on Vercel

1. Go to https://vercel.com/new → **Import Git Repository** → pick your repo.
2. Framework Preset: **Other** (the `vercel.json` does the rest).
3. Leave the build command / output dir as detected (they come from `vercel.json`).
4. Add the following **Environment Variables** in the Vercel UI before clicking *Deploy*:

   | Key | Example value | Notes |
   |-----|---------------|-------|
   | `MONGO_URL` | `mongodb+srv://...` | From step 1 |
   | `DB_NAME` | `nvplabs` | Whatever you like |
   | `JWT_SECRET` | (64-char random string) | `openssl rand -hex 32` |
   | `ADMIN_EMAIL` | `nvplabs@gmail.com` | Google login with this gets admin |
   | `ADMIN_PASSWORD` | (strong password) | Used as fallback email/password admin login |
   | `COOKIE_SECURE` | `true` | Required on https |
   | `COOKIE_SAMESITE` | `lax` | Default; cookies work same-origin |
   | `CORS_EXTRA_ORIGINS` | *(leave empty)* | Only set if you add a custom domain that isn't `*.vercel.app` |

5. Click **Deploy**.

## Step 4 — Test the deployment

Once deployed at `https://your-app.vercel.app`:

1. Visit `/api/health` — should return `{"status":"ok"}`.
2. Visit `/login` → click **Continue with Google** → log in with `nvplabs@gmail.com` → you should land on `/admin`.
3. From `/admin`, add some products, then visit `/products` as a logged-in client and place a test order.

## Step 5 — Custom domain (optional)

In Vercel: **Project → Settings → Domains** → add `nvplabs.com` (or whatever). DNS pointer is shown in the dashboard.

If your domain is **not** under `*.vercel.app`, set `CORS_EXTRA_ORIGINS=https://yourdomain.com` so the CORS allowlist covers it.

---

## Known Vercel limitations to keep in mind

- **Function timeout**: 30 seconds (set in `vercel.json`). Long-running tasks (large CSV exports, AI calls) may need to be moved to a separate worker.
- **Cold start ≈ 0.5–2 s** for the Python function. Subsequent requests are warm.
- **File uploads**: the function's `/tmp` is ephemeral. Use S3 / Cloudinary if you add uploads later.
- **WebSockets**: not supported on Vercel functions. Use Server-Sent Events or an external Pusher/Ably instead.

## Going back to Emergent

Nothing about the Vercel setup breaks the Emergent deployment. The same code base runs in both — Vercel uses `api/index.py` + the cookie env vars, Emergent uses supervisor + the unchanged defaults. Switch by deploying from whichever platform you prefer.
