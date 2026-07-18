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

## Notes

- The header logo in generated PDFs is a placeholder (`server/pdfTemplate.js`) — swap `PLACEHOLDER_LOGO_URL` for the real SPPUStudyHub logo URL when available.
- No database: images are embedded as base64 data URLs directly in the editor content, and PDFs are download-only (nothing is persisted server-side).
