# PDF Maker

Internal tool: write a formatted note and export it as a branded PDF.

## Setup

```
npm run install:all
```

Edit `server/.env` and set `APP_PASSWORD` and `JWT_SECRET` to real values (a `.env.example` is provided as a template).

## Run

```
npm run dev
```

This starts the Express API on `http://localhost:4000` and the Vite dev server on `http://localhost:5173` (client proxies `/api` to the server).

Open `http://localhost:5173`, log in with `APP_PASSWORD`, write your note, and click **Generate PDF**.

## Deployment (Render + Vercel)

Backend on Render, frontend on Vercel — different domains, so a couple of things need to be set explicitly beyond local dev.

**Render (server, root directory `server/`)**
| Variable | Value |
|---|---|
| `APP_PASSWORD` | the shared login password |
| `JWT_SECRET` | a long random string |
| `CLIENT_ORIGIN` | your Vercel URL, e.g. `https://your-app.vercel.app` (optional — restricts CORS; omit to allow any origin) |

`PORT` doesn't need to be set — Render injects it automatically and the server already reads `process.env.PORT`.

**Vercel (client, root directory `client/`)**
| Variable | Value |
|---|---|
| `VITE_API_URL` | your Render URL, e.g. `https://your-backend.onrender.com` |

Without `VITE_API_URL`, the client calls relative `/api/...` paths, which only resolve correctly in local dev (via Vite's proxy in `vite.config.js`) — in production frontend and backend are separate domains, so this must point at the deployed backend.

**Heads up on Render's free tier:** the service spins down after 15 minutes of inactivity, so the first request after a while can take 30–60s to wake back up. The editor already shows a "waking up the server" message if a request runs long, so this is expected, not broken.

## Notes

- No database: images are embedded as base64 data URLs directly in the editor content, and PDFs are download-only (nothing is persisted server-side).
- The PDF's branded header/footer and the cover/back marketing pages live in `server/pdfTemplate.js`, `server/marketingTemplate.js`, and `server/brand.js`.
