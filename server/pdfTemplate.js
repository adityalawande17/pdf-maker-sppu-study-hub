import { escapeHtml } from './lib/html.js';
import { BRAND } from './brand.js';

export function buildDocumentHtml(title, contentHtml) {
  const safeTitle = escapeHtml(title || 'Untitled');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;0,7..72,600;0,7..72,700;1,7..72,400;1,7..72,600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Literata', Georgia, 'Times New Roman', serif;
    font-size: 14.5px;
    line-height: 1.45;
    color: #1f2933;
    margin: 0;
    padding: 0;
  }
  h1.doc-title {
    font-size: 27px;
    font-weight: 700;
    margin: 0 0 16px 0;
    color: ${BRAND.navy};
  }
  h1 { font-size: 22px; font-weight: 700; margin: 18px 0 8px; }
  h2 { font-size: 18px; font-weight: 600; margin: 16px 0 6px; }
  p { margin: 0 0 8px; }
  ul, ol { margin: 0 0 8px; padding-left: 24px; }
  li { margin-bottom: 2px; }
  img { max-width: 100%; height: auto; display: block; margin: 8px 0; }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
    font-size: 14px;
  }
  th, td {
    border: 1px solid #d1d5db;
    padding: 8px 10px;
    text-align: left;
  }
  th {
    background-color: #f3f4f6;
    font-weight: 600;
  }
  strong { font-weight: 700; }
  em { font-style: italic; }
</style>
</head>
<body>
  <h1 class="doc-title">${safeTitle}</h1>
  ${contentHtml || ''}
</body>
</html>`;
}

// Header/footer templates render in an isolated context that doesn't reliably wait on
// network fonts or images, so they use system fonts and inline styles only (Puppeteer
// requirement — external stylesheets aren't applied to header/footer templates).

export function buildHeaderTemplate(subject) {
  const safeSubject = escapeHtml(subject || '');

  return `
  <div style="width:100%; font-family:Helvetica,Arial,sans-serif; padding:0 40px;">
    <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:8px; border-bottom:3px solid ${BRAND.navy};">
      <span style="font-size:13px; font-weight:700; letter-spacing:0.3px; color:${BRAND.navy};">
        SPPU<span style="color:#2563eb;">StudyHUB</span>
      </span>
      <span style="font-size:11px; font-weight:600; color:${BRAND.navy};">${safeSubject}</span>
    </div>
  </div>`;
}

export function buildFooterTemplate() {
  return `
  <div style="width:100%; font-family:Helvetica,Arial,sans-serif; padding:0 40px;">
    <div style="display:flex; align-items:center; justify-content:space-between; padding-top:8px; border-top:3px solid ${BRAND.navy};">
      <a href="${BRAND.siteUrl}" style="font-size:10px; color:#2563eb; text-decoration:none;">${BRAND.siteLabel}</a>
      <span class="pageNumber" style="font-size:11px; font-weight:600; color:${BRAND.navy};"></span>
    </div>
  </div>`;
}
