// Auth del panel admin: teléfono (paso 1) + Google (paso 2) -> valida en serverless.
// Guarda el token admin en sessionStorage (no en el código ni en git).
const AdminAuth = {
  getToken() { return sessionStorage.getItem('emporio_admin_token') || ''; },
  setToken(t) { sessionStorage.setItem('emporio_admin_token', t); },
  clear() { sessionStorage.removeItem('emporio_admin_token'); sessionStorage.removeItem('emporio_admin_phone'); },
  getPhone() { return sessionStorage.getItem('emporio_admin_phone') || ''; },
  setPhone(p) { sessionStorage.setItem('emporio_admin_phone', p); },
  async validate({ phone, idToken, email }) {
    const r = await fetch('/.netlify/functions/validate-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, idToken, email }),
    });
    return r.json();
  },
};
window.AdminAuth = AdminAuth;
