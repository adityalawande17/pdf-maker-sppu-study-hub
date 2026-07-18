const TOKEN_KEY = 'pdfmaker_token';

// In dev, Vite's proxy forwards relative /api paths to localhost:4000 (see vite.config.js),
// so API_BASE stays empty. In production the frontend and backend are on different
// domains (Vercel + Render), so VITE_API_URL must point at the deployed backend.
const API_BASE = import.meta.env.VITE_API_URL || '';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(password) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Login failed');
  }

  const data = await res.json();
  return data.token;
}

// Returns { blob, filename } on success. Throws AuthError on 401 so callers can redirect to login.
export async function generatePdf(token, { title, subject, contentHtml }) {
  const res = await fetch(`${API_BASE}/api/generate-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, subject, contentHtml }),
  });

  if (res.status === 401) {
    const err = new Error('Session expired');
    err.isAuthError = true;
    throw err;
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'PDF generation failed');
  }

  const disposition = res.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match ? match[1] : 'note.pdf';

  const blob = await res.blob();
  return { blob, filename };
}
