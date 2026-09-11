// Editor del panel admin. Requiere token admin (sessionStorage).
// Cada sección tiene su botón Editar. Guardar valida contra el server (403 si no es admin).
(function () {
  const token = () => sessionStorage.getItem('emporio_admin_token') || '';
  if (!token()) { window.location.href = 'pages/admin-login.html'; return; }

  const msg = (t, ok) => {
    const el = document.getElementById('admin-msg');
    if (el) { el.textContent = t || ''; el.style.color = ok ? 'green' : '#a00'; }
  };

  // Toggle edición inline por sección
  document.querySelectorAll('[data-edit-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sel = btn.getAttribute('data-edit-btn');
      const target = document.querySelector(sel);
      if (!target) return;
      const editing = target.getAttribute('contenteditable') === 'true';
      target.setAttribute('contenteditable', editing ? 'false' : 'true');
      target.classList.toggle('editing', !editing);
      btn.innerHTML = editing ? '<i class="fas fa-pen"></i> Editar' : '<i class="fas fa-check"></i> Listo';
      if (!editing) target.focus();
    });
  });

  // Logo preview (temporal; para definitivo reemplazar img/logo.jpg en el repo)
  const logoInput = document.getElementById('edit-logo-input');
  if (logoInput) logoInput.addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      document.querySelectorAll('.admin-logo-preview').forEach(img => img.src = r.result);
      msg('Logo actualizado en vista previa. Reemplazá img/logo.jpg para hacerlo permanente.', true);
    };
    r.readAsDataURL(f);
  });

  // Tabla de productos editable
  function renderAdminProducts(filter = '') {
    const wrap = document.getElementById('admin-products');
    if (!wrap || typeof PRODUCTOS === 'undefined') return;
    const q = filter.trim().toLowerCase();
    wrap.innerHTML = '';
    PRODUCTOS.filter(p => !q || p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q))
      .slice(0, 200).forEach(p => {
        const row = document.createElement('div');
        row.className = 'admin-prod-row';
        row.innerHTML = `
          <img src="${p.imagen}" onerror="this.src='img/producto-placeholder.svg'" alt="">
          <input data-f="nombre" data-id="${p.id}" value="${String(p.nombre).replace(/"/g, '&quot;')}" title="Nombre">
          <input data-f="precio" data-id="${p.id}" type="number" value="${p.precio}" title="Precio" style="max-width:110px">
          <input data-f="unidad" data-id="${p.id}" value="${p.unidad || ''}" title="Unidad" style="max-width:90px">
          <label title="Visible"><input data-f="activo" data-id="${p.id}" type="checkbox" ${p.activo !== false ? 'checked' : ''}> Activo</label>
          <button class="mini" data-save-prod="${p.id}">Guardar</button>`;
        wrap.appendChild(row);
      });
    wrap.querySelectorAll('[data-save-prod]').forEach(b => b.addEventListener('click', () => {
      const id = parseInt(b.getAttribute('data-save-prod'), 10);
      const prod = PRODUCTOS.find(x => x.id === id);
      if (!prod) return;
      wrap.querySelectorAll(`input[data-id="${id}"]`).forEach(inp => {
        const f = inp.getAttribute('data-f');
        if (f === 'precio') prod.precio = Number(inp.value) || 0;
        else if (f === 'activo') prod.activo = inp.checked;
        else prod[f] = inp.value;
      });
      // Override local para vista previa inmediata
      try {
        const ov = JSON.parse(localStorage.getItem('emporio_products_override') || '{}');
        ov[id] = { nombre: prod.nombre, precio: prod.precio, unidad: prod.unidad, activo: prod.activo };
        localStorage.setItem('emporio_products_override', JSON.stringify(ov));
      } catch {}
      msg(`Producto ${id} actualizado (vista previa local). Para publicarlo, exportá js/productos.js.`, true);
    }));
  }

  const search = document.getElementById('admin-search');
  if (search) search.addEventListener('input', () => renderAdminProducts(search.value));

  // Guardar contenido general (hero, features, contacto, footer) en el server
  const saveBtn = document.getElementById('btn-save-all');
  if (saveBtn) saveBtn.addEventListener('click', async () => {
    msg('Guardando…');
    const get = (sel) => document.querySelector(sel)?.innerText.trim() || '';
    const content = {
      hero: { title: get('#a-hero-title'), subtitle: get('#a-hero-sub'), cta: get('#a-hero-cta') },
      features: [1, 2, 3].map(i => ({
        title: get(`#a-feat-${i}-t`), text: get(`#a-feat-${i}-x`),
      })),
      contact: {
        phone: get('#a-contact-phone'), email: get('#a-contact-email'),
        address: get('#a-contact-addr'), hours: get('#a-contact-hours'),
      },
      footerNote: get('#a-footer-note'),
      updatedAt: new Date().toISOString(),
    };
    try {
      const r = await fetch('/.netlify/functions/content-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token() },
        body: JSON.stringify({ content }),
      });
      const data = await r.json();
      if (r.status === 403) { msg('403 Forbidden: sesión sin rol admin. Volvé a loguearte.'); return; }
      msg(data.ok ? 'Guardado OK en el servidor.' : ('Error: ' + (data.error || 'desconocido')), data.ok);
    } catch { msg('Error de conexión. ¿Corren las functions? (netlify dev)'); }
  });

  const logout = document.getElementById('btn-admin-logout');
  if (logout) logout.addEventListener('click', () => {
    sessionStorage.removeItem('emporio_admin_token');
    window.location.href = 'index.html';
  });

  // Cargar contenido guardado (si existe) para previsualizar
  fetch('/.netlify/functions/content-get').then(r => r.json()).then(d => {
    if (d && d.content) {
      const c = d.content;
      if (c.hero) {
        if (c.hero.title) document.querySelector('#a-hero-title').innerText = c.hero.title;
        if (c.hero.subtitle) document.querySelector('#a-hero-sub').innerText = c.hero.subtitle;
      }
    }
  }).catch(() => {});

  renderAdminProducts('');
})();
