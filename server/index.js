import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import pdfRoutes from './routes/pdf.js';
import { requireAuth } from './middleware/auth.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '25mb' })); // higher limit to allow base64-embedded images

app.use('/api', authRoutes);
app.use('/api', requireAuth, pdfRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
