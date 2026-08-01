import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import pdfRoutes from './routes/pdf.js';
import { requireAuth } from './middleware/auth.js';

const app = express();

// CLIENT_ORIGIN restricts CORS to the deployed frontend (e.g. the Vercel URL).
// Left unset, cors() falls back to allowing any origin — fine for local dev.
// exposedHeaders is required for the client to read Content-Disposition at all:
// browsers hide response headers from JS on cross-origin requests unless the
// server explicitly allow-lists them (locally this is masked by Vite's proxy
// making the request same-origin, which is why it worked there but not live).
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    exposedHeaders: ['Content-Disposition'],
  })
);
app.use(express.json({ limit: '25mb' })); // higher limit to allow base64-embedded images

app.use('/api', authRoutes);
app.use('/api', requireAuth, pdfRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
