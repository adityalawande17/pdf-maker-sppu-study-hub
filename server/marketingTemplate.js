import { BRAND, GOOGLE_FONTS_HREF } from './brand.js';

const SHARED_STYLES = `
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: ${BRAND.navy};
    font-family: 'Inter', Helvetica, Arial, sans-serif;
  }
  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 70px 60px;
    color: #f0f6fc;
    text-align: center;
    background: radial-gradient(circle at 50% 0%, ${BRAND.navyLight} 0%, ${BRAND.navy} 60%);
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: ${BRAND.accentBlue};
    background: rgba(183, 216, 230, 0.1);
    border: 1px solid rgba(183, 216, 230, 0.25);
    border-radius: 999px;
    padding: 6px 16px;
    margin-bottom: 32px;
  }
  .wordmark {
    font-family: 'Black Ops One', 'Inter', sans-serif;
    font-size: 24px;
    letter-spacing: -0.3px;
    margin-bottom: 28px;
  }
  .wordmark .accent { color: ${BRAND.accentBlue}; }
  h1.headline {
    font-family: 'Black Ops One', 'Inter', sans-serif;
    font-weight: 400;
    font-size: 56px;
    line-height: 1.15;
    letter-spacing: -0.5px;
    margin: 0 0 24px;
    color: #f0f6fc;
  }
  h1.headline .accent { color: ${BRAND.accentBlue}; }
  .subtext {
    font-size: 16px;
    line-height: 1.7;
    color: #c9d1d9;
    max-width: 520px;
    margin: 0 0 36px;
  }
  .features {
    list-style: none;
    padding: 0;
    margin: 0 0 40px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .features li {
    font-size: 15px;
    font-weight: 500;
    color: #e6edf3;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .features li::before {
    content: '✓';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${BRAND.gold};
    color: ${BRAND.navy};
    font-size: 12px;
    font-weight: 700;
  }
  .stats {
    display: flex;
    gap: 36px;
    margin-bottom: 40px;
  }
  .stat-num {
    font-size: 28px;
    font-weight: 800;
    color: #ffffff;
  }
  .stat-label {
    font-size: 11px;
    font-weight: 500;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  .cta {
    display: inline-block;
    background: ${BRAND.gold};
    color: ${BRAND.navy};
    font-weight: 700;
    font-size: 16px;
    padding: 14px 36px;
    border-radius: 10px;
    text-decoration: none;
    margin-bottom: 20px;
  }
  .footnote {
    font-size: 12px;
    color: #6b7280;
  }
`;

function shell(bodyHtml) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${GOOGLE_FONTS_HREF}" rel="stylesheet">
<style>${SHARED_STYLES}</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

const FEATURES = [
  'Notes &amp; Study Materials',
  'Previous Year Question Papers',
  'Solved Solutions &amp; Explanations',
  'Completely Free — Always',
];

const STATS = [
  ['200+', 'Study Materials'],
  ['100+', 'Question Papers'],
  ['7', 'Engineering Branches'],
];

function featureList() {
  return `<ul class="features">${FEATURES.map((f) => `<li>${f}</li>`).join('')}</ul>`;
}

function statsRow() {
  return `<div class="stats">${STATS.map(
    ([num, label]) => `<div><div class="stat-num">${num}</div><div class="stat-label">${label}</div></div>`
  ).join('')}</div>`;
}

export function buildCoverHtml() {
  return shell(`
  <div class="page">
    <div class="eyebrow">● 2019 &amp; 2024 patterns · 7 branches · Free forever</div>
    <div class="wordmark">SPPU<span class="accent">StudyHUB</span></div>
    <h1 class="headline">Everything you need.<br><span class="accent">One place.</span></h1>
    <p class="subtext">
      Notes, previous year question papers, and solved solutions for every
      SPPU engineering subject — both patterns, all branches. Completely free, always.
    </p>
    ${featureList()}
    ${statsRow()}
    <a class="cta" href="${BRAND.siteUrl}">Visit sppustudyhub.in →</a>
    <div class="footnote">Made by a student, for students.</div>
  </div>`);
}

export function buildBackHtml() {
  return shell(`
  <div class="page">
    <div class="eyebrow">● Free forever · No sign-up required</div>
    <h1 class="headline">Want more<br><span class="accent">like this?</span></h1>
    <p class="subtext">
      Head to SPPU StudyHUB for complete notes, previous year question papers,
      and solved answers across every SPPU branch and year — all free, always.
    </p>
    ${featureList()}
    <a class="cta" href="${BRAND.siteUrl}">Visit sppustudyhub.in →</a>
    <div class="footnote">sppustudyhub.in — everything you need, one place.</div>
  </div>`);
}
