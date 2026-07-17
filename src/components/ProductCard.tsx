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
}

export default function ProductCard({ product }: ProductCardProps) {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1.5">
      <div className="relative h-48 bg-gray-100 overflow-hidden group">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50">
            <svg
              className="w-14 h-14 text-blue-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
              Sin stock
            </span>
          </div>
        )}
        {!outOfStock && product.stock <= 5 && (
          <div className="absolute top-2 right-2">
            <span className="bg-amber-500/90 text-white px-2 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-sm">
              Últimas {product.stock} unidades
            </span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-blue-600">
              ${product.price.toLocaleString("es-AR")}
            </span>
          </div>

          {outOfStock ? (
            <button
              disabled
              className="w-full py-2 px-3 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed text-xs font-medium"
            >
              No disponible
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={() => addItem(cartProduct)}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.97] transition-all duration-200 text-xs font-medium"
            >
              Agregar al carrito
            </button>
          ) : (
            <div className="flex items-center justify-between bg-blue-50 rounded-lg border border-blue-200">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="px-3 py-1.5 text-blue-600 hover:bg-blue-100 rounded-l-lg transition-colors text-base font-bold"
              >
                −
              </button>
              <span className="text-xs font-semibold text-blue-800 min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => {
                  if (!atMaxStock) updateQuantity(product.id, quantity + 1);
                }}
                disabled={atMaxStock}
                className={`px-3 py-1.5 rounded-r-lg transition-colors text-base font-bold ${
                  atMaxStock
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-100"
                }`}
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
