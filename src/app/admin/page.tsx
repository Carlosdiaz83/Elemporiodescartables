"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ExcelUploader from "@/components/ExcelUploader";
import ProductEditor from "@/components/ProductEditor";
import OfferManager from "@/components/OfferManager";
import ImageDropzone from "@/components/ImageDropzone";

interface Product {
  id: string;
  name: string;
  description: string | null;
  features: string | null;
  category: string | null;
  price: number;
  imageUrl: string | null;
  stock: number;
  status: string;
}

type Tab = "dashboard" | "pendientes" | "productos" | "ofertas";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session && session.user?.role !== "admin") router.push("/home");
  }, [status, session, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?includeAll=true");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchProducts();
    }
  }, [status, session]);

  async function handleDelete(productId: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/products/${productId}`, { method: "DELETE" });
    fetchProducts();
  }

  async function handleStockUpdate(productId: string, stock: number) {
    await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });
    fetchProducts();
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="skeleton-shimmer rounded-xl" style={{ width: "200px", height: "24px" }} />
      </div>
    );
  }

  const activeProducts = products.filter((p) => p.status === "activo");
  const draftProducts = products.filter((p) => p.status === "borrador");
  const outOfStock = products.filter((p) => p.stock === 0 && p.status === "activo");

  const tabs: [Tab, string, number | null][] = [
    ["dashboard", "Dashboard", null],
    ["pendientes", "Cargar (Excel)", draftProducts.length > 0 ? draftProducts.length : null],
    ["productos", "Todos", null],
    ["ofertas", "Ofertas", null],
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F0EDE8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-5">
          <h1 className="font-black" style={{ fontSize: "22px", color: "var(--color-blue-dark)" }}>Panel de Administración</h1>
          <p style={{ fontSize: "13px", color: "#666" }}>Gestión de productos y catálogo</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl p-1 mb-5" style={{ background: "white", border: "1px solid #E8E4DE" }}>
          {tabs.map(([key, label, badge]) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setEditingProductId(null); }}
              className="flex-1 rounded-lg font-bold transition-colors relative cursor-pointer"
              style={{
                padding: "8px 12px",
                fontSize: "12px",
                background: activeTab === key ? "var(--color-blue-primary)" : "transparent",
                color: activeTab === key ? "white" : "#666",
              }}
            >
              {label}
              {badge !== null && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full font-extrabold text-white" style={{ fontSize: "9px", width: "16px", height: "16px", background: "#D4380D" }}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total", value: products.length, color: "var(--color-blue-dark)" },
                { label: "Activos", value: activeProducts.length, color: "#1A7A4A" },
                { label: "Pendientes", value: draftProducts.length, color: draftProducts.length > 0 ? "#D4380D" : "var(--color-blue-dark)" },
                { label: "Sin Stock", value: outOfStock.length, color: outOfStock.length > 0 ? "#C0392B" : "var(--color-blue-dark)" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl p-4" style={{ background: "white", border: "1px solid #E8E4DE" }}>
                  <div style={{ fontSize: "12px", color: "#666" }}>{stat.label}</div>
                  <div className="font-black" style={{ fontSize: "28px", color: stat.color, marginTop: "4px" }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {draftProducts.length > 0 && (
              <div className="rounded-xl p-4" style={{ background: "#FFF8E1", border: "1px solid #F0C040" }}>
                <p className="font-bold" style={{ fontSize: "14px", color: "#7A6010" }}>
                  Tenés {draftProducts.length} producto{draftProducts.length !== 1 && "s"} pendiente{draftProducts.length !== 1 && "s"}
                </p>
                <p style={{ fontSize: "12px", color: "#9A8030", marginTop: "4px" }}>Completá los datos y publicalos para que aparezcan en el catálogo.</p>
                <button onClick={() => setActiveTab("pendientes")} className="mt-2 font-bold underline" style={{ fontSize: "12px", color: "var(--color-blue-primary)", cursor: "pointer" }}>
                  Ir a completar →
                </button>
              </div>
            )}

            {outOfStock.length > 0 && (
              <div className="rounded-xl p-4" style={{ background: "#FEE", border: "1px solid #f5c6c2" }}>
                <p className="font-bold" style={{ fontSize: "14px", color: "#C0392B" }}>
                  {outOfStock.length} producto{outOfStock.length !== 1 && "s"} sin stock
                </p>
              </div>
            )}
          </div>
        )}

        {/* Excel + Drafts */}
        {activeTab === "pendientes" && (
          <div className="space-y-5">
            {editingProductId ? (
              <ProductEditor
                product={products.find((p) => p.id === editingProductId)!}
                onSaved={() => { setEditingProductId(null); fetchProducts(); }}
                onCancel={() => setEditingProductId(null)}
              />
            ) : (
              <>
                <div className="rounded-xl p-5" style={{ background: "white", border: "1px solid #E8E4DE" }}>
                  <h2 className="font-bold" style={{ fontSize: "16px", color: "var(--color-blue-dark)", marginBottom: "4px" }}>
                    Cargar productos desde Excel
                  </h2>
                  <p style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>
                    Subí un archivo Excel. Se extraerán los nombres y se crearán como borradores.
                  </p>
                  <ExcelUploader onImportComplete={() => fetchProducts()} />
                </div>

                <div style={{ borderTop: "1px solid #E8E4DE", paddingTop: "16px" }}>
                  <h2 className="font-bold" style={{ fontSize: "16px", color: "var(--color-blue-dark)", marginBottom: "12px" }}>
                    Pendientes ({draftProducts.length})
                  </h2>

                  {draftProducts.length === 0 ? (
                    <div className="rounded-xl p-10 text-center" style={{ background: "white", border: "1px solid #E8E4DE" }}>
                      <p style={{ fontSize: "14px", color: "#999" }}>No hay productos pendientes</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {draftProducts.map((product) => (
                        <DraftProductCard
                          key={product.id}
                          product={product}
                          onEdit={() => setEditingProductId(product.id)}
                          onDelete={handleDelete}
                          onRefresh={fetchProducts}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* All products */}
        {activeTab === "productos" && (
          <div className="space-y-3">
            {editingProductId ? (
              <ProductEditor
                product={products.find((p) => p.id === editingProductId)!}
                onSaved={() => { setEditingProductId(null); fetchProducts(); }}
                onCancel={() => setEditingProductId(null)}
              />
            ) : (
              <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #E8E4DE" }}>
                {products.length === 0 ? (
                  <div className="p-8 text-center" style={{ color: "#999" }}>No hay productos.</div>
                ) : (
                  <div>
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center gap-3" style={{ padding: "12px 16px", borderBottom: "1px solid #f0ede8" }}>
                        <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: "48px", height: "48px", background: "#f8f6f3" }}>
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt="" className="w-full h-full" style={{ objectFit: "contain" }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ fontSize: "16px", opacity: 0.3 }}>📦</div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold truncate" style={{ fontSize: "13px", color: "var(--color-blue-dark)" }}>{product.name}</span>
                            <span className="rounded-full font-bold text-white" style={{ fontSize: "9px", padding: "2px 6px", background: product.status === "activo" ? "#1A7A4A" : "#D4380D" }}>
                              {product.status}
                            </span>
                            {product.stock === 0 && product.status === "activo" && (
                              <span className="rounded-full font-bold text-white" style={{ fontSize: "9px", padding: "2px 6px", background: "#C0392B" }}>0</span>
                            )}
                          </div>
                          <p style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                            ${product.price.toLocaleString("es-AR")} · Stock: {product.stock}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => setEditingProductId(product.id)}
                            className="rounded-lg font-bold text-white transition-colors cursor-pointer"
                            style={{ padding: "5px 10px", fontSize: "11px", background: "var(--color-blue-primary)" }}
                          >
                            Editar
                          </button>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleStockUpdate(product.id, Math.max(0, product.stock - 1))}
                              style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E8E4DE", borderRadius: "6px 0 0 6px", background: "white", fontSize: "12px", cursor: "pointer" }}
                            >−</button>
                            <span className="text-center font-bold" style={{ fontSize: "12px", minWidth: "28px", borderBlock: "1px solid #E8E4DE", lineHeight: "26px" }}>{product.stock}</span>
                            <button
                              onClick={() => handleStockUpdate(product.id, product.stock + 1)}
                              style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E8E4DE", borderRadius: "0 6px 6px 0", background: "white", fontSize: "12px", cursor: "pointer" }}
                            >+</button>
                          </div>
                          <button
                            onClick={() => handleDelete(product.id)}
                            style={{ padding: "5px", color: "#C0392B", fontSize: "14px", cursor: "pointer" }}
                          >✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Offers */}
        {activeTab === "ofertas" && <OfferManager />}
      </div>
    </div>
  );
}

function DraftProductCard({
  product,
  onEdit,
  onDelete,
  onRefresh,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [imageUrl, setImageUrl] = useState(product.imageUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleQuickSave(status: "borrador" | "activo") {
    setSaving(true);
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || null,
          price: parseFloat(price) || 0,
          stock: parseInt(stock, 10) || 0,
          imageUrl: imageUrl || null,
          status,
        }),
      });
      setSaved(true);
      setTimeout(() => onRefresh(), 500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <div className="rounded-xl p-3 flex items-center gap-2" style={{ background: "#E8F5E9", border: "1px solid #A5D6A7" }}>
        <span style={{ fontSize: "14px", color: "#1A7A4A" }}>✓</span>
        <span className="font-bold" style={{ fontSize: "13px", color: "#1A7A4A" }}>{name} guardado</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #E8E4DE" }}>
      <div className="flex items-center justify-between" style={{ padding: "10px 14px", background: "#f8f6f3", borderBottom: "1px solid #E8E4DE" }}>
        <h3 className="font-bold truncate flex-1 mr-2" style={{ fontSize: "13px", color: "var(--color-blue-dark)" }}>{name}</h3>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={onEdit} style={{ fontSize: "11px", color: "var(--color-blue-primary)", fontWeight: 700, padding: "2px 8px", cursor: "pointer" }}>Editor</button>
          <button onClick={() => onDelete(product.id)} style={{ fontSize: "11px", color: "#C0392B", padding: "2px 8px", cursor: "pointer" }}>Eliminar</button>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex gap-2">
          <div className="flex-shrink-0" style={{ width: "72px", height: "72px" }}>
            <ImageDropzone currentImage={imageUrl} onImageUploaded={setImageUrl} compact />
          </div>
          <div className="flex-1 space-y-1.5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              className="w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-primary/20"
              style={{ border: "1px solid #E8E4DE", padding: "6px 10px", fontSize: "12px" }}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción..."
              rows={2}
              className="w-full rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-primary/20"
              style={{ border: "1px solid #E8E4DE", padding: "6px 10px", fontSize: "12px" }}
            />
          </div>
        </div>

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label style={{ fontSize: "10px", color: "#666", display: "block", marginBottom: "2px" }}>Precio ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              className="w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-primary/20"
              style={{ border: "1px solid #E8E4DE", padding: "6px 10px", fontSize: "12px" }}
            />
          </div>
          <div className="flex-1">
            <label style={{ fontSize: "10px", color: "#666", display: "block", marginBottom: "2px" }}>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              className="w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-primary/20"
              style={{ border: "1px solid #E8E4DE", padding: "6px 10px", fontSize: "12px" }}
            />
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => handleQuickSave("borrador")}
              disabled={saving}
              className="rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-50"
              style={{ padding: "6px 10px", fontSize: "11px", background: "#E8E4DE", color: "#666" }}
            >
              Guardar
            </button>
            <button
              onClick={() => handleQuickSave("activo")}
              disabled={saving || !imageUrl}
              className="rounded-lg font-bold text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ padding: "6px 10px", fontSize: "11px", background: "#1A7A4A" }}
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
