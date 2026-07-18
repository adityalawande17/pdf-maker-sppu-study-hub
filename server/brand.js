// Brand palette and fonts pulled from sppustudyhub.in's compiled CSS (:root custom properties).
export const BRAND = {
  navy: '#0a1628',
  navyMid: '#112240',
  navyLight: '#1d3461',
  gold: '#f0a500',
  goldDim: '#c8861a',
  goldPale: '#fef3d0',
  accentBlue: '#b7d8e6', // dark-theme accent used for the "StudyHUB" wordmark
  textMuted: '#9ca3af',
  siteUrl: 'https://sppustudyhub.in',
  siteLabel: 'sppustudyhub.in',
};

// Loaded fresh via Google Fonts in full-page templates (cover/back); avoided in the
// header/footer templates since those render synchronously and can't reliably wait
// on webfont network loads.
export const GOOGLE_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Black+Ops+One&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700;800&display=swap';
