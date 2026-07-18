"use client";

import Image from "next/image";
import { useCart, type CartProduct } from "@/contexts/CartContext";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    features: string | null;
    price: number;
    imageUrl: string | null;
    stock: number;
  };
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;
  const outOfStock = product.stock === 0;
  const atMaxStock = quantity >= product.stock;

  const cartProduct: CartProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    stock: product.stock,
  };

  return (
    <div
      className={`fade-up flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${quantity > 0 ? "border-2" : "border-2 border-transparent"}`}
      style={{
        animationDelay: `${Math.min(index * 0.04, 0.5)}s`,
        background: "#fff",
        boxShadow: quantity > 0 ? "0 4px 20px rgba(21,88,160,0.15)" : "0 2px 8px rgba(0,0,0,0.05)",
        borderColor: quantity > 0 ? "var(--color-blue-primary)" : "transparent",
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "1", background: "linear-gradient(135deg, #f8f6f3, #f0ede8)" }}
      >
        <div className="absolute" style={{ top: "20px", right: "20px", bottom: "20px", left: "20px" }}>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="#999">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>

        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-red-500 text-white px-2.5 py-0.5 rounded-full font-bold uppercase" style={{ fontSize: "10px" }}>
              Sin stock
            </span>
          </div>
        )}

        {!outOfStock && quantity > 0 && (
          <div
            className="absolute top-2.5 right-2.5 z-10 flex items-center justify-center text-white font-black"
            style={{ width: "26px", height: "26px", borderRadius: "50%", fontSize: "12px", background: "var(--color-blue-primary)", boxShadow: "0 2px 8px rgba(21,88,160,0.35)" }}
          >
            {quantity}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1" style={{ padding: "10px 12px 12px", gap: "2px" }}>
        <h3 className="leading-tight line-clamp-2" style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-blue-dark)", minHeight: "2rem" }}>
          {product.name}
        </h3>

        <div className="mt-auto" style={{ paddingTop: "6px" }}>
          {outOfStock ? (
            <button disabled className="w-full rounded-lg text-xs font-bold bg-gray-100 text-gray-400 cursor-not-allowed" style={{ padding: "7px 10px" }}>
              Sin stock
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={() => addItem(cartProduct)}
              className="w-full transition-all duration-200 active:scale-95 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #1558A0, #0D3F7A)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "8px 14px",
                fontSize: "12px",
                fontWeight: 800,
                boxShadow: "0 3px 10px rgba(21,88,160,0.25)",
              }}
            >
              Agregar
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", background: "#D5D1CA", color: "#1A1A1A", fontSize: "16px", fontWeight: 900, flexShrink: 0 }}
              >
                −
              </button>
              <span className="text-center font-black" style={{ fontSize: "14px", color: "var(--color-blue-primary)", minWidth: "28px" }}>
                {quantity}
              </span>
              <button
                onClick={() => { if (!atMaxStock) updateQuantity(product.id, quantity + 1); }}
                disabled={atMaxStock}
                className="flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", background: atMaxStock ? "#ccc" : "var(--color-blue-primary)", color: "white", fontSize: "16px", fontWeight: 900, opacity: atMaxStock ? 0.5 : 1, flexShrink: 0 }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
