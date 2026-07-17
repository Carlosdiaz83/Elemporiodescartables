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
  price: number;
  imageUrl: string | null;
  stock: number;
  status: string;
}

type Tab = "dashboard" | "importar" | "pendientes" | "productos" | "ofertas";

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
        <div className="text-gray-500">Cargando panel de administración...</div>
      </div>
    );
  }

  const activeProducts = products.filter((p) => p.status === "activo");
  const draftProducts = products.filter((p) => p.status === "borrador");
  const outOfStock = products.filter((p) => p.stock === 0 && p.status === "activo");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-500 mt-1">Gestión de productos y catálogo</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {([
          ["dashboard", "Dashboard", null],
          ["importar", "Importar Excel", null],
          ["pendientes", "Productos Pendientes", draftProducts.length > 0 ? draftProducts.length : null],
          ["productos", "Todos los Productos", null],
          ["ofertas", "Ofertas Destacadas", null],
        ] as const).map(([key, label, badge]) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setEditingProductId(null); }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors relative ${
              activeTab === key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
            {badge !== null && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs bg-yellow-500 text-white rounded-full">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500">Total Productos</div>
              <div className="text-3xl font-bold text-gray-900 mt-1">{products.length}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500">Activos</div>
              <div className="text-3xl font-bold text-green-600 mt-1">{activeProducts.length}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500">Pendientes</div>
              <div className={`text-3xl font-bold mt-1 ${draftProducts.length > 0 ? "text-yellow-600" : "text-gray-900"}`}>
                {draftProducts.length}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500">Sin Stock</div>
              <div className={`text-3xl font-bold mt-1 ${outOfStock.length > 0 ? "text-red-600" : "text-gray-900"}`}>
                {outOfStock.length}
              </div>
              {outOfStock.length > 0 && (
                <p className="text-xs text-red-500 mt-1 font-medium">Requiere atención</p>
              )}
            </div>
          </div>

          {draftProducts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-medium text-yellow-800">
                  Tenés {draftProducts.length} producto{draftProducts.length !== 1 && "s"} pendiente{draftProducts.length !== 1 && "s"}
                </span>
              </div>
              <p className="text-sm text-yellow-700">
                Completá los datos y publicalos para que aparezcan en el catálogo.
              </p>
              <button
                onClick={() => setActiveTab("pendientes")}
                className="mt-2 text-sm font-medium text-yellow-800 underline hover:text-yellow-900"
              >
                Ir a completar productos →
              </button>
            </div>
          )}

          {outOfStock.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-red-800">
                  {outOfStock.length} producto{outOfStock.length !== 1 && "s"} sin stock
                </span>
              </div>
              <p className="text-sm text-red-700">
                Estos productos no están disponibles para compra hasta que se rep stock.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Importar Excel */}
      {activeTab === "importar" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Importar productos desde Excel
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Subí un archivo con una columna de nombres de productos. Se crearán como borradores y podrás completarlos en la pestaña "Productos Pendientes".
            </p>
            <ExcelUploader
              onImportComplete={() => {
                fetchProducts();
                setActiveTab("pendientes");
              }}
            />
          </div>
        </div>
      )}

      {/* Productos Pendientes */}
      {activeTab === "pendientes" && (
        <div className="space-y-4">
          {editingProductId ? (
            <ProductEditor
              product={products.find((p) => p.id === editingProductId)!}
              onSaved={() => {
                setEditingProductId(null);
                fetchProducts();
              }}
              onCancel={() => setEditingProductId(null)}
            />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Productos Pendientes ({draftProducts.length})
                </h2>
                <button
                  onClick={() => setActiveTab("importar")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Importar desde Excel
                </button>
              </div>

              {draftProducts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-gray-500 font-medium">No hay productos pendientes</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Todos los productos están completos o no se importaron nuevos
                  </p>
                  <button
                    onClick={() => setActiveTab("importar")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Importar productos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </>
          )}
        </div>
      )}

      {/* Todos los productos */}
      {activeTab === "productos" && (
        <div className="space-y-4">
          {editingProductId ? (
            <ProductEditor
              product={products.find((p) => p.id === editingProductId)!}
              onSaved={() => {
                setEditingProductId(null);
                fetchProducts();
              }}
              onCancel={() => setEditingProductId(null)}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {products.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  No hay productos. Importá uno desde Excel.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              product.status === "activo" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {product.status}
                            </span>
                            {product.stock === 0 && product.status === "activo" && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">
                                Sin stock
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            ${product.price.toLocaleString("es-AR")} · Stock: {product.stock}
                          </p>
                          {product.description && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setEditingProductId(product.id)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Editar
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStockUpdate(product.id, Math.max(0, product.stock - 1))}
                              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:bg-gray-100 text-sm"
                            >
                              −
                            </button>
                            <span className={`text-sm font-medium min-w-[2rem] text-center ${product.stock === 0 ? "text-red-600 font-bold" : ""}`}>
                              {product.stock}
                            </span>
                            <button
                              onClick={() => handleStockUpdate(product.id, product.stock + 1)}
                              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:bg-gray-100 text-sm"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ofertas Destacadas */}
      {activeTab === "ofertas" && <OfferManager />}
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
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm font-medium text-green-800">{name} guardado</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-medium text-gray-900 text-sm truncate flex-1 mr-2">{name}</h3>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={onEdit} className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1">
            Editor completo
          </button>
          <button onClick={() => onDelete(product.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-1">
            Eliminar
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex gap-3">
          <div className="w-20 h-20 flex-shrink-0">
            <ImageDropzone currentImage={imageUrl} onImageUploaded={setImageUrl} compact />
          </div>
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción..."
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-0.5 block">Precio ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-0.5 block">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              onClick={() => handleQuickSave("borrador")}
              disabled={saving}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Guardar
            </button>
            <button
              onClick={() => handleQuickSave("activo")}
              disabled={saving || !imageUrl}
              className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
