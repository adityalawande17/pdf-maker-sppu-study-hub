import { Router } from 'express';
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import { buildDocumentHtml, buildHeaderTemplate, buildFooterTemplate } from '../pdfTemplate.js';
import { buildCoverHtml, buildBackHtml } from '../marketingTemplate.js';

const router = Router();

// Reuse a single browser instance across requests instead of launching one per request.
let browserPromise = null;
function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browserPromise;
}

function safeFilename(title) {
  const trimmed = (title || '').trim();
  if (!trimmed) return 'note.pdf';
  const cleaned = trimmed.replace(/[\\/:*?"<>|]/g, '').slice(0, 100).trim();
  return cleaned ? `${cleaned}.pdf` : 'note.pdf';
}

async function renderPdf(browser, html, pdfOptions) {
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: 'networkidle0' });
    return await page.pdf(pdfOptions);
  } finally {
    await page.close();
  }
}

async function mergePdfBuffers(buffers) {
  const merged = await PDFDocument.create();
  for (const buffer of buffers) {
    const doc = await PDFDocument.load(buffer);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  return Buffer.from(await merged.save());
}

router.post('/generate-pdf', async (req, res) => {
  const { title, subject, contentHtml } = req.body || {};

  if (typeof contentHtml !== 'string') {
    return res.status(400).json({ error: 'contentHtml is required' });
  }

  try {
    const browser = await getBrowser();

    const [coverBuffer, contentBuffer, backBuffer] = await Promise.all([
      renderPdf(browser, buildCoverHtml(), {
        format: 'A4',
        printBackground: true,
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
      }),
      renderPdf(browser, buildDocumentHtml(title, contentHtml), {
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: buildHeaderTemplate(subject),
        footerTemplate: buildFooterTemplate(),
        margin: { top: '90px', bottom: '70px', left: '40px', right: '40px' },
      }),
      renderPdf(browser, buildBackHtml(), {
        format: 'A4',
        printBackground: true,
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
      }),
    ]);

    const mergedPdf = await mergePdfBuffers([coverBuffer, contentBuffer, backBuffer]);

    const filename = safeFilename(title);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.send(mergedPdf);
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router;
