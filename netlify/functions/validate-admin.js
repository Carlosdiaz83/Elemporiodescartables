// POST /.netlify/functions/validate-admin
// Body: { phone, idToken? , email? }
// - En producción: envía { phone, idToken } (idToken de Google) y el server lo verifica con Google.
// - En local/dev sin Google configurado: se acepta { phone, email } solo como fallback de prueba.
// Compara AMBOS (email + teléfono) contra ADMIN_EMAIL y ADMIN_PHONE. Si coinciden -> rol admin + token.
const { normEmail, normPhone, signAdminToken, json } = require('./_auth');

async function emailFromGoogleIdToken(idToken) {
  const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!r.ok) return null;
  const data = await r.json();
  return data && data.email ? String(data.email) : null;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' });

  const ADMIN_EMAIL = normEmail(process.env.ADMIN_EMAIL);
  const ADMIN_PHONE = normPhone(process.env.ADMIN_PHONE);
  if (!ADMIN_EMAIL || !ADMIN_PHONE) {
    return json(500, { ok: false, error: 'Admin no configurado: definí ADMIN_EMAIL y ADMIN_PHONE en Netlify' });
  }

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch { return json(400, { ok: false, error: 'JSON inválido' }); }

  const phone = normPhone(body.phone);
  if (!phone) return json(400, { ok: false, error: 'Falta el teléfono' });

  let email = '';
  if (body.idToken) {
    try {
      const verified = await emailFromGoogleIdToken(body.idToken);
      if (!verified) return json(401, { ok: false, error: 'Token de Google inválido' });
      email = normEmail(verified);
    } catch {
      return json(401, { ok: false, error: 'No se pudo validar el token de Google' });
    }
  } else if (body.email) {
    // Fallback solo para desarrollo local sin OAuth.
    email = normEmail(body.email);
  } else {
    return json(400, { ok: false, error: 'Falta idToken de Google o email' });
  }

  const emailOk = email && email === ADMIN_EMAIL;
  const phoneOk = phone && phone === ADMIN_PHONE;

  if (emailOk && phoneOk) {
    const token = signAdminToken({ email, phone });
    return json(200, { ok: true, role: 'admin', token, name: email.split('@')[0] });
  }
  // No coincide alguno: rol estándar, sin acceso al panel.
  return json(200, { ok: true, role: 'customer', token: null });
};
