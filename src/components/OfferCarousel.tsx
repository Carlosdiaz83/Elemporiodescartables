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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: "12px", paddingBottom: "8px" }}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        breakpoints={{
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="offer-swiper"
      >
        {offers.map((offer) => (
          <SwiperSlide key={offer.id}>
            <div
              className="bg-white rounded-xl overflow-hidden flex items-center gap-3 transition-all duration-200 hover:shadow-md cursor-pointer"
              style={{ padding: "10px 12px", border: "1px solid #E8E4DE" }}
              onClick={() => {
                if (offer.product.stock > 0) {
                  addItem({
                    id: offer.product.id,
                    name: offer.product.name,
                    price: offer.salePrice,
                    imageUrl: offer.product.imageUrl,
                    stock: offer.product.stock,
                  });
                }
              }}
            >
              <div className="relative flex-shrink-0" style={{ width: "48px", height: "48px", borderRadius: "8px", background: "#f8f6f3" }}>
                {offer.product.imageUrl ? (
                  <Image src={offer.product.imageUrl} alt={offer.product.name} fill sizes="48px" className="object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg style={{ width: "20px", height: "20px", opacity: 0.2 }} fill="none" viewBox="0 0 24 24" stroke="#999">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold line-clamp-1" style={{ fontSize: "12px", color: "var(--color-blue-dark)", lineHeight: "1.3" }}>
                  {offer.product.name}
                </p>
                <div className="flex items-center gap-1.5" style={{ marginTop: "2px" }}>
                  <span style={{ fontSize: "10px", color: "#999", textDecoration: "line-through" }}>
                    ${offer.product.price.toLocaleString("es-AR")}
                  </span>
                  <span className="font-black" style={{ fontSize: "14px", color: "#C0392B" }}>
                    ${offer.salePrice.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>

              <span className="flex-shrink-0 font-extrabold uppercase text-white" style={{ fontSize: "8px", padding: "3px 6px", borderRadius: "6px", background: "linear-gradient(135deg, #D4380D, #CF1322)", letterSpacing: "0.5px" }}>
                {offer.label}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
