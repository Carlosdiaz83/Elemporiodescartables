"use client";

import { useEffect, useState } from "react";
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
  category: string | null;
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

const CATEGORIES = [
  { id: "todos", label: "Todos", icon: "📦" },
  { id: "bolsas", label: "Bolsas", icon: "🛍️" },
  { id: "vasos", label: "Vasos", icon: "🥤" },
  { id: "platos", label: "Platos", icon: "🍽️" },
  { id: "cubiertos", label: "Cubiertos", icon: "🍴" },
  { id: "servilletas", label: "Servilletas", icon: "🧻" },
  { id: "papelera", label: "Papelera", icon: "🗞️" },
  { id: "higiene", label: "Higiene", icon: "🧴" },
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="skeleton-shimmer" style={{ aspectRatio: "1", padding: "20px" }} />
      <div className="px-3 pb-3 space-y-2">
        <div className="h-3 skeleton-shimmer rounded w-3/4" />
        <div className="flex items-end justify-between pt-2">
          <div className="h-4 skeleton-shimmer rounded w-1/3" />
          <div className="h-7 skeleton-shimmer rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="products-grid p-4 sm:px-8 max-w-7xl mx-auto">
      {Array.from({ length: 12 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
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
  const [activeCategory, setActiveCategory] = useState("todos");
  const debouncedSearch = useDebounce(search, 200);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const [prodRes, offerRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/offers"),
        ]);
        setProducts(await prodRes.json());
        setOffers(await offerRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") fetchProducts();
  }, [status]);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.description?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory =
      activeCategory === "todos" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <OfferCarousel offers={offers} />

      {status === "loading" || loading ? (
        <SkeletonGrid />
      ) : (
        <>
          {/* Search */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: "10px", paddingBottom: "8px" }}>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-primary opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white text-blue-dark font-semibold focus:outline-none focus:ring-2 focus:ring-blue-primary/20 transition-all shadow-sm border-2 border-[#DDD9D2] focus:border-blue-primary"
                style={{ padding: "10px 16px 10px 36px", borderRadius: "50px", fontSize: "14px" }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-blue-dark rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-hide" style={{ padding: "6px 16px 10px" }}>
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1 flex-shrink-0 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer border-2 ${
                    activeCategory === cat.id
                      ? "bg-blue-primary text-white border-blue-primary"
                      : "bg-white text-blue-dark border-[#E8E4DE] hover:border-blue-primary/40"
                  }`}
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products grid */}
          <div className="px-4 sm:px-8 py-1 max-w-7xl mx-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-blue-dark/50 font-bold" style={{ fontSize: "16px" }}>
                  {products.length === 0 ? "No hay productos disponibles" : "No se encontraron productos"}
                </p>
                <p className="text-blue-dark/40 mt-1" style={{ fontSize: "13px" }}>
                  {products.length === 0 ? "Próximamente tendremos productos para vos" : "Probá con otros términos de búsqueda"}
                </p>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
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
