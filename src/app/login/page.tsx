"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [loading, setLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  function handleDevLogin(email: string) {
    setLoading(email);
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/dev-login";
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "email";
    input.value = email;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <div className="relative min-h-screen">
      <div className="bg-image-fixed" />
      <div className="bg-overlay-dark" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              El Emporio Descartables
            </h1>
            <p className="mt-2 text-white/80">
              Marketplace de artículos descartables en Córdoba Capital
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
              Iniciar sesión
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                Error al autenticarse. Intentá de nuevo.
              </div>
            )}

            <button
              onClick={() => signIn("google", { callbackUrl: "/home" })}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {loading === "google" ? "Conectando..." : "Continuar con Google"}
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 uppercase">o acceso rápido (dev)</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleDevLogin("admin@test.com")}
                disabled={loading !== null}
                className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
              >
                {loading === "admin@test.com" ? "Entrando..." : "Entrar como Admin"}
              </button>
              <button
                onClick={() => handleDevLogin("cliente@test.com")}
                disabled={loading !== null}
                className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
              >
                {loading === "cliente@test.com" ? "Entrando..." : "Entrar como Cliente"}
              </button>
            </div>

            <p className="mt-6 text-xs text-center text-gray-400">
              Botones de acceso rápido solo visibles en desarrollo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Cargando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
