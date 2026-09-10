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

## Desarrollado por

El Emporio Descartables
