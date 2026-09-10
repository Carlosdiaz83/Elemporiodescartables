// ============================================================
//  DATOS DE PRODUCTOS - El Emporio Descartables
//  Precios actualizados según lista de precios oficial
//  Para editar precios: modificar el campo "precio" de cada producto
//  Para ocultar un producto: agregar  activo: false
// ============================================================

const PRODUCTOS = [

    // =========================================================
    // ALUMINIO
    // =========================================================
    {
        id: 101, categoria: "Aluminio", activo: true,
        nombre: "Aluminio 1 kg Rollo",
        unidad: "Rollo",
        precio: 11000,
        imagen: "img/producto-placeholder.svg",
        alt: "Aluminio 1 kg Rollo"
    },
    {
        id: 102, categoria: "Aluminio", activo: true,
        nombre: "Aluminio Familiar Rollo",
        unidad: "Rollo",
        precio: 1200,
        imagen: "img/producto-placeholder.svg",
        alt: "Aluminio Familiar Rollo"
    },
    {
        id: 103, categoria: "Aluminio", activo: true,
        nombre: "Bandeja Aluminio F-50",
        unidad: "Unidad",
        precio: 300,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja Aluminio F-50"
    },
    {
        id: 104, categoria: "Aluminio", activo: true,
        nombre: "Bandeja Aluminio F200",
        unidad: "Unidad",
        precio: 700,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja Aluminio F200"
    },
    {
        id: 105, categoria: "Aluminio", activo: true,
        nombre: "Bandeja Aluminio P-23",
        unidad: "Unidad",
        precio: 400,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja Aluminio P-23"
    },
    {
        id: 106, categoria: "Aluminio", activo: true,
        nombre: "Bandeja Aluminio P14",
        unidad: "Unidad",
        precio: 300,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja Aluminio P14"
    },
    {
        id: 107, categoria: "Aluminio", activo: true,
        nombre: "Bandeja Aluminio P30",
        unidad: "Unidad",
        precio: 600,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja Aluminio P30"
    },
    {
        id: 108, categoria: "Aluminio", activo: true,
        nombre: "Budinera Aluminio",
        unidad: "Unidad",
        precio: 300,
        imagen: "img/producto-placeholder.svg",
        alt: "Budinera Aluminio"
    },

    // =========================================================
    // BANDEJAS
    // =========================================================
    {
        id: 201, categoria: "Bandejas", activo: true,
        nombre: "Bandeja 101 Work",
        unidad: "Pack",
        precio: 6500,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja 101"
    },
    {
        id: 202, categoria: "Bandejas", activo: true,
        nombre: "Bandeja 102 Work",
        unidad: "Pack",
        precio: 7400,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja 102"
    },
    {
        id: 203, categoria: "Bandejas", activo: true,
        nombre: "Bandeja 103 Work",
        unidad: "Pack",
        precio: 9800,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja 103"
    },
    {
        id: 204, categoria: "Bandejas", activo: true,
        nombre: "Bandeja 103 x 90 unidades",
        unidad: "Pack",
        precio: 9700,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja 103 x90"
    },
    {
        id: 205, categoria: "Bandejas", activo: true,
        nombre: "Bandeja 105 Ovalada Work",
        unidad: "Pack",
        precio: 12000,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja 105 Ovalada"
    },
    {
        id: 206, categoria: "Bandejas", activo: true,
        nombre: "Bandeja 105 Ovalada Work",
        unidad: "Unidad",
        precio: 200,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja 105 Ovalada Unidad"
    },
    {
        id: 207, categoria: "Bandejas", activo: true,
        nombre: "Bandeja 105 Rectangular Work",
        unidad: "Pack",
        precio: 22000,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja 105 Rectangular"
    },
    {
        id: 208, categoria: "Bandejas", activo: true,
        nombre: "Bandeja 105 x 90 unidades",
        unidad: "Pack",
        precio: 13000,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja 105 x90"
    },
    {
        id: 209, categoria: "Bandejas", activo: true,
        nombre: "Bandeja 107 Work",
        unidad: "Pack",
        precio: 25000,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja 107"
    },
    {
        id: 210, categoria: "Bandejas", activo: true,
        nombre: "Bandeja Bisagra W5 A",
        unidad: "Unidad",
        precio: 350,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja Bisagra W5"
    },
    {
        id: 211, categoria: "Bandejas", activo: true,
        nombre: "Bandeja Bisagra W6 A",
        unidad: "Unidad",
        precio: 400,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja Bisagra W6"
    },
    {
        id: 212, categoria: "Bandejas", activo: true,
        nombre: "Bandeja Expandido N° 15",
        unidad: "Pack",
        precio: 150,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja Expandido N15"
    },
    {
        id: 213, categoria: "Bandejas", activo: true,
        nombre: "Bandeja Expandido N° 17",
        unidad: "Pack",
        precio: 80,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja Expandido N17"
    },
    {
        id: 214, categoria: "Bandejas", activo: true,
        nombre: "Bandeja Expandido N° 19",
        unidad: "Pack",
        precio: 150,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja Expandido N19"
    },
    {
        id: 215, categoria: "Bandejas", activo: true,
        nombre: "Bandeja Expandido N° 21",
        unidad: "Pack",
        precio: 80,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja Expandido N21"
    },
    {
        id: 216, categoria: "Bandejas", activo: true,
        nombre: "Bandeja Expandido N° 25",
        unidad: "Pack",
        precio: 250,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja Expandido N25"
    },
    {
        id: 217, categoria: "Bandejas", activo: true,
        nombre: "Bandeja Expandido N° 28 Pizza",
        unidad: "Pack",
        precio: 250,
        imagen: "img/producto-placeholder.svg",
        alt: "Bandeja Expandido N28 Pizza"
    },
    {
        id: 218, categoria: "Bandejas", activo: true,
        nombre: "Blanda Plástica 2 kg",
        unidad: "Pack",
        precio: 2000,
        imagen: "img/producto-placeholder.svg",
        alt: "Blanda Plástica 2kg"
    },
    {
        id: 219, categoria: "Bandejas", activo: true,
        nombre: "Blanda Plástica 360",
        unidad: "Pack",
        precio: 2500,
        imagen: "img/producto-placeholder.svg",
        alt: "Blanda Plástica 360"
    },
    {
        id: 220, categoria: "Bandejas", activo: true,
        nombre: "Ensaladera Bowl 900cc PET",
        unidad: "Pack x 10 un.",
        precio: 800,
        imagen: "img/producto-placeholder.svg",
        alt: "Ensaladera Bowl 900cc PET"
    },

    // =========================================================
    // BOLSAS
    // =========================================================
    {
        id: 301, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Residuo 45x60",
        unidad: "Pack x 10 un.",
        precio: 1200,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Residuo 45x60"
    },
    {
        id: 302, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Compactadora 85x110",
        unidad: "Pack x 10 un.",
        precio: 2300,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Compactadora 85x110"
    },
    {
        id: 303, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Compactadora 90x120",
        unidad: "Pack x 10 un.",
        precio: 2500,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Compactadora 90x120"
    },
    {
        id: 304, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Consorcio",
        unidad: "Pack x 10 un.",
        precio: 1200,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Consorcio"
    },
    {
        id: 305, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Emblocada 15x20",
        unidad: "Pack",
        precio: 900,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Emblocada 15x20"
    },
    {
        id: 306, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Emblocada 20x30",
        unidad: "Pack",
        precio: 1300,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Emblocada 20x30"
    },
    {
        id: 307, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Emblocada 25x35",
        unidad: "Pack",
        precio: 1800,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Emblocada 25x35"
    },
    {
        id: 308, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Emblocada 30x40",
        unidad: "Pack",
        precio: 2500,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Emblocada 30x40"
    },
    {
        id: 309, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Polipropileno (PPP) 10x15",
        unidad: "Pack",
        precio: 1040,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa PPP 10x15"
    },
    {
        id: 310, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Polipropileno (PPP) 15x25",
        unidad: "Pack",
        precio: 2040,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa PPP 15x25"
    },
    {
        id: 311, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Polipropileno (PPP) 20x30",
        unidad: "Pack",
        precio: 2800,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa PPP 20x30"
    },
    {
        id: 312, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Polipropileno (PPP) 30x40",
        unidad: "Pack",
        precio: 5200,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa PPP 30x40"
    },
    {
        id: 313, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Polipropileno (PPP) 40x50",
        unidad: "Pack",
        precio: 8600,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa PPP 40x50"
    },
    {
        id: 314, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Polipropileno (PPP) 50x70",
        unidad: "Pack",
        precio: 12400,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa PPP 50x70"
    },
    {
        id: 315, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Rendidor 25x35",
        unidad: "Pack",
        precio: 9500,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Rendidor 25x35"
    },
    {
        id: 316, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Rendidor 40x50",
        unidad: "Pack",
        precio: 11000,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Rendidor 40x50"
    },
    {
        id: 317, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Rendidor 45x60",
        unidad: "Pack",
        precio: 13800,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Rendidor 45x60"
    },
    {
        id: 318, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Riñón Fantasía 20x30",
        unidad: "Pack x 50 un.",
        precio: 3500,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Riñón Fantasía 20x30"
    },
    {
        id: 319, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Riñón Fantasía 30x40",
        unidad: "Pack x 50 un.",
        precio: 5300,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Riñón Fantasía 30x40"
    },
    {
        id: 320, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Riñón Fantasía 40x50",
        unidad: "Pack x 50 un.",
        precio: 8200,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Riñón Fantasía 40x50"
    },
    {
        id: 321, categoria: "Bolsas", activo: true,
        nombre: "Bolsa Riñón Fantasía 50x60",
        unidad: "Pack x 50 un.",
        precio: 16900,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Riñón Fantasía 50x60"
    },
    {
        id: 322, categoria: "Bolsas", activo: true,
        nombre: "Bolsas Areneras 33x60",
        unidad: "Pack x 10 un.",
        precio: 1300,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsas Areneras 33x60"
    },
    {
        id: 323, categoria: "Bolsas", activo: true,
        nombre: "Rollo Precorte 500 buenas 15x20",
        unidad: "Rollo",
        precio: 3700,
        imagen: "img/producto-placeholder.svg",
        alt: "Rollo Precorte 15x20"
    },
    {
        id: 324, categoria: "Bolsas", activo: true,
        nombre: "Rollo Precorte Roland 750g",
        unidad: "Rollo",
        precio: 8500,
        imagen: "img/producto-placeholder.svg",
        alt: "Rollo Precorte Roland 750g"
    },

    // =========================================================
    // BOLSAS DE PAPEL KRAFT
    // =========================================================
    {
        id: 401, categoria: "Bolsas Kraft", activo: true,
        nombre: "Bolsa Kraft N° 1 Ecoroyal",
        unidad: "Pack",
        precio: 1600,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Kraft N1"
    },
    {
        id: 402, categoria: "Bolsas Kraft", activo: true,
        nombre: "Bolsa Kraft N° 2 Ecoroyal",
        unidad: "Pack",
        precio: 1800,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Kraft N2"
    },
    {
        id: 403, categoria: "Bolsas Kraft", activo: true,
        nombre: "Bolsa Kraft N° 3 Ecoroyal",
        unidad: "Pack",
        precio: 1900,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Kraft N3"
    },
    {
        id: 404, categoria: "Bolsas Kraft", activo: true,
        nombre: "Bolsa Kraft N° 4 Ecoroyal",
        unidad: "Pack",
        precio: 2600,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Kraft N4"
    },
    {
        id: 405, categoria: "Bolsas Kraft", activo: true,
        nombre: "Bolsa Kraft N° 5 Ecoroyal",
        unidad: "Pack",
        precio: 2700,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Kraft N5"
    },
    {
        id: 406, categoria: "Bolsas Kraft", activo: true,
        nombre: "Bolsa Kraft N° 6 Ecoroyal",
        unidad: "Pack",
        precio: 2850,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Kraft N6"
    },
    {
        id: 407, categoria: "Bolsas Kraft", activo: true,
        nombre: "Bolsa Kraft N° 7 Ecoroyal",
        unidad: "Pack",
        precio: 4000,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Kraft N7"
    },
    {
        id: 408, categoria: "Bolsas Kraft", activo: true,
        nombre: "Bolsa Kraft N° 8 Ecoroyal",
        unidad: "Pack",
        precio: 4700,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa Kraft N8"
    },
    {
        id: 409, categoria: "Bolsas Kraft", activo: true,
        nombre: "Bolsa para 1 Vino",
        unidad: "Unidad",
        precio: 500,
        imagen: "img/producto-placeholder.svg",
        alt: "Bolsa para Vino"
    },

    // =========================================================
    // CAJAS Y CONOS
    // =========================================================
    {
        id: 501, categoria: "Cajas", activo: true,
        nombre: "Caja 1/2 Pizza",
        unidad: "Bulto x 50",
        precio: 10100,
        imagen: "img/producto-placeholder.svg",
        alt: "Caja 1/2 Pizza"
    },
    {
        id: 502, categoria: "Cajas", activo: true,
        nombre: "Caja Empanada 45",
        unidad: "Pack x 10 un.",
        precio: 2000,
        imagen: "img/producto-placeholder.svg",
        alt: "Caja Empanada"
    },
    {
        id: 503, categoria: "Cajas", activo: true,
        nombre: "Caja Empanada 45",
        unidad: "Unidad",
        precio: 500,
        imagen: "img/producto-placeholder.svg",
        alt: "Caja Empanada Unidad"
    },
    {
        id: 504, categoria: "Cajas", activo: true,
        nombre: "Caja Lomo Chico 45",
        unidad: "Pack x 10 un.",
        precio: 1500,
        imagen: "img/producto-placeholder.svg",
        alt: "Caja Lomo Chico 45"
    },
    {
        id: 505, categoria: "Cajas", activo: true,
        nombre: "Caja Lomo Chico 45",
        unidad: "Unidad",
        precio: 200,
        imagen: "img/producto-placeholder.svg",
        alt: "Caja Lomo Chico Unidad"
    },
    {
        id: 506, categoria: "Cajas", activo: true,
        nombre: "Caja Pizza 45",
        unidad: "Pack x 10 un.",
        precio: 2500,
        imagen: "img/producto-placeholder.svg",
        alt: "Caja Pizza 45 Pack"
    },
    {
        id: 507, categoria: "Cajas", activo: true,
        nombre: "Caja Pizza 45",
        unidad: "Unidad",
        precio: 500,
        imagen: "img/producto-placeholder.svg",
        alt: "Caja Pizza 45 Unidad"
    },
    {
        id: 508, categoria: "Cajas", activo: true,
        nombre: "Cajas Tarta 27x25x10",
        unidad: "Unidad",
        precio: 1300,
        imagen: "img/producto-placeholder.svg",
        alt: "Caja Tarta"
    },
    {
        id: 509, categoria: "Cajas", activo: true,
        nombre: "Cajas Torta 30x30x15",
        unidad: "Unidad",
        precio: 1500,
        imagen: "img/producto-placeholder.svg",
        alt: "Caja Torta"
    },
    {
        id: 510, categoria: "Cajas", activo: true,
        nombre: "Cono de Papa",
        unidad: "Pack",
        precio: 3900,
        imagen: "img/producto-placeholder.svg",
        alt: "Cono de Papa"
    },
    {
        id: 511, categoria: "Cajas", activo: true,
        nombre: "Porta Pancho",
        unidad: "Pack x 100 un.",
        precio: 2500,
        imagen: "img/producto-placeholder.svg",
        alt: "Porta Pancho Pack"
    },
    {
        id: 512, categoria: "Cajas", activo: true,
        nombre: "Porta Pancho",
        unidad: "Unidad",
        precio: 600,
        imagen: "img/producto-placeholder.svg",
        alt: "Porta Pancho Unidad"
    },
    {
        id: 513, categoria: "Cajas", activo: true,
        nombre: "Caja Ravioles",
        unidad: "Bulto",
        precio: 9700,
        imagen: "img/producto-placeholder.svg",
        alt: "Caja Ravioles"
    },

    // =========================================================
    // CAMISETAS (bolsas tipo camiseta)
    // =========================================================
    {
        id: 601, categoria: "Camisetas", activo: true,
        nombre: "Camiseta 30x40 Edición Amarilla",
        unidad: "Pack",
        precio: 1700,
        imagen: "img/producto-placeholder.svg",
        alt: "Camiseta 30x40 Amarilla"
    },
    {
        id: 602, categoria: "Camisetas", activo: true,
        nombre: "Camiseta 30x40 Nicole Negra",
        unidad: "Pack",
        precio: 1300,
        imagen: "img/producto-placeholder.svg",
        alt: "Camiseta 30x40 Nicole Negra"
    },
    {
        id: 603, categoria: "Camisetas", activo: true,
        nombre: "Camiseta 40x50 Eco Celeste",
        unidad: "Pack",
        precio: 2200,
        imagen: "img/producto-placeholder.svg",
        alt: "Camiseta 40x50 Celeste"
    },
    {
        id: 604, categoria: "Camisetas", activo: true,
        nombre: "Camiseta 40x50 Mariscal blanca",
        unidad: "Pack",
        precio: 2500,
        imagen: "img/producto-placeholder.svg",
        alt: "Camiseta 40x50 Mariscal"
    },
    {
        id: 605, categoria: "Camisetas", activo: true,
        nombre: "Camiseta 45x60 Mamut",
        unidad: "Pack",
        precio: 5400,
        imagen: "img/producto-placeholder.svg",
        alt: "Camiseta 45x60 Mamut"
    },
    {
        id: 606, categoria: "Camisetas", activo: true,
        nombre: "Camiseta 50x70 Eco",
        unidad: "Pack",
        precio: 3900,
        imagen: "img/producto-placeholder.svg",
        alt: "Camiseta 50x70 Eco"
    },
    {
        id: 607, categoria: "Camisetas", activo: true,
        nombre: "Camiseta 60x80 Roland",
        unidad: "Pack",
        precio: 13000,
        imagen: "img/producto-placeholder.svg",
        alt: "Camiseta 60x80 Roland"
    },

    // =========================================================
    // FILM Y FOLEX
    // =========================================================
    {
        id: 701, categoria: "Film y Folex", activo: true,
        nombre: "Film Familiar 38x300 New Pack",
        unidad: "Rollo",
        precio: 9100,
        imagen: "img/producto-placeholder.svg",
        alt: "Film Familiar 38x300"
    },
    {
        id: 702, categoria: "Film y Folex", activo: true,
        nombre: "Film Resinite 300x1000 mts",
        unidad: "Rollo",
        precio: 58350,
        imagen: "img/producto-placeholder.svg",
        alt: "Film Resinite 300x1000"
    },
    {
        id: 703, categoria: "Film y Folex", activo: true,
        nombre: "Film Stretch 10cm Cristal 500gr",
        unidad: "Rollo",
        precio: 4000,
        imagen: "img/producto-placeholder.svg",
        alt: "Film Stretch Cristal"
    },
    {
        id: 704, categoria: "Film y Folex", activo: true,
        nombre: "Film Stretch 10cm Negro 500gr",
        unidad: "Rollo",
        precio: 4500,
        imagen: "img/producto-placeholder.svg",
        alt: "Film Stretch Negro"
    },
    {
        id: 705, categoria: "Film y Folex", activo: true,
        nombre: "Film Stretch x 2.50kg Mango",
        unidad: "Rollo",
        precio: 14000,
        imagen: "img/producto-placeholder.svg",
        alt: "Film Stretch Mango"
    },
    {
        id: 706, categoria: "Film y Folex", activo: true,
        nombre: "Folex Hamburguesa",
        unidad: "Pack",
        precio: 12000,
        imagen: "img/producto-placeholder.svg",
        alt: "Folex Hamburguesa"
    },
    {
        id: 707, categoria: "Film y Folex", activo: true,
        nombre: "Folex Lami Polimundi",
        unidad: "Pack",
        precio: 10000,
        imagen: "img/producto-placeholder.svg",
        alt: "Folex Lami Polimundi"
    },

    // =========================================================
    // PAPEL Y CARTÓN
    // =========================================================
    {
        id: 801, categoria: "Papel y Cartón", activo: true,
        nombre: "Cartón N° 1",
        unidad: "Pack",
        precio: 2000,
        imagen: "img/producto-placeholder.svg",
        alt: "Cartón N1"
    },
    {
        id: 802, categoria: "Papel y Cartón", activo: true,
        nombre: "Cartón N° 2",
        unidad: "Pack",
        precio: 2500,
        imagen: "img/producto-placeholder.svg",
        alt: "Cartón N2"
    },
    {
        id: 803, categoria: "Papel y Cartón", activo: true,
        nombre: "Cartón N° 3",
        unidad: "Pack",
        precio: 3200,
        imagen: "img/producto-placeholder.svg",
        alt: "Cartón N3"
    },
    {
        id: 804, categoria: "Papel y Cartón", activo: true,
        nombre: "Cartón N° 4",
        unidad: "Pack",
        precio: 3800,
        imagen: "img/producto-placeholder.svg",
        alt: "Cartón N4"
    },
    {
        id: 805, categoria: "Papel y Cartón", activo: true,
        nombre: "Cartón N° 5",
        unidad: "Pack",
        precio: 5000,
        imagen: "img/producto-placeholder.svg",
        alt: "Cartón N5"
    },
    {
        id: 806, categoria: "Papel y Cartón", activo: true,
        nombre: "Cartón N° 6",
        unidad: "Pack",
        precio: 5800,
        imagen: "img/producto-placeholder.svg",
        alt: "Cartón N6"
    },
    {
        id: 807, categoria: "Papel y Cartón", activo: true,
        nombre: "Cartón N° 8",
        unidad: "Pack",
        precio: 7000,
        imagen: "img/producto-placeholder.svg",
        alt: "Cartón N8"
    },
    {
        id: 808, categoria: "Papel y Cartón", activo: true,
        nombre: "Cartón Redondo N° 12",
        unidad: "Pack x 100 un.",
        precio: 2600,
        imagen: "img/producto-placeholder.svg",
        alt: "Cartón Redondo N12"
    },
    {
        id: 809, categoria: "Papel y Cartón", activo: true,
        nombre: "Cartón Redondo N° 14",
        unidad: "Pack x 100 un.",
        precio: 5000,
        imagen: "img/producto-placeholder.svg",
        alt: "Cartón Redondo N14"
    },
    {
        id: 810, categoria: "Papel y Cartón", activo: true,
        nombre: "Cartón Redondo N° 15",
        unidad: "Pack x 100 un.",
        precio: 9300,
        imagen: "img/producto-placeholder.svg",
        alt: "Cartón Redondo N15"
    },
    {
        id: 811, categoria: "Papel y Cartón", activo: true,
        nombre: "Cinta Papel 24x50",
        unidad: "Unidad",
        precio: 2500,
        imagen: "img/producto-placeholder.svg",
        alt: "Cinta Papel 24x50"
    },
    {
        id: 812, categoria: "Papel y Cartón", activo: true,
        nombre: "Papel Higiénico Black 300mts",
        unidad: "Pack",
        precio: 1500,
        imagen: "img/producto-placeholder.svg",
        alt: "Papel Higiénico Black"
    },
    {
        id: 813, categoria: "Papel y Cartón", activo: true,
        nombre: "Papel Impreso Panadería",
        unidad: "Pack",
        precio: 3000,
        imagen: "img/producto-placeholder.svg",
        alt: "Papel Impreso Panadería"
    },
    {
        id: 814, categoria: "Papel y Cartón", activo: true,
        nombre: "Papel Manteca",
        unidad: "Pack",
        precio: 4400,
        imagen: "img/producto-placeholder.svg",
        alt: "Papel Manteca"
    },
    {
        id: 815, categoria: "Papel y Cartón", activo: true,
        nombre: "Papel Sulfito Copsi 40x50",
        unidad: "Pack",
        precio: 2400,
        imagen: "img/producto-placeholder.svg",
        alt: "Papel Sulfito Copsi 40x50"
    },
    {
        id: 816, categoria: "Papel y Cartón", activo: true,
        nombre: "Papel Sulfito Sein 40x50",
        unidad: "Pack",
        precio: 3700,
        imagen: "img/producto-placeholder.svg",
        alt: "Papel Sulfito Sein 40x50"
    },
    {
        id: 817, categoria: "Papel y Cartón", activo: true,
        nombre: "Pre Pizza Impresa",
        unidad: "Pack",
        precio: 5300,
        imagen: "img/producto-placeholder.svg",
        alt: "Pre Pizza Impresa"
    },
    {
        id: 818, categoria: "Papel y Cartón", activo: true,
        nombre: "Rollo Papel 200 paños Elegante",
        unidad: "Pack",
        precio: 2700,
        imagen: "img/producto-placeholder.svg",
        alt: "Rollo Papel 200 paños"
    },

    // =========================================================
    // POTES Y VASOS
    // =========================================================
    {
        id: 901, categoria: "Vasos y Potes", activo: true,
        nombre: "Pote 1 kg con tapa",
        unidad: "Pack x 100 un.",
        precio: 50000,
        imagen: "img/producto-placeholder.svg",
        alt: "Pote 1kg con tapa"
    },
    {
        id: 902, categoria: "Vasos y Potes", activo: true,
        nombre: "Pote 1 kg con tapa",
        unidad: "Unidad",
        precio: 600,
        imagen: "img/producto-placeholder.svg",
        alt: "Pote 1kg Unidad"
    },
    {
        id: 903, categoria: "Vasos y Potes", activo: true,
        nombre: "Pote 1/2",
        unidad: "Unidad",
        precio: 250,
        imagen: "img/producto-placeholder.svg",
        alt: "Pote 1/2"
    },
    {
        id: 904, categoria: "Vasos y Potes", activo: true,
        nombre: "Pote 1/4",
        unidad: "Unidad",
        precio: 200,
        imagen: "img/producto-placeholder.svg",
        alt: "Pote 1/4"
    },
    {
        id: 905, categoria: "Vasos y Potes", activo: true,
        nombre: "Pote Bisagra PET PB 42/250",
        unidad: "Unidad",
        precio: 400,
        imagen: "img/producto-placeholder.svg",
        alt: "Pote Bisagra PB 42/250"
    },
    {
        id: 906, categoria: "Vasos y Potes", activo: true,
        nombre: "Pote Bisagra PET PB 42/250",
        unidad: "Pack x 100 un.",
        precio: 25600,
        imagen: "img/producto-placeholder.svg",
        alt: "Pote Bisagra PB Pack"
    },
    {
        id: 907, categoria: "Vasos y Potes", activo: true,
        nombre: "Pote Bisagra PET PB 70/500",
        unidad: "Pack x 100 un.",
        precio: 32200,
        imagen: "img/producto-placeholder.svg",
        alt: "Pote Bisagra PB 70/500"
    },
    {
        id: 908, categoria: "Vasos y Potes", activo: true,
        nombre: "Pote Degustación",
        unidad: "Pack x 100 un.",
        precio: 3600,
        imagen: "img/producto-placeholder.svg",
        alt: "Pote Degustación"
    },
    {
        id: 909, categoria: "Vasos y Potes", activo: true,
        nombre: "Vaso Degustación",
        unidad: "Unidad",
        precio: 50,
        imagen: "img/producto-placeholder.svg",
        alt: "Vaso Degustación"
    },

    // =========================================================
    // VAJILLA Y CUBIERTOS
    // =========================================================
    {
        id: 1001, categoria: "Utensilios", activo: true,
        nombre: "Cuchara Sopera",
        unidad: "Pack",
        precio: 2100,
        imagen: "img/producto-placeholder.svg",
        alt: "Cuchara Sopera"
    },
    {
        id: 1002, categoria: "Utensilios", activo: true,
        nombre: "Cucharita Sundae",
        unidad: "Pack",
        precio: 900,
        imagen: "img/producto-placeholder.svg",
        alt: "Cucharita Sundae"
    },
    {
        id: 1003, categoria: "Utensilios", activo: true,
        nombre: "Cucharitos para Helado",
        unidad: "x kg",
        precio: 3500,
        imagen: "img/producto-placeholder.svg",
        alt: "Cucharitos para Helado"
    },
    {
        id: 1004, categoria: "Utensilios", activo: true,
        nombre: "Cuchillos Plásticos",
        unidad: "Pack x 50 un.",
        precio: 1000,
        imagen: "img/producto-placeholder.svg",
        alt: "Cuchillos Plásticos"
    },
    {
        id: 1005, categoria: "Utensilios", activo: true,
        nombre: "Platitos 17cm",
        unidad: "Pack",
        precio: 4000,
        imagen: "img/producto-placeholder.svg",
        alt: "Platitos 17cm"
    },
    {
        id: 1006, categoria: "Utensilios", activo: true,
        nombre: "Platos 22cm",
        unidad: "Pack",
        precio: 4000,
        imagen: "img/producto-placeholder.svg",
        alt: "Platos 22cm"
    },

    // =========================================================
    // VARIOS
    // =========================================================
    {
        id: 1101, categoria: "Varios", activo: true,
        nombre: "Cinta Autoadhesiva 12x60",
        unidad: "Unidad",
        precio: 700,
        imagen: "img/producto-placeholder.svg",
        alt: "Cinta Autoadhesiva 12x60"
    },
    {
        id: 1102, categoria: "Varios", activo: true,
        nombre: "Cinta Autoadhesiva 24x50",
        unidad: "Unidad",
        precio: 1000,
        imagen: "img/producto-placeholder.svg",
        alt: "Cinta Autoadhesiva 24x50"
    },
    {
        id: 1103, categoria: "Varios", activo: true,
        nombre: "Cinta Autoadhesiva 48x50",
        unidad: "Unidad",
        precio: 1300,
        imagen: "img/producto-placeholder.svg",
        alt: "Cinta Autoadhesiva 48x50"
    },
    {
        id: 1104, categoria: "Varios", activo: true,
        nombre: "Espaditas",
        unidad: "x kg",
        precio: 17000,
        imagen: "img/producto-placeholder.svg",
        alt: "Espaditas"
    },
    {
        id: 1105, categoria: "Varios", activo: true,
        nombre: "Precintos",
        unidad: "Pack",
        precio: 2500,
        imagen: "img/producto-placeholder.svg",
        alt: "Precintos"
    }
];

// Productos sin stock (para referencia, no se muestran)
// Camiseta 40x50 Peco - sin stock
// Film Familiar 38x100 New Pack - sin stock
// Film Resinite 380x1000 mts - sin stock
// Bolsa Rendidor 20x25 - precio a consultar (#REF!)
