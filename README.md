# El Emporio Descartables

Página web de venta por mayor de artículos descartables para revendedores y negocios de distribución.

## Estructura del Proyecto

```
Elemporiodescartables/   # trabajo solo en local, no pushear sin avisar
├── index.html          # Página principal + catálogo
├── css/styles.css      # Paleta morada del logo (#5B3680 / #3E235A / #C298E0)
├── js/
│   ├── productos.js    # Datos de productos (imagen local img/producto-placeholder.svg)
│   └── main.js         # Auth, carrito, favoritos, búsqueda (precios solo logueado)
├── img/
│   ├── logo.jpg                # Logo El Emporio
│   └── producto-placeholder.svg# Placeholder local (no usar imágenes externas)
└── pages/
    ├── login.html      # Login simulado Google/Facebook (localStorage)
    └── ...             # Páginas secundarias antiguas
```

## Funcionalidades

- Diseño responsive (adaptado a móviles y desktop)
- Menú de navegación con categorías
- Barrúsqueda
- Listado de productos con filtros
- Página de inicio de sesión
- Formulario de contacto
- Sección de nosotros

## Reglas del proyecto (local)

- Precios visibles SOLO si hay sesión (`emporio_user` en localStorage).
- Carrito y favoritos requieren login. Pedido se envía por WhatsApp.
- No usar imágenes de otros sitios. Reemplazar `img/producto-placeholder.svg` por fotos propias en `img/productos/`.
- Colores desde el logo: `--primary-color:#5B3680`, `--primary-dark:#3E235A`, `--primary-light:#C298E0`.

## Personalización

1. Logo ya en `img/logo.jpg`
2. Colores en `css/styles.css` (`:root`)
3. Productos y precios en `js/productos.js`
4. Fotos reales: agregar a `img/productos/` y actualizar campo `imagen`

## Panel administrador

- `admin.html` (o `/admin` en Netlify): espejo editable del sitio. Cada sección tiene botón Editar: hero, logo, características, productos (nombre, precio, unidad, visible), contacto y pie.
- Acceso en 2 pasos: `pages/admin-login.html` pide teléfono y luego Gmail (Google Identity). El servidor (`netlify/functions/validate-admin.js`) valida que AMBOS coincidan con `ADMIN_EMAIL` y `ADMIN_PHONE`. Si coinciden → rol `admin` + token firmado; si no → rol `customer` sin acceso.
- Edición protegida: `content-save` exige token admin (middleware `requireAdmin` en `netlify/functions/_auth.js`). Sin token válido responde 403.
- Contenido general en `data/content.json` (se lee con `content-get`).

## Variables de entorno (Netlify > Environment variables)

```
ADMIN_EMAIL=
ADMIN_PHONE=
GOOGLE_CLIENT_ID=
ADMIN_SESSION_SECRET=
WHATSAPP_NUMBER=5493512400816
```

Ver `.env.example`. El `.env` local está ignorado por git. Para probar functions en local: `netlify dev`.

## Desarrollado por

El Emporio Descartables
