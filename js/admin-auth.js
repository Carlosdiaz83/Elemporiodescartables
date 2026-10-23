// Auth del panel admin: validación de correo y teléfono en serverless.
// Guarda el token admin en sessionStorage (nunca en el código ni en git).
const AdminAuth = {
  getToken() { return sessionStorage.getItem('emporio_admin_token') || ''; },
  setToken(t) { sessionStorage.setItem('emporio_admin_token', t); },
  clear() {
    sessionStorage.removeItem('emporio_admin_token');
    sessionStorage.removeItem('emporio_admin_phone');
    sessionStorage.removeItem('emporio_admin_email');
  },
  getPhone() { return sessionStorage.getItem('emporio_admin_phone') || ''; },
  setPhone(p) { sessionStorage.setItem('emporio_admin_phone', p); },
  getEmail() { return sessionStorage.getItem('emporio_admin_email') || ''; },
  setEmail(e) { sessionStorage.setItem('emporio_admin_email', e); },
  async validate({ phone, email, idToken }) {
    const r = await fetch('/.netlify/functions/validate-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, email, idToken }),
    });
    return r.json();
  },
};
window.AdminAuth = AdminAuth;
