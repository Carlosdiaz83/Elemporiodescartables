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

  const inputStyle = { border: "1px solid #E8E4DE", padding: "8px 12px", fontSize: "13px", borderRadius: "10px" };
  const focusClass = "focus:outline-none focus:ring-2 focus:ring-blue-primary/20";

  if (loading) {
    return <div style={{ fontSize: "13px", color: "#666", padding: "32px", textAlign: "center" }}>Cargando ofertas...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5" style={{ background: "white", border: "1px solid #E8E4DE" }}>
        <h2 className="font-bold" style={{ fontSize: "16px", color: "var(--color-blue-dark)", marginBottom: "4px" }}>Crear Oferta</h2>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "16px" }}>Seleccioná un producto, seteá el precio de oferta y el texto del banner.</p>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold mb-1" style={{ fontSize: "12px", color: "var(--color-blue-dark)" }}>Producto</label>
            <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className={`w-full rounded-xl ${focusClass}`} style={inputStyle} required>
              <option value="">Seleccionar producto...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — ${p.price.toLocaleString("es-AR")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1" style={{ fontSize: "12px", color: "var(--color-blue-dark)" }}>Precio de oferta ($)</label>
            <input type="number" step="0.01" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className={`w-full rounded-xl ${focusClass}`} style={inputStyle} placeholder="Ej: 1500" required />
          </div>
          <div>
            <label className="block font-bold mb-1" style={{ fontSize: "12px", color: "var(--color-blue-dark)" }}>Etiqueta del banner</label>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} className={`w-full rounded-xl ${focusClass}`} style={inputStyle} placeholder="OFERTA, 2x1, DESCUENTO..." />
          </div>
          <div>
            <label className="block font-bold mb-1" style={{ fontSize: "12px", color: "var(--color-blue-dark)" }}>Orden de aparición</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={`w-full rounded-xl ${focusClass}`} style={inputStyle} />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-xl font-bold text-white transition-colors cursor-pointer" style={{ padding: "8px 20px", fontSize: "13px", background: "var(--color-blue-primary)" }}>Crear Oferta</button>
          </div>
        </form>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #E8E4DE" }}>
        <div className="flex items-center justify-between" style={{ padding: "12px 16px", background: "#f8f6f3", borderBottom: "1px solid #E8E4DE" }}>
          <h3 className="font-bold" style={{ fontSize: "14px", color: "var(--color-blue-dark)" }}>Ofertas ({offers.filter((o) => o.active).length} activas)</h3>
        </div>
        {offers.length === 0 ? (
          <div className="p-10 text-center" style={{ fontSize: "13px", color: "#999" }}>No hay ofertas creadas</div>
        ) : (
          <div>
            {offers.map((offer) => (
              <div key={offer.id} className="flex items-center gap-3" style={{ padding: "10px 16px", borderBottom: "1px solid #f0ede8", opacity: offer.active ? 1 : 0.5 }}>
                <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: "48px", height: "48px", background: "#f8f6f3" }}>
                  {offer.product.imageUrl ? (
                    <img src={offer.product.imageUrl} alt="" className="w-full h-full" style={{ objectFit: "contain" }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ fontSize: "16px", opacity: 0.3 }}>📦</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold truncate" style={{ fontSize: "13px", color: "var(--color-blue-dark)" }}>{offer.product.name}</span>
                    <span className="rounded-full font-bold text-white" style={{ fontSize: "9px", padding: "2px 6px", background: "#D4380D" }}>{offer.label}</span>
                    {!offer.active && <span className="rounded-full font-bold" style={{ fontSize: "9px", padding: "2px 6px", background: "#f0ede8", color: "#999" }}>Inactiva</span>}
                  </div>
                  <div className="flex items-center gap-2" style={{ fontSize: "12px", marginTop: "2px" }}>
                    <span style={{ color: "#999", textDecoration: "line-through" }}>${offer.product.price.toLocaleString("es-AR")}</span>
                    <span className="font-bold" style={{ color: "#D4380D" }}>${offer.salePrice.toLocaleString("es-AR")}</span>
                    <span style={{ fontSize: "10px", color: "#999" }}>· {offer.sortOrder}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleMoveUp(offer)} style={{ padding: "4px", fontSize: "12px", color: "#999", cursor: "pointer" }} title="Subir">▲</button>
                  <button onClick={() => handleMoveDown(offer)} style={{ padding: "4px", fontSize: "12px", color: "#999", cursor: "pointer" }} title="Bajar">▼</button>
                  <button onClick={() => handleToggle(offer)} style={{ padding: "4px", fontSize: "12px", color: offer.active ? "#1A7A4A" : "#999", cursor: "pointer" }} title={offer.active ? "Desactivar" : "Activar"}>
                    {offer.active ? "◉" : "○"}
                  </button>
                  <button onClick={() => handleDelete(offer.id)} style={{ padding: "4px", fontSize: "12px", color: "#C0392B", cursor: "pointer" }} title="Eliminar">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
