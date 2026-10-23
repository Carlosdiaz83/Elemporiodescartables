// POST /.netlify/functions/validate-admin
// Body: { phone, email, idToken? }
// Compara email y teléfono contra variables de entorno (ADMIN_EMAIL, ADMIN_PHONE)
// o contra hashes criptográficos unidireccionales SHA-256 (sin exponer credenciales en plano).
const crypto = require('crypto');
const { normEmail, normPhone, signAdminToken, json } = require('./_auth');

// Hashes SHA-256 de las credenciales autorizadas (unidireccionales, imposibles de revertir a texto plano)
const ADMIN_EMAIL_HASH = '45f0a4a8220fd0c5dbdadec05037af44f8cc8f7b10ad59f038168e75c13cc41c';
const ADMIN_PHONE_HASH = '62bb8454e3aaa7723f0bccfa26cc9fc6b1798dfe5816426b43ec0f78a228fcbb';

async function emailFromGoogleIdToken(idToken) {
  const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!r.ok) return null;
  const data = await r.json();
  return data && data.email ? String(data.email) : null;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' });

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

  const ADMIN_EMAIL = normEmail(process.env.ADMIN_EMAIL);
  const ADMIN_PHONE = normPhone(process.env.ADMIN_PHONE);

  const inputEmailHash = crypto.createHash('sha256').update(email).digest('hex');
  const inputPhoneHash = crypto.createHash('sha256').update(phone).digest('hex');

  const emailOk = (ADMIN_EMAIL && email === ADMIN_EMAIL) || (inputEmailHash === ADMIN_EMAIL_HASH);
  const phoneOk = (ADMIN_PHONE && phone === ADMIN_PHONE) || (inputPhoneHash === ADMIN_PHONE_HASH);

  if (emailOk && phoneOk) {
    const token = signAdminToken({ email, phone });
    return json(200, { ok: true, role: 'admin', token, name: email.split('@')[0] });
  }

  return json(401, { ok: false, role: 'customer', error: 'Los datos ingresados no coinciden con las credenciales de administrador' });
};
