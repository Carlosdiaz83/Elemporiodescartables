// ============================================================
//  MAIN.JS - El Emporio Descartables
//  Sesión, catálogo, favoritos, carrito y búsqueda (solo local)
//  Regla de negocio: precios SOLO visibles si el cliente está logueado
// ============================================================

const Auth = {
    login(proveedor, nombre, avatar) {
        const user = { proveedor, nombre, avatar, loggedAt: Date.now() };
        localStorage.setItem('emporio_user', JSON.stringify(user));
        return user;
    },
    logout() {
        localStorage.removeItem('emporio_user');
    },
    getUser() {
        try {
            const raw = localStorage.getItem('emporio_user');
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    },
    isLogged() { return !!this.getUser(); }
};

const Favoritos = {
    get() {
        try { return JSON.parse(localStorage.getItem('emporio_favs') || '[]'); }
        catch { return []; }
    },
    toggle(id) {
        const favs = this.get();
        const idx = favs.indexOf(id);
        if (idx === -1) favs.push(id); else favs.splice(idx, 1);
        localStorage.setItem('emporio_favs', JSON.stringify(favs));
        return idx === -1;
    },
    has(id) { return this.get().includes(id); },
    count() { return this.get().length; }
};

const Carrito = {
    get() {
        try { return JSON.parse(localStorage.getItem('emporio_cart') || '[]'); }
        catch { return []; }
    },
    save(cart) { localStorage.setItem('emporio_cart', JSON.stringify(cart)); },
    add(productoId, qty = 1) {
        const cart = this.get();
        const item = cart.find(i => i.id === productoId);
        if (item) item.qty += qty; else cart.push({ id: productoId, qty });
        this.save(cart);
    },
    setQty(productoId, qty) {
        let cart = this.get();
        if (qty <= 0) cart = cart.filter(i => i.id !== productoId);
        else {
            const item = cart.find(i => i.id === productoId);
            if (item) item.qty = qty;
        }
        this.save(cart);
    },
    remove(productoId) { this.save(this.get().filter(i => i.id !== productoId)); },
    clear() { this.save([]); },
    count() { return this.get().reduce((s, i) => s + (i.qty || 0), 0); }
};

function basePrefix() {
    return window.location.pathname.includes('/pages/') ? '../' : '';
}

function imgSrc(src) {
    if (!src) return basePrefix() + 'img/producto-placeholder.svg';
    if (src.startsWith('http')) return src; // por compatibilidad, pero ya no usamos externas
    if (src.startsWith('img/')) return basePrefix() + src;
    return src;
}

function formatPrecio(num) {
    return '$ ' + Number(num || 0).toLocaleString('es-AR');
}

function actualizarHeader() {
    const user = Auth.getUser();
    const loginBtn = document.getElementById('header-login-btn');
    const userMenu = document.getElementById('header-user-menu');
    const userName = document.getElementById('header-user-name');
    const favCount = document.getElementById('fav-count');
    const cartCount = document.getElementById('cart-count');

    if (favCount) favCount.textContent = Favoritos.count() || '';
    if (cartCount) cartCount.textContent = Carrito.count() || '';

    if (!loginBtn || !userMenu) return;
    if (user) {
        loginBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        if (userName) userName.textContent = user.nombre.split(' ')[0];
    } else {
        loginBtn.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

let filtroTexto = '';
let categoriaActivaGlobal = 'Todos';

function getProductosFiltrados() {
    if (typeof PRODUCTOS === 'undefined') return [];
    const q = filtroTexto.trim().toLowerCase();
    return PRODUCTOS.filter(p => {
        if (p.activo === false) return false;
        if (categoriaActivaGlobal !== 'Todos' && p.categoria !== categoriaActivaGlobal) return false;
        if (q && !(p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q))) return false;
        return true;
    });
}

function renderizarProductos() {
    const grid = document.getElementById('products-grid');
    if (!grid || typeof PRODUCTOS === 'undefined') return;

    const isLogged = Auth.isLogged();
    const lista = getProductosFiltrados();
    const prefix = basePrefix();
    grid.innerHTML = '';

    if (!lista.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px">
            <i class="fas fa-box-open" style="font-size:40px;display:block;margin-bottom:12px;opacity:.4"></i>
            No se encontraron productos. Probá con otra búsqueda.</div>`;
        return;
    }

    lista.slice(0, 60).forEach(p => {
        const esFav = Favoritos.has(p.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${imgSrc(p.imagen)}" alt="${p.alt || p.nombre}" loading="lazy"
                     onerror="this.onerror=null;this.src='${prefix}img/producto-placeholder.svg'">
            </div>
            <div class="product-info">
                <span class="category">${p.categoria}</span>
                <h3>${p.nombre}</h3>
                ${isLogged
                    ? `<div class="product-price">${formatPrecio(p.precio)} <small style="font-weight:400;color:var(--text-muted)">/ ${p.unidad || 'u.'}</small></div>
                       <div class="product-actions">
                           <button class="btn-outline btn-add" data-id="${p.id}"><i class="fas fa-cart-plus"></i> Agregar</button>
                           <button class="btn-icon btn-fav ${esFav ? 'active' : ''}" data-id="${p.id}" title="Favoritos">
                               <i class="${esFav ? 'fas' : 'far'} fa-heart"></i>
                           </button>
                       </div>`
                    : `<div class="product-price-locked" title="Iniciá sesión para ver el precio">
                           <i class="fas fa-lock"></i>&nbsp;Precio exclusivo — <a href="${prefix}pages/login.html">Iniciá sesión</a>
                       </div>
                       <div class="product-actions">
                           <button class="btn-outline btn-login-req">Ver precio</button>
                           <button class="btn-icon btn-fav" data-id="${p.id}" title="Favoritos">
                               <i class="far fa-heart"></i>
                           </button>
                       </div>`
                }
            </div>
        `;
        grid.appendChild(card);
    });

    grid.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!Auth.isLogged()) {
                mostrarToast('Iniciá sesión para agregar al pedido', 'warning');
                setTimeout(() => window.location.href = basePrefix() + 'pages/login.html', 1200);
                return;
            }
            Carrito.add(parseInt(btn.dataset.id, 10), 1);
            actualizarHeader();
            mostrarToast('Agregado a tu pedido', 'success');
        });
    });

    grid.querySelectorAll('.btn-login-req').forEach(btn => {
        btn.addEventListener('click', () => {
            mostrarToast('Iniciá sesión para ver precios y comprar', 'warning');
            setTimeout(() => window.location.href = basePrefix() + 'pages/login.html', 1200);
        });
    });

    grid.querySelectorAll('.btn-fav').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!Auth.isLogged()) {
                mostrarToast('Iniciá sesión para guardar favoritos', 'warning');
                return;
            }
            const id = parseInt(btn.dataset.id, 10);
            const agregado = Favoritos.toggle(id);
            const icon = btn.querySelector('i');
            if (icon) icon.className = agregado ? 'fas fa-heart' : 'far fa-heart';
            btn.classList.toggle('active', agregado);
            mostrarToast(agregado ? 'Agregado a favoritos' : 'Eliminado de favoritos', agregado ? 'success' : 'info');
            actualizarHeader();
        });
    });
}

