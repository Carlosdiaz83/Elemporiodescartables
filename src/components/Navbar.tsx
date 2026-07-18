"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  if (!session) return null;

  const isAdmin = session.user?.role === "admin";

  return (
    <nav
      className="relative z-50 shadow-md"
      style={{ background: "linear-gradient(135deg, #1558A0 0%, #0D3F7A 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center" style={{ height: "56px" }}>
          <div className="flex items-center gap-5">
            <Link href="/home" className="text-xs font-bold text-white/90 hover:text-white transition-colors">
              Catálogo
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-xs font-bold text-white/90 hover:text-white transition-colors">
                Admin
              </Link>
            )}
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <Link href="/home" className="whitespace-nowrap">
              <span className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-md">
                El Emporio
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-lg">
              <span className="text-xs font-bold text-white">{session.user?.name}</span>
              {isAdmin && (
                <span className="px-1.5 py-px text-[9px] bg-gold text-blue-dark rounded-full font-extrabold uppercase">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs bg-white/15 text-white hover:bg-white/25 border border-white/20 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
