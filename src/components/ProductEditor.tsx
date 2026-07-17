"use client";

import { useState } from "react";
import ImageDropzone from "./ImageDropzone";

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

interface ProductEditorProps {
  product: Product;
  onSaved: () => void;
  onCancel: () => void;
}

export default function ProductEditor({
  product,
  onSaved,
  onCancel,
}: ProductEditorProps) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [features, setFeatures] = useState(product.features ?? "");
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

      if (isNaN(priceNum) || priceNum < 0) {
        throw new Error("Ingresá un precio válido");
      }
      if (isNaN(stockNum) || stockNum < 0) {
        throw new Error("Ingresá un stock válido");
      }

      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || null,
          features: features || null,
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

  const stockNum = parseInt(stock, 10) || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
            Borrador
          </span>
        </div>
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancelar
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda: Imagen */}
          <div>
            <ImageDropzone
              currentImage={imageUrl}
              onImageUploaded={setImageUrl}
            />
          </div>

          {/* Columna derecha: Datos */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Descripción del producto..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Características
              </label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                rows={2}
                placeholder="Ej: Material: plástico, Tamaño: 30cm..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio ($)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    stockNum === 0
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-gray-200"
                  }`}
                />
                {stockNum === 0 && (
                  <p className="text-xs text-red-600 mt-1 font-medium">
                    Sin stock - No estará disponible para compra
                  </p>
                )}
                {stockNum > 0 && stockNum <= 5 && (
                  <p className="text-xs text-yellow-600 mt-1">
                    Stock bajo - Mostrará alerta al cliente
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => handleSave("borrador")}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Guardar borrador
          </button>
          <button
            onClick={() => handleSave("activo")}
            disabled={isSaving || !imageUrl}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Guardando..." : "Publicar producto"}
          </button>
        </div>

        {!imageUrl && (
          <p className="text-xs text-gray-400 text-right mt-2">
            Subí una foto para poder publicar el producto
          </p>
        )}
      </div>
    </div>
  );
}
