"use client";

import { useState } from "react";

const ZONAS_CORDOBA = [
  { id: "norte", name: "Zona Norte", price: 1500 },
  { id: "sur", name: "Zona Sur", price: 1500 },
  { id: "este", name: "Zona Este", price: 1800 },
  { id: "oeste", name: "Zona Oeste", price: 1800 },
  { id: "centro", name: "Centro", price: 1200 },
];

const BARRIOS = [
  "Alta Córdoba",
  "Alta Gracia",
  "Bajo Grande",
  "Bella Vista",
  "Centro",
  "Cerro de las Rosas",
  "Chacra de la Merced",
  "Ciudadela",
  "Corito",
  "Costa azul",
  "Floresta",
  "General Paz",
  "Güemes",
  "Hernando",
  "Juárez Celman",
  "La Albearada",
  "La Argentina",
  "La Carlota",
  "La Criolla",
  "Las Flores",
  "Las Palmas",
  "Los Boulevares",
  "Los Cerrillos",
  "Manantiales",
  "Monte Cristo",
  "Nueva Córdoba",
  "Parque Circunvalación",
  "Parque Liceo",
  "Portón de Hierro",
  "Progreso",
  "Residencial del Oeste",
  "San Agustín",
  "San Carlos",
  "San Fernando",
  "San Guillermo",
  "San Martín",
  "San Vicente",
  "Sarmiento",
  "Satélite Norte",
  "Trouville",
  "Urca",
  "Villa Allende",
  "Villa Belgrano",
  "Villa El Libanes",
  "Villa Esquiú",
  "Villa General Belgrano",
  "Villa Gesell",
  "Villa Gran Bretaña",
  "Villa Italia",
  "Villa Marquesa",
  "Villa Modelo",
  "Villa María",
  "Villa Nueva",
  "Villa Olímpica",
  "Villa Paula",
  "Villa Revol",
  "Villa Warcalde",
];

interface ShippingZoneProps {
  onZoneChange: (zone: { type: "envio" | "retiro"; zone?: string; barrio?: string; shippingCost: number }) => void;
}

export default function ShippingZoneSelector({ onZoneChange }: ShippingZoneProps) {
  const [deliveryType, setDeliveryType] = useState<"envio" | "retiro">("envio");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedBarrio, setSelectedBarrio] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  function handleZoneChange(type: "envio" | "retiro") {
    setDeliveryType(type);
    if (type === "retiro") {
      onZoneChange({ type: "retiro", shippingCost: 0 });
      setSelectedZone("");
      setSelectedBarrio("");
    } else {
      onZoneChange({ type: "envio", shippingCost: 0 });
    }
  }

  function handleZoneSelect(zoneId: string) {
    const zone = ZONAS_CORDOBA.find((z) => z.id === zoneId);
    setSelectedZone(zoneId);
    if (zone) {
      onZoneChange({
        type: "envio",
        zone: zone.name,
        barrio: selectedBarrio || undefined,
        shippingCost: zone.price,
      });
    }
  }

  function handleBarrioSelect(barrio: string) {
    setSelectedBarrio(barrio);
    const zone = ZONAS_CORDOBA.find((z) => z.id === selectedZone);
    onZoneChange({
      type: "envio",
      zone: zone?.name,
      barrio,
      shippingCost: zone?.price ?? 0,
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="font-semibold text-gray-900">Zona de entrega</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Tipo de entrega */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleZoneChange("envio")}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                deliveryType === "envio"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.4L21 11M3 11h18M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1m-6 0a1 1 0 001 1h1a1 1 0 001-1m-6 0H7"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900">
                  Envío a domicilio
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Solo Córdoba Capital</p>
            </button>

            <button
              onClick={() => handleZoneChange("retiro")}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                deliveryType === "retiro"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900">
                  Retiro en punto
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Sin costo adicional</p>
            </button>
          </div>

          {/* Selector de zona (solo envío) */}
          {deliveryType === "envio" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zona de Córdoba Capital
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => handleZoneChange("envio")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar zona...</option>
                  {ZONAS_CORDOBA.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} - ${zone.price.toLocaleString("es-AR")} de
                      envío
                    </option>
                  ))}
                </select>
              </div>

              {selectedZone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barrio
                  </label>
                  <select
                    value={selectedBarrio}
                    onChange={(e) => handleBarrioSelect(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar barrio...</option>
                    {BARRIOS.map((barrio) => (
                      <option key={barrio} value={barrio}>
                        {barrio}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {deliveryType === "retiro" && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Punto de retiro:</span> Av. General
                Paz 1234, Córdoba Capital
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Lun a Vie: 9:00 - 18:00hs | Sáb: 9:00 - 13:00hs
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
