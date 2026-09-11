// GET /.netlify/functions/content-get -> contenido público del sitio (hero, features, contacto).
const fs = require('fs');
const path = require('path');
const { json } = require('./_auth');

exports.handler = async () => {
  try {
    const file = path.join(__dirname, '..', '..', 'data', 'content.json');
    const raw = fs.readFileSync(file, 'utf8');
    return json(200, { ok: true, content: JSON.parse(raw) });
  } catch (e) {
    return json(200, { ok: true, content: null, note: 'Sin contenido personalizado todavía' });
  }
};
