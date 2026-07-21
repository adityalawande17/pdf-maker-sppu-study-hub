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
  if (!trimmed) return 'note';
  const cleaned = trimmed.replace(/[\\/:*?"<>|]/g, '').slice(0, 100).trim();
  return cleaned || 'note';
}

// Node's raw HTTP headers only allow ASCII/Latin-1 bytes — a title with, say,
// Devanagari text, an emoji, or a curly quote would otherwise throw
// ERR_INVALID_CHAR on every single request with that title. The ASCII-only
// name goes in the plain `filename=` param (basic clients), and the full
// name goes in `filename*=` per RFC 5987/6266 (all modern browsers), so
// non-ASCII titles still show up correctly instead of collapsing to "note.pdf".
function buildContentDisposition(name) {
  const asciiName = name.replace(/[^\x20-\x7E]/g, '').trim() || 'note';
  const utf8Name = encodeURIComponent(name);
  return `attachment; filename="${asciiName}.pdf"; filename*=UTF-8''${utf8Name}.pdf`;
}

async function renderPdf(browser, html, pdfOptions) {
  const page = await browser.newPage();
  try {
    // Generous timeout: free-tier hosts can be slow to fetch the marketing pages'
    // Google Fonts, especially right after a cold start.
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 45000 });
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

    // Rendered one at a time rather than via Promise.all: three concurrent Chromium
    // pages can exceed a free-tier host's memory/CPU budget and starve each other.
    const coverBuffer = await renderPdf(browser, buildCoverHtml(), {
      format: 'A4',
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    const contentBuffer = await renderPdf(browser, buildDocumentHtml(title, contentHtml), {
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: buildHeaderTemplate(subject),
      footerTemplate: buildFooterTemplate(),
      margin: { top: '90px', bottom: '70px', left: '40px', right: '40px' },
    });
    const backBuffer = await renderPdf(browser, buildBackHtml(), {
      format: 'A4',
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    const mergedPdf = await mergePdfBuffers([coverBuffer, contentBuffer, backBuffer]);

    const filenameBase = safeFilename(title);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': buildContentDisposition(filenameBase),
    });
    res.send(mergedPdf);
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router;
