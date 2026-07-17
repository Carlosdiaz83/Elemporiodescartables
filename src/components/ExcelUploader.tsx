"use client";

import { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";

interface ExcelUploaderProps {
  onImportComplete: () => void;
}

export default function ExcelUploader({ onImportComplete }: ExcelUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    created: number;
    errors: number;
    errorDetails: { index: number; name?: string; error: string }[];
  } | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function parseFile(file: File): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          const names: string[] = [];
          for (const row of jsonData) {
            if (Array.isArray(row) && row.length > 0) {
              const cellValue = row[0];
              if (typeof cellValue === "string" && cellValue.trim()) {
                names.push(cellValue.trim());
              } else if (typeof cellValue === "number") {
                names.push(String(cellValue).trim());
              }
            }
          }
          resolve(names);
        } catch (err) {
          reject(new Error("Error al leer el archivo Excel"));
        }
      };

      reader.onerror = () => reject(new Error("Error al leer el archivo"));
      reader.readAsArrayBuffer(file);
    });
  }

  async function handleFile(file: File) {
    setIsProcessing(true);
    setResult(null);
    setPreview([]);

    try {
      const names = await parseFile(file);

      if (names.length === 0) {
        setResult({
          created: 0,
          errors: 1,
          errorDetails: [{ index: 0, error: "No se encontraron nombres de productos en el archivo" }],
        });
        setIsProcessing(false);
        return;
      }

      setPreview(names);

      const res = await fetch("/api/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: names }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al importar");
      }

      setResult(data);
      onImportComplete();
    } catch (err: any) {
      setResult({
        created: 0,
        errors: 1,
        errorDetails: [{ index: 0, error: err.message }],
      });
    } finally {
      setIsProcessing(false);
    }
  }

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-4">
      {/* Zona de arrastre */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={onFileSelect}
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-600">Procesando archivo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600 font-medium">
              Arrastrá un archivo Excel o hacé click para seleccionar
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Formatos soportados: .xlsx, .xls, .csv
            </p>
            <p className="text-xs text-gray-400 mt-1">
              El archivo debe tener una columna con los nombres de los productos
            </p>
          </div>
        )}
      </div>

      {/* Preview de productos detectados */}
      {preview.length > 0 && !result && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Productos detectados ({preview.length}):
          </h4>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {preview.map((name, i) => (
              <div
                key={i}
                className="text-sm text-gray-600 flex items-center gap-2"
              >
                <span className="text-gray-400 w-6 text-right">{i + 1}.</span>
                {name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultado de la importación */}
      {result && (
        <div
          className={`rounded-xl p-4 ${
            result.created > 0 && result.errors === 0
              ? "bg-green-50 border border-green-200"
              : result.created > 0
              ? "bg-yellow-50 border border-yellow-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {result.created > 0 && (
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-medium">
                {result.created} producto{result.created !== 1 && "s"} creado
                {result.created !== 1 && "s"} como borrador
              </span>
            </div>
          )}

          {result.errors > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-red-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="font-medium">
                  {result.errors} error{result.errors !== 1 && "es"}
                </span>
              </div>
              {result.errorDetails.map((err, i) => (
                <p key={i} className="text-sm text-red-600 ml-7">
                  {err.name ? `"${err.name}": ` : ""}{err.error}
                </p>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setResult(null);
              setPreview([]);
            }}
            className="mt-3 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Importar otro archivo
          </button>
        </div>
      )}
    </div>
  );
}
