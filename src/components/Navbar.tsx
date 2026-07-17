"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  if (!session) return null;

  const isAdmin = session.user?.role === "admin";

  return (
    <nav className="relative z-50 bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between h-20 items-center">
          {/* Left section: Navigation links */}
          <div className="flex items-center gap-4">
            <Link
              href="/home"
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Catálogo
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Centered Business Name */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto">
            <Link
              href="/home"
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-600 hover:text-blue-700 tracking-tight transition-all whitespace-nowrap"
            >
              Descartables El Emporio
            </Link>
          </div>

          {/* Right section: Client info & logout */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200/80 px-3.5 py-1.5 rounded-xl shadow-xs">
              <span className="text-sm font-semibold text-gray-700">
                {session.user?.name}
              </span>
              {isAdmin && (
                <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-xl font-medium transition-all shadow-xs hover:shadow-sm cursor-pointer whitespace-nowrap"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