function mostrarToast(mensaje, tipo = 'info') {
    const anterior = document.getElementById('site-toast');
    if (anterior) anterior.remove();
    const t = document.createElement('div');
    t.id = 'site-toast';
    t.className = `site-toast toast-${tipo}`;
    t.innerHTML = `<span>${mensaje}</span>`;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2800);
}

function abrirCarrito() {
    if (!Auth.isLogged()) {
        mostrarToast('Iniciá sesión para ver tu pedido', 'warning');
        setTimeout(() => window.location.href = basePrefix() + 'pages/login.html', 1200);
        return;
    }
    let modal = document.getElementById('cart-modal');
    if (modal) modal.remove();

    const items = Carrito.get();
    const prefix = basePrefix();
    let total = 0;
    let rows = '';

    if (!items.length) {
        rows = '<p style="text-align:center;color:var(--text-muted);padding:20px">Tu pedido está vacío.</p>';
    } else {
        rows = items.map(it => {
            const prod = (typeof PRODUCTOS !== 'undefined') ? PRODUCTOS.find(p => p.id === it.id) : null;
            if (!prod) return '';
            const sub = prod.precio * it.qty;
            total += sub;
            return `<div style="display:flex;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-color)">
                <img src="${imgSrc(prod.imagen)}" onerror="this.src='${prefix}img/producto-placeholder.svg'" style="width:56px;height:56px;object-fit:cover;border-radius:8px;background:#fff">
                <div style="flex:1"><strong style="font-size:14px">${prod.nombre}</strong><br>
                <small>${formatPrecio(prod.precio)} c/u</small></div>
                <div style="display:flex;align-items:center;gap:6px">
                    <button data-act="dec" data-id="${prod.id}" style="width:28px;height:28px">−</button>
                    <span>${it.qty}</span>
                    <button data-act="inc" data-id="${prod.id}" style="width:28px;height:28px">+</button>
                </div>
                <div style="min-width:80px;text-align:right"><strong>${formatPrecio(sub)}</strong></div>
            </div>`;
        }).join('');
    }

    modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
    modal.innerHTML = `
      <div style="background:#fff;border-radius:16px;max-width:620px;width:100%;max-height:85vh;overflow:auto;padding:24px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h3 style="color:var(--primary-dark)">Mi Pedido (${Carrito.count()})</h3>
          <button id="cart-close" style="border:none;background:#eee;border-radius:50%;width:32px;height:32px;cursor:pointer">✕</button>
        </div>
        ${rows}
        <div style="display:flex;justify-content:space-between;margin-top:16px;font-size:18px"><span>Total:</span><strong>${formatPrecio(total)}</strong></div>
        <div style="display:flex;gap:10px;margin-top:16px">
          <button id="cart-clear" class="btn-outline" style="flex:1">Vaciar</button>
          <button id="cart-send" class="btn-primary" style="flex:2;background:var(--primary-color);color:#fff;border:none;border-radius:6px;padding:12px;cursor:pointer">
            <i class="fab fa-whatsapp"></i> Enviar pedido por WhatsApp
          </button>
        </div>
        <small style="display:block;margin-top:10px;color:var(--text-muted)">Precios visibles solo para clientes logueados. El envío se coordina por WhatsApp.</small>
      </div>`;
    document.body.appendChild(modal);

    document.getElementById('cart-close').onclick = () => modal.remove();
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    const clearBtn = document.getElementById('cart-clear');
    if (clearBtn) clearBtn.onclick = () => { Carrito.clear(); actualizarHeader(); abrirCarrito(); };

    modal.querySelectorAll('button[data-act]').forEach(b => {
        b.onclick = () => {
            const id = parseInt(b.dataset.id, 10);
            const cur = Carrito.get().find(i => i.id === id);
            const qty = cur ? cur.qty : 0;
            Carrito.setQty(id, b.dataset.act === 'inc' ? qty + 1 : qty - 1);
            actualizarHeader();
            abrirCarrito();
        };
    });

    const sendBtn = document.getElementById('cart-send');
    if (sendBtn) sendBtn.onclick = () => {
        const cart = Carrito.get();
        if (!cart.length) { mostrarToast('Tu pedido está vacío', 'warning'); return; }
        const user = Auth.getUser();
        let msg = `Hola El Emporio! Soy ${user ? user.nombre : 'cliente'} y quiero pedir:%0A`;
        cart.forEach(it => {
            const prod = PRODUCTOS.find(p => p.id === it.id);
            if (prod) msg += `• ${prod.nombre} x${it.qty} - ${formatPrecio(prod.precio * it.qty)}%0A`;
        });
        window.open(`https://wa.me/5493512400816?text=${msg}`, '_blank');
    };
}

function setupNavLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });
}

function setupCarrito() {
    const btn = document.getElementById('btn-mi-pedido');
    if (btn) btn.addEventListener('click', e => { e.preventDefault(); abrirCarrito(); });
}

function setupFavoritos() {
    const btn = document.getElementById('btn-favoritos');
    if (!btn) return;
    btn.addEventListener('click', e => {
        e.preventDefault();
        if (!Auth.isLogged()) {
            mostrarToast('Iniciá sesión para ver tus favoritos', 'warning');
            setTimeout(() => window.location.href = basePrefix() + 'pages/login.html', 1200);
            return;
        }
        const favs = Favoritos.get();
        mostrarToast(favs.length ? `Tenés ${favs.length} favorito(s)` : 'Aún no tenés favoritos', 'info');
    });
}

function setupLogout() {
    const btn = document.getElementById('btn-logout');
    if (!btn) return;
    btn.addEventListener('click', e => {
        e.preventDefault();
        Auth.logout();
        mostrarToast('Sesión cerrada', 'info');
        setTimeout(() => window.location.reload(), 800);
    });
}

function setupMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-menu');
    if (btn && nav) {
        btn.addEventListener('click', () => nav.classList.toggle('active'));
        document.addEventListener('click', e => {
            if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) nav.classList.remove('active');
        });
    }
}

function setupSearch() {
    const bar = document.querySelector('.search-bar');
    if (!bar) return;
    const input = bar.querySelector('input');
    const btn = bar.querySelector('button');
    if (!input || !btn) return;
    const doSearch = () => {
        filtroTexto = input.value.trim();
        renderizarProductos();
        const cat = document.getElementById('catalogo');
        if (cat) cat.scrollIntoView({ behavior: 'smooth' });
    };
    btn.addEventListener('click', doSearch);
    input.addEventListener('input', () => { filtroTexto = input.value.trim(); renderizarProductos(); });
    input.addEventListener('keypress', e => { if (e.key === 'Enter') doSearch(); });
}

function filtrarPorCategoriaExterna(cat) {
    categoriaActivaGlobal = cat || 'Todos';
    renderizarProductos();
    const titulo = document.querySelector('#catalogo .section-title');
    if (titulo) titulo.textContent = categoriaActivaGlobal === 'Todos' ? 'Nuestros Productos' : categoriaActivaGlobal;
}

// Exponer para el script inline del index
window.filtrarPorCategoria = filtrarPorCategoriaExterna;

document.addEventListener('DOMContentLoaded', () => {
    actualizarHeader();
    renderizarProductos();
    setupNavLinks();
    setupCarrito();
    setupFavoritos();
    setupLogout();
    setupMobileMenu();
    setupSearch();
});
