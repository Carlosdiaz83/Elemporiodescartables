// POST /.netlify/functions/content-save  (PROTEGIDO: solo admin)
// Body: { token, content }  o  Authorization: Bearer <token>
// Sin token admin válido -> 403 Forbidden.
const fs = require('fs');
const path = require('path');
const { requireAdmin, json } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' });

  const check = requireAdmin(event);
  if (!check.ok) return check.response; // 403

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch { return json(400, { ok: false, error: 'JSON inválido' }); }
  if (!body.content || typeof body.content !== 'object') return json(400, { ok: false, error: 'Falta content' });

  // En Netlify el filesystem es efímero: esto persiste en local/dev.
  // En producción, conectá aquí Netlify Blobs o tu DB y devolvé ok:true.
  try {
    if (!process.env.NETLIFY) {
      const file = path.join(__dirname, '..', '..', 'data', 'content.json');
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(body.content, null, 2), 'utf8');
      return json(200, { ok: true, saved: 'local', by: check.payload.email });
    }
    return json(200, { ok: true, saved: false, note: 'Conectá persistencia (Blobs/DB) para producción', by: check.payload.email });
  } catch (e) {
    return json(500, { ok: false, error: 'No se pudo guardar' });
  }
};
