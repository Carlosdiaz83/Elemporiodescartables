"use client";

import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  status: string;
}

interface Offer {
  id: string;
  salePrice: number;
  label: string;
  sortOrder: number;
  active: boolean;
  product: Product;
}

export default function OfferManager() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [label, setLabel] = useState("OFERTA");
  const [sortOrder, setSortOrder] = useState("0");

  async function fetchOffers() {
    const res = await fetch("/api/offers");
    setOffers(await res.json());
  }

  async function fetchProducts() {
    const res = await fetch("/api/products?includeAll=true");
    const data = await res.json();
    setProducts(data.filter((p: Product) => p.status === "activo"));
  }

  useEffect(() => {
    Promise.all([fetchOffers(), fetchProducts()]).finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProductId || !salePrice) return;
    await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: selectedProductId,
        salePrice: Number(salePrice),
        label,
        sortOrder: Number(sortOrder),
      }),
    });
    setSelectedProductId("");
    setSalePrice("");
    setLabel("OFERTA");
    setSortOrder("0");
    fetchOffers();
  }

  async function handleToggle(offer: Offer) {
    await fetch(`/api/offers/${offer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !offer.active }),
    });
    fetchOffers();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta oferta?")) return;
    await fetch(`/api/offers/${id}`, { method: "DELETE" });
    fetchOffers();
  }

  async function handleMoveUp(offer: Offer) {
    await fetch(`/api/offers/${offer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sortOrder: offer.sortOrder - 1 }),
    });
    fetchOffers();
  }

  async function handleMoveDown(offer: Offer) {
    await fetch(`/api/offers/${offer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sortOrder: offer.sortOrder + 1 }),
    });
    fetchOffers();
  }

  if (loading) {
    return <div className="text-gray-500 py-8 text-center">Cargando ofertas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Crear Oferta</h2>
        <p className="text-sm text-gray-500 mb-4">
          Seleccioná un producto, seteá el precio de oferta y el texto del banner.
        </p>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar producto...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ${p.price.toLocaleString("es-AR")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio de oferta ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 1500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta del banner</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="OFERTA, 2x1, DESCUENTO..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Orden de aparición</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Oferta
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Ofertas Activas ({offers.filter((o) => o.active).length})</h3>
        </div>
        {offers.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No hay ofertas creadas</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`p-4 flex items-center gap-4 ${!offer.active ? "opacity-50" : ""}`}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {offer.product.imageUrl ? (
                    <img src={offer.product.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">{offer.product.name}</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                      {offer.label}
                    </span>
                    {!offer.active && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactiva</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-0.5">
                    <span className="text-gray-400 line-through">
                      ${offer.product.price.toLocaleString("es-AR")}
                    </span>
                    <span className="text-red-500 font-bold">
                      ${offer.salePrice.toLocaleString("es-AR")}
                    </span>
                    <span className="text-gray-400 text-xs">· Orden: {offer.sortOrder}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleMoveUp(offer)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Subir"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleMoveDown(offer)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Bajar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleToggle(offer)}
                    className={`p-1.5 rounded transition-colors ${
                      offer.active
                        ? "text-green-500 hover:text-green-700 hover:bg-green-50"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                    title={offer.active ? "Desactivar" : "Activar"}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {offer.active ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </>
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
