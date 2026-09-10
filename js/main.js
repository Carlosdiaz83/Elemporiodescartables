// ============================================================
//  MAIN.JS - El Emporio Descartables
//  Sistema de sesión, productos, favoritos y navegación
// ============================================================

// ---- Helpers de sesión ----
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
        const raw = localStorage.getItem('emporio_user');
        return raw ? JSON.parse(raw) : null;
    },
    isLogged() {
        return !!this.getUser();
    }
};

// ---- Helpers de favoritos ----
const Favoritos = {
    get() {
        return JSON.parse(localStorage.getItem('emporio_favs') || '[]');
    },
    toggle(id) {
        const favs = this.get();
        const idx = favs.indexOf(id);
        if (idx === -1) { favs.push(id); }
        else { favs.splice(idx, 1); }
        localStorage.setItem('emporio_favs', JSON.stringify(favs));
        return idx === -1; // true = agregado
    },
    has(id) { return this.get().includes(id); },
    count() { return this.get().length; }
};

// ---- Helpers de carrito (pedido) ----
const Carrito = {
    get() {
        return JSON.parse(localStorage.getItem('emporio_cart') || '[]');
    },
    add(productoId) {
        const cart = this.get();
        const item = cart.find(i => i.id === productoId);
        if (item) { item.qty++; }
        else { cart.push({ id: productoId, qty: 1 }); }
        localStorage.setItem('emporio_cart', JSON.stringify(cart));
    },
    count() {
        return this.get().reduce((sum, i) => sum + i.qty, 0);
    }
};

// ---- Formatear precio ARS ----
function formatPrecio(num) {
    return '$\u00a0' + num.toLocaleString('es-AR');
}

// ---- Actualizar el header según estado de sesión ----
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

// ---- Renderizar productos ----
function renderizarProductos() {
    const grid = document.getElementById('products-grid');
    if (!grid || typeof PRODUCTOS === 'undefined') return;

    const isLogged = Auth.isLogged();
    grid.innerHTML = '';

    PRODUCTOS.forEach(p => {
        const esFav = Favoritos.has(p.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${p.imagen}" alt="${p.alt}" loading="lazy">
            </div>
            <div class="product-info">
                <span class="category">${p.categoria}</span>
                <h3>${p.nombre}</h3>
                ${isLogged
                    ? `<div class="product-price">${formatPrecio(p.precio)}</div>`
                    : `<div class="product-price-locked" title="Iniciá sesión para ver el precio">
                           <i class="fas fa-lock"></i> Precio exclusivo — <a href="pages/login.html">Iniciá sesión</a>
                       </div>`
                }
                <div class="product-actions">
                    <button class="btn-outline btn-ver" data-id="${p.id}">Ver Producto</button>
                    <button class="btn-icon btn-fav ${esFav ? 'active' : ''}" data-id="${p.id}" title="Favoritos">
                        <i class="${esFav ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Eventos botones "Ver Producto"
    grid.querySelectorAll('.btn-ver').forEach(btn => {
        btn.addEventListener('click', () => {
            const prod = PRODUCTOS.find(p => p.id === parseInt(btn.dataset.id));
            mostrarToast(`Próximamente: página de ${prod.nombre}`, 'info');
        });
    });

    // Eventos favoritos
    grid.querySelectorAll('.btn-fav').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!Auth.isLogged()) {
                mostrarToast('Iniciá sesión para guardar favoritos', 'warning');
                return;
            }
            const id = parseInt(btn.dataset.id);
            const agregado = Favoritos.toggle(id);
            const icon = btn.querySelector('i');
            icon.className = agregado ? 'fas fa-heart' : 'far fa-heart';
            btn.classList.toggle('active', agregado);
            mostrarToast(agregado ? '❤️ Agregado a favoritos' : 'Eliminado de favoritos', agregado ? 'success' : 'info');
            actualizarHeader();
        });
    });
}

// ---- Toast de notificación ----
function mostrarToast(mensaje, tipo = 'info') {
    // Remover existente
    const anterior = document.getElementById('site-toast');
    if (anterior) anterior.remove();

    const t = document.createElement('div');
    t.id = 'site-toast';
    t.className = `site-toast toast-${tipo}`;
    t.innerHTML = `<span>${mensaje}</span>`;
    document.body.appendChild(t);

    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 400);
    }, 3000);
}

// ---- Smooth scroll para anclajes ----
function setupNavLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ---- Botón "Mi Pedido" ----
function setupCarrito() {
    const btn = document.getElementById('btn-mi-pedido');
    if (!btn) return;
    btn.addEventListener('click', e => {
        e.preventDefault();
        if (!Auth.isLogged()) {
            mostrarToast('Iniciá sesión para ver tu pedido', 'warning');
            setTimeout(() => window.location.href = 'pages/login.html', 1500);
            return;
        }
        const items = Carrito.count();
        mostrarToast(items ? `Tenés ${items} artículo(s) en tu pedido` : 'Tu pedido está vacío', 'info');
    });
}

// ---- Botón "Favoritos" ----
function setupFavoritos() {
    const btn = document.getElementById('btn-favoritos');
    if (!btn) return;
    btn.addEventListener('click', e => {
        e.preventDefault();
        if (!Auth.isLogged()) {
            mostrarToast('Iniciá sesión para ver tus favoritos', 'warning');
            setTimeout(() => window.location.href = 'pages/login.html', 1500);
            return;
        }
        const total = Favoritos.count();
        mostrarToast(total ? `Tenés ${total} producto(s) en favoritos` : 'Aún no tenés favoritos guardados', 'info');
    });
}

// ---- Cerrar sesión ----
function setupLogout() {
    const btn = document.getElementById('btn-logout');
    if (!btn) return;
    btn.addEventListener('click', e => {
        e.preventDefault();
        Auth.logout();
        mostrarToast('Sesión cerrada. ¡Hasta pronto!', 'info');
        setTimeout(() => window.location.reload(), 1200);
    });
}

// ---- Mobile menu ----
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => navMenu.classList.toggle('active'));
        document.addEventListener('click', e => {
            if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// ---- Search ----
function setupSearch() {
    const searchBar = document.querySelector('.search-bar');
    if (!searchBar) return;
    const input = searchBar.querySelector('input');
    const btn = searchBar.querySelector('button');
    const doSearch = () => {
        const q = input.value.trim();
        if (q) {
            // Scroll al catálogo y filtrar visualmente
            const cat = document.getElementById('catalogo');
            if (cat) cat.scrollIntoView({ behavior: 'smooth' });
            mostrarToast(`Buscando "${q}"…`, 'info');
        }
    };
    btn.addEventListener('click', doSearch);
    input.addEventListener('keypress', e => { if (e.key === 'Enter') doSearch(); });
}

// ============================================================
//  INIT
// ============================================================
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
