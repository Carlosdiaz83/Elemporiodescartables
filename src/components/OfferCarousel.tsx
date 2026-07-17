"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useCart } from "@/contexts/CartContext";

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

export default function OfferCarousel({ offers }: { offers: Offer[] }) {
  const { addItem } = useCart();

  if (offers.length === 0) return null;

  return (
    <div className="mb-8">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 1 },
          1024: { slidesPerView: 2 },
          1440: { slidesPerView: 3 },
        }}
        className="rounded-2xl overflow-hidden offer-swiper"
      >
        {offers.map((offer) => (
          <SwiperSlide key={offer.id}>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 overflow-hidden relative flex flex-col h-[600px]">
              <span className="absolute top-3 left-3 z-10 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow">
                {offer.label}
              </span>

              <div className="relative h-[360px] bg-gray-100 flex items-center justify-center overflow-hidden group">
                {offer.product.imageUrl ? (
                  <Image
                    src={offer.product.imageUrl}
                    alt={offer.product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, (max-width: 1440px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50">
                    <svg
                      className="w-16 h-16 text-blue-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 p-5">
                <h3 className="font-semibold text-gray-900 text-xl leading-tight mb-1.5 line-clamp-2">
                  {offer.product.name}
                </h3>

                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-gray-400 line-through text-base">
                    ${offer.product.price.toLocaleString("es-AR")}
                  </span>
                  <span className="text-red-500 font-bold text-2xl">
                    ${offer.salePrice.toLocaleString("es-AR")}
                  </span>
                </div>

                <button
                  onClick={() =>
                    addItem({
                      id: offer.product.id,
                      name: offer.product.name,
                      price: offer.salePrice,
                      imageUrl: offer.product.imageUrl,
                      stock: offer.product.stock,
                    })
                  }
                  disabled={offer.product.stock <= 0}
                  className="mt-auto w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 active:scale-[0.97] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  {offer.product.stock <= 0 ? "Sin stock" : "Agregar al carrito"}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
