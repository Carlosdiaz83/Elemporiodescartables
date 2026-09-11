// Helpers compartidos de autenticación admin (sin dependencias externas).
// El token es un HMAC-SHA256 firmado con ADMIN_SESSION_SECRET.
const crypto = require('crypto');

function b64urlEncode(str) {
  return Buffer.from(str, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(b64) {
  b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return Buffer.from(b64, 'base64').toString('utf8');
}

function normEmail(v) {
  return String(v || '').trim().toLowerCase();
}

function normPhone(v) {
  // Compara por últimos 10 dígitos para tolerar +54, espacios, guiones.
  const d = String(v || '').replace(/\D/g, '');
  return d.slice(-10);
}

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || '';
}

function signAdminToken({ email, phone, hours = 12 }) {
  const secret = getSecret();
  if (!secret) throw new Error('Falta ADMIN_SESSION_SECRET en variables de entorno');
  const payload = {
    role: 'admin',
    email: normEmail(email),
    phone: normPhone(phone),
    exp: Date.now() + hours * 3600 * 1000,
  };
  const body = b64urlEncode(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${body}.${sig}`;
}

function verifyAdminToken(token) {
  try {
    const secret = getSecret();
    if (!secret || !token || !token.includes('.')) return null;
    const [body, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', secret).update(body).digest('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    if (sig !== expected) return null;
    const payload = JSON.parse(b64urlDecode(body));
    if (payload.role !== 'admin' || !payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function getBearerToken(event) {
  const h = event.headers || {};
  const auth = h.authorization || h.Authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
  try {
    const body = JSON.parse(event.body || '{}');
    if (body.token) return body.token;
  } catch { /* noop */ }
  return null;
}

// Middleware: solo pasa si hay sesión admin válida. Si no, 403.
function requireAdmin(event) {
  const token = getBearerToken(event);
  const payload = token ? verifyAdminToken(token) : null;
  if (!payload) {
    return {
      ok: false,
      response: {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Forbidden: se requiere rol admin' }),
      },
    };
  }
  return { ok: true, payload };
}

function json(statusCode, obj) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) };
}

module.exports = { normEmail, normPhone, signAdminToken, verifyAdminToken, requireAdmin, json };
