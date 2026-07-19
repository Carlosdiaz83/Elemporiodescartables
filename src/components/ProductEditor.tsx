"use client";

import { useState } from "react";
import ImageDropzone from "./ImageDropzone";

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

const CATEGORIES = [
  { value: "", label: "Sin categoría" },
  { value: "bolsas", label: "Bolsas" },
  { value: "vasos", label: "Vasos" },
  { value: "platos", label: "Platos" },
  { value: "cubiertos", label: "Cubiertos" },
  { value: "servilletas", label: "Servilletas" },
  { value: "papelera", label: "Papelera" },
  { value: "higiene", label: "Higiene" },
];

export default function ProductEditor({ product, onSaved, onCancel }: { product: Product; onSaved: () => void; onCancel: () => void }) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [features, setFeatures] = useState(product.features ?? "");
  const [category, setCategory] = useState(product.category ?? "");
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [imageUrl, setImageUrl] = useState(product.imageUrl ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(status: "borrador" | "activo") {
    setIsSaving(true);
    setError(null);
    try {
      const priceNum = parseFloat(price);
      const stockNum = parseInt(stock, 10);
      if (isNaN(priceNum) || priceNum < 0) throw new Error("Ingresá un precio válido");
      if (isNaN(stockNum) || stockNum < 0) throw new Error("Ingresá un stock válido");

      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || null,
          features: features || null,
          category: category || null,
          price: priceNum,
          stock: stockNum,
          imageUrl: imageUrl || null,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar");
      }
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  const inputStyle = { border: "1px solid #E8E4DE", padding: "8px 12px", fontSize: "13px", borderRadius: "10px" };
  const focusClass = "focus:outline-none focus:ring-2 focus:ring-blue-primary/20";

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #E8E4DE" }}>
      <div className="flex items-center justify-between" style={{ padding: "12px 16px", background: "#f8f6f3", borderBottom: "1px solid #E8E4DE" }}>
        <div>
          <h3 className="font-bold" style={{ fontSize: "14px", color: "var(--color-blue-dark)" }}>{product.name}</h3>
          <span className="rounded-full font-bold" style={{ fontSize: "10px", padding: "2px 8px", background: "#FFF8E1", color: "#7A6010" }}>Borrador</span>
        </div>
        <button onClick={onCancel} style={{ fontSize: "12px", color: "#666", cursor: "pointer" }}>Cancelar</button>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Image */}
          <div>
            <ImageDropzone currentImage={imageUrl} onImageUploaded={setImageUrl} />
          </div>

          {/* Fields */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold mb-1" style={{ fontSize: "12px", color: "var(--color-blue-dark)" }}>Nombre</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`w-full rounded-xl ${focusClass}`} style={inputStyle} />
            </div>
            <div>
              <label className="block font-bold mb-1" style={{ fontSize: "12px", color: "var(--color-blue-dark)" }}>Descripción</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Descripción del producto..." className={`w-full rounded-xl resize-none ${focusClass}`} style={inputStyle} />
            </div>
            <div>
              <label className="block font-bold mb-1" style={{ fontSize: "12px", color: "var(--color-blue-dark)" }}>Características</label>
              <textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={2} placeholder="Ej: Material: plástico, Tamaño: 30cm..." className={`w-full rounded-xl resize-none ${focusClass}`} style={inputStyle} />
            </div>
            <div>
              <label className="block font-bold mb-1" style={{ fontSize: "12px", color: "var(--color-blue-dark)" }}>Categoría</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full rounded-xl ${focusClass}`} style={inputStyle}>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1" style={{ fontSize: "12px", color: "var(--color-blue-dark)" }}>Precio ($)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" className={`w-full rounded-xl ${focusClass}`} style={inputStyle} />
              </div>
              <div>
                <label className="block font-bold mb-1" style={{ fontSize: "12px", color: "var(--color-blue-dark)" }}>Stock</label>
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} min="0" className={`w-full rounded-xl ${focusClass}`} style={inputStyle} />
                {parseInt(stock) === 0 && <p style={{ fontSize: "10px", color: "#C0392B", marginTop: "2px" }}>Sin stock</p>}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-xl p-3" style={{ background: "#FEE", border: "1px solid #f5c6c2", fontSize: "12px", color: "#C0392B" }}>{error}</div>
        )}

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => handleSave("borrador")}
            disabled={isSaving}
            className="rounded-xl font-bold transition-colors cursor-pointer disabled:opacity-50"
            style={{ padding: "8px 16px", fontSize: "12px", background: "#E8E4DE", color: "#666" }}
          >
            Guardar borrador
          </button>
          <button
            onClick={() => handleSave("activo")}
            disabled={isSaving || !imageUrl}
            className="rounded-xl font-bold text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ padding: "8px 16px", fontSize: "12px", background: "#1A7A4A" }}
          >
            {isSaving ? "Guardando..." : "Publicar producto"}
          </button>
        </div>

        {!imageUrl && <p style={{ fontSize: "10px", color: "#999", textAlign: "right", marginTop: "6px" }}>Subí una foto para publicar</p>}
      </div>
    </div>
  );
}
