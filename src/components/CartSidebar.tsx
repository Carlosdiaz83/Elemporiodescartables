"use client";

import { useCart } from "@/contexts/CartContext";

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount, isOpen, setIsOpen } = useCart();

  return (
    <>
      {/* Floating cart button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 text-white rounded-full shadow-lg transition-all hover:scale-105"
        style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #1558A0, #0D3F7A)", boxShadow: "0 4px 16px rgba(21,88,160,0.35)" }}
      >
        <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold" style={{ width: "18px", height: "18px" }}>
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-40" onClick={() => setIsOpen(false)} />}

      {/* Sidebar panel */}
      <div
        className="fixed top-0 right-0 h-full bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out"
        style={{ width: "100%", maxWidth: "400px", transform: isOpen ? "translateX(0)" : "translateX(100%)", boxShadow: "-4px 0 30px rgba(0,0,0,0.1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between" style={{ padding: "16px 18px", borderBottom: "1px solid #f0ede8", background: "linear-gradient(135deg, #f8f6f3, #f0ede8)" }}>
          <div>
            <h2 className="font-black" style={{ fontSize: "18px", color: "var(--color-blue-dark)" }}>Tu pedido</h2>
            <p style={{ fontSize: "12px", color: "#666" }}>{itemCount} {itemCount === 1 ? "producto" : "productos"}</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="flex items-center justify-center transition-all hover:bg-red-500 hover:text-white hover:border-red-500" style={{ width: "34px", height: "34px", borderRadius: "50%", border: "2px solid #ddd9d2", background: "white", fontSize: "14px", cursor: "pointer", color: "#666" }}>
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto" style={{ padding: "8px 16px" }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full" style={{ color: "#999" }}>
              <svg className="mb-3" style={{ width: "40px", height: "40px", opacity: 0.4 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <p style={{ fontSize: "14px" }}>Tu carrito está vacío</p>
              <button onClick={() => setIsOpen(false)} className="mt-2 font-medium" style={{ fontSize: "13px", color: "var(--color-blue-primary)" }}>
                Seguir comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3" style={{ padding: "10px 0", borderBottom: "1px solid #f0ede8" }}>
                <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: "48px", height: "48px", background: "#f8f6f3" }}>
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full" style={{ objectFit: "contain" }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg style={{ width: "20px", height: "20px", opacity: 0.3 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate font-bold" style={{ fontSize: "13px", lineHeight: "1.3" }}>{item.product.name}</p>
                  <p style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>${item.product.price.toLocaleString("es-AR")}</p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #ddd9d2", background: "white", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <span className="font-bold text-center" style={{ fontSize: "13px", minWidth: "24px" }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1px solid #ddd9d2", background: "white", fontSize: "14px", cursor: item.quantity >= item.product.stock ? "not-allowed" : "pointer", opacity: item.quantity >= item.product.stock ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>

                <span className="font-black flex-shrink-0" style={{ fontSize: "14px", color: "var(--color-blue-dark)" }}>
                  ${(item.product.price * item.quantity).toLocaleString("es-AR")}
                </span>

                <button onClick={() => removeItem(item.product.id)} style={{ color: "#C0392B", fontSize: "16px", cursor: "pointer", padding: "2px" }}>✕</button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "14px 18px 18px", borderTop: "1px solid #f0ede8", background: "#fafaf9" }}>
            <div className="flex justify-between items-center" style={{ marginBottom: "14px" }}>
              <span className="font-extrabold" style={{ fontSize: "16px" }}>Total</span>
              <span className="font-black" style={{ fontSize: "24px", color: "var(--color-blue-dark)" }}>${total.toLocaleString("es-AR")}</span>
            </div>
            <button
              className="w-full font-black transition-all"
              style={{
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #1558A0, #0D3F7A)",
                color: "white",
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(21,88,160,0.3)",
              }}
            >
              Enviar pedido →
            </button>
            <button onClick={clearCart} className="w-full mt-2 font-bold transition-all" style={{ padding: "10px", borderRadius: "12px", border: "2px solid #ddd9d2", background: "none", fontSize: "13px", cursor: "pointer", color: "#C0392B" }}>
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
