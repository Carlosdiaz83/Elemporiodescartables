// POST /.netlify/functions/validate-admin
// Body: { phone, email, idToken? }
// Compara AMBOS (email + teléfono) contra las variables de entorno ADMIN_EMAIL y ADMIN_PHONE.
// Si coinciden -> genera y devuelve un token firmado con rol admin.
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
    return json(500, { ok: false, error: 'Admin no configurado en variables de entorno' });
  }

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch { return json(400, { ok: false, error: 'JSON inválido' }); }

  const phone = normPhone(body.phone);
  if (!phone) return json(400, { ok: false, error: 'Ingresá un teléfono válido' });

  let email = '';
  if (body.idToken) {
    try {
      const verified = await emailFromGoogleIdToken(body.idToken);
      if (verified) email = normEmail(verified);
    } catch { /* continuar si venía email en body */ }
  }

  if (!email && body.email) {
    email = normEmail(body.email);
  }

  if (!email) {
    return json(400, { ok: false, error: 'Ingresá un correo electrónico válido' });
  }

  const emailOk = email === ADMIN_EMAIL;
  const phoneOk = phone === ADMIN_PHONE;

  if (emailOk && phoneOk) {
    const token = signAdminToken({ email, phone });
    return json(200, { ok: true, role: 'admin', token, name: email.split('@')[0] });
  }

  return json(401, { ok: false, role: 'customer', error: 'Los datos ingresados no coinciden con las credenciales de administrador' });
};
