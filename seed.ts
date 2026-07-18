const { PrismaClient } = require("./src/generated/prisma/client.js");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const db = new PrismaClient({ adapter });

async function main() {
  // Clean
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.cartItem.deleteMany();
  await db.offer.deleteMany();
  await db.product.deleteMany();
  await db.session.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();

  const admin = await db.user.create({
    data: { email: "admin@test.com", name: "Admin Test", role: "admin" },
  });

  const cliente = await db.user.create({
    data: { email: "cliente@test.com", name: "Cliente Test", role: "cliente" },
  });

  const products = [
    { name: "Guantes Descartables Látex (100u)", description: "Guantes descartables de látex, talle M. Ideales para uso médico y gastronómico.", features: "Material: Látex | Talle: M | Cantidad: 100 unidades", price: 4500, stock: 150, status: "activo", category: "higiene" },
    { name: "Mascarillas Quirúrgicas (50u)", description: "Mascarillas descartables de 3 capas con elastómetro.", features: "Capas: 3 | Color: Azul | Certificado ANMAT", price: 3200, stock: 200, status: "activo", category: "higiene" },
    { name: "Vasos Descartables de Poliestireno (50u)", description: "Vasos descartables de 250ml ideales para eventos y negocios.", features: "Material: Poliestireno | Capacidad: 250ml", price: 2100, stock: 300, status: "activo", category: "vasos" },
    { name: "Platos Descartables de Cartón (30u)", description: "Platos descartables resistentes de cartón blanco.", features: "Material: Cartón | Tamaño: 20cm", price: 1800, stock: 250, status: "activo", category: "platos" },
    { name: "Servilletas de Papel (200u)", description: "Servilletas de papel dobladas, paquete de 200 unidades.", features: "Material: Papel | Color: Blanco", price: 900, stock: 0, status: "activo", category: "servilletas" },
    { name: "Papel Film Transparente (30m)", description: "Rollo de film transparente para envolver alimentos.", features: "Largo: 30m | Ancho: 30cm", price: 1200, stock: 80, status: "activo", category: "papelera" },
    { name: "Bolsas Basura 45L (30u)", description: "Bolsas de residuos negras de 45 litros.", features: "Capacidad: 45L | Color: Negro", price: 1500, stock: 120, status: "activo", category: "bolsas" },
    { name: "Copas Descartables de Plástico (20u)", description: "Copas elegantes de plástico transparente para eventos.", features: "Material: Plástico | Capacidad: 200ml", price: 2500, stock: 180, status: "activo", category: "vasos" },
    { name: "Tapers Descartables Rectangulares (20u)", description: "Tapers de alimento con tapa, aptos microondas.", features: "Material: PP | Capacidad: 500ml", price: 3800, stock: 4, status: "activo", category: "platos" },
    { name: "Cucharas Descartables (100u)", description: "Cucharas descartables de plástico blanco.", features: "Material: Plástico | Cantidad: 100", price: 1100, stock: 400, status: "activo", category: "cubiertos" },
    { name: "Mantel Descartable Rollo (5m)", description: "Mantel descartable de papel con estampado.", features: "Largo: 5m | Ancho: 1.2m", price: 2200, stock: 60, status: "activo", category: "papelera" },
    { name: "Aerosol Desinfectante 500ml", description: "Desinfectante multiusos en aerosol.", features: "Volumen: 500ml | Aroma: Lavanda", price: 1900, stock: 0, status: "activo", category: "higiene" },
  ];

  for (const p of products) {
    await db.product.create({ data: p });
  }

  // Offers
  const allProducts = await db.product.findMany({ where: { status: "activo" } });
  const offerProducts = allProducts.slice(0, 5);

  const offerData = [
    { label: "LIQUIDACIÓN", sortOrder: 0 },
    { label: "2x1", sortOrder: 1 },
    { label: "OFERTA DEL DÍA", sortOrder: 2 },
    { label: "RECOMENDADO", sortOrder: 3 },
    { label: "SUPER PRECIO", sortOrder: 4 },
  ];

  for (let i = 0; i < offerProducts.length; i++) {
    const p = offerProducts[i];
    await db.offer.create({
      data: {
        productId: p.id,
        salePrice: Math.round(p.price * 0.75),
        label: offerData[i].label,
        sortOrder: offerData[i].sortOrder,
        active: true,
      },
    });
  }

  console.log("Seed completado:");
  console.log("  Admin: admin@test.com");
  console.log("  Cliente: cliente@test.com");
  console.log("  Productos: " + products.length);
  console.log("  Ofertas: " + offerProducts.length);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
