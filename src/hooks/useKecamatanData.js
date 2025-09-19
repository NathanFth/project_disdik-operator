// src/hooks/useKecamatanData.js
import { useState, useEffect } from "react";

export function useKecamatanData() {
  const [kecamatanList, setKecamatanList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchKecamatan() {
      try {
        const response = await fetch("/data/kecamatan.geojson");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // --- PERUBAHAN DI SINI ---
        // Mengambil nama kecamatan dari properti "district"
        const list = [
          ...new Set(data.features.map((f) => f.properties.district)),
        ].sort();
        // -------------------------

        setKecamatanList(list);
      } catch (e) {
        console.error("Gagal memuat data kecamatan:", e);
        setError("Tidak dapat memuat daftar kecamatan.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchKecamatan();
  }, []);

  return { kecamatanList, isLoading, error };
}
