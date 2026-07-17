"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import { CartProvider } from "@/contexts/CartContext";
import OfferCarousel from "@/components/OfferCarousel";

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

interface OfferProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
}

interface Offer {
  id: string;
  salePrice: number;
  label: string;
  sortOrder: number;
  product: OfferProduct;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="h-48 skeleton-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton-shimmer rounded w-3/4" />
        <div className="h-3 skeleton-shimmer rounded w-full" />
        <div className="h-3 skeleton-shimmer rounded w-1/2" />
        <div className="pt-2">
          <div className="h-5 skeleton-shimmer rounded w-1/3 mb-2" />
          <div className="h-8 skeleton-shimmer rounded w-full" />
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="px-2 sm:px-4 lg:px-0 py-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function HomeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const [prodRes, offerRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/offers"),
        ]);
        const prodData = await prodRes.json();
        const offerData = await offerRes.json();
        setProducts(prodData);
        setOffers(offerData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") {
      fetchProducts();
    }
  }, [status]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="relative min-h-screen">
      <div className="bg-image-fixed" />
      <div className="bg-overlay-light" />

      <div className="relative z-10">
        <OfferCarousel offers={offers} />

        {status === "loading" || loading ? (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-8">
                <div className="h-7 skeleton-shimmer rounded w-64 mb-2" />
                <div className="h-4 skeleton-shimmer rounded w-80" />
              </div>
            </div>
            <div className="sticky top-20 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="h-16 skeleton-shimmer rounded-2xl max-w-2xl" />
              </div>
            </div>
            <SkeletonGrid />
          </>
        ) : (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Catálogo de Productos
                </h1>
                <p className="text-gray-500 mt-1">
                  Artículos descartables en Córdoba Capital
                </p>
              </div>
            </div>

            <div className="sticky top-20 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="relative flex items-center max-w-2xl gap-3">
                  <div className="relative flex-1">
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Buscar descartables, bolsas, vasos..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-13 pr-12 py-5 bg-slate-900/90 border-2 border-slate-700 hover:border-slate-500 focus:border-blue-500 text-white rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 placeholder:text-slate-500 font-semibold shadow-inner"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <button
                    className="flex items-center gap-2.5 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl shadow-blue-500/30 active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Buscar
                  </button>
                </div>
              </div>
            </div>

            <div className="px-2 sm:px-4 lg:px-0 py-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-lg">
                  {products.length === 0
                    ? "No hay productos disponibles"
                    : "No se encontraron productos"}
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {products.length === 0
                    ? "Próximamente tendremos productos para vos"
                    : "Probá con otros términos de búsqueda"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <CartProvider>
      <HomeContent />
      <CartSidebar />
    </CartProvider>
  );
}
