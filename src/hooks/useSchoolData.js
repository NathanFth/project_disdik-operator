"use client";

import { useState, useEffect } from "react";

// --- KONFIGURASI FILE DATA ---
const DATA_FILES = {
  SD: "/data/sd_new.json",
  PAUD: "/data/paud.json",
  PKBM: "/data/pkbm.json",
  TK: "/data/paud.json",
  SMP: "/data/smp.json", // Diaktifkan untuk mendukung SMP
};

// --- FUNGSI-FUNGSI TRANSFORMASI DATA ---

const transformSdData = (data, type) => {
  return Object.entries(data).flatMap(([kecamatan, schools]) =>
    schools.map((school) => ({
      ...school,
      kecamatan,
      schoolType: type,
      jenjang: type,
    }))
  );
};

const transformPaudData = (data, type) => {
  return Object.entries(data).flatMap(([kecamatan, schools]) =>
    schools.map((school) => ({
      ...school,
      kecamatan,
      schoolType: type,
      jenjang: school.type, // TK, KB, dll.
    }))
  );
};

const transformPkbmData = (data, type) => {
  return Object.entries(data).flatMap(([kecamatan, schools]) =>
    schools.map((school) => ({
      ...school,
      kecamatan,
      schoolType: type,
      jenjang: type,
    }))
  );
};

// FUNGSI BARU UNTUK MEMPROSES SMP.JSON
const transformSmpData = (data, type) => {
  return Object.entries(data).flatMap(([kecamatan, schools]) =>
    schools.map((school) => ({
      ...school,
      kecamatan,
      schoolType: type,
      jenjang: type,
    }))
  );
};

// --- CUSTOM HOOK UTAMA ---
export function useSchoolData(operatorType) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!operatorType || !DATA_FILES[operatorType]) {
      console.warn(`Tipe operator ${operatorType} tidak valid.`);
      setData([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const dataUrl = DATA_FILES[operatorType];

      try {
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error(`Gagal memuat ${dataUrl}`);
        const rawData = await response.json();

        let transformedSchools = [];
        let finalFilteredSchools = [];

        // Ditambahkan case untuk SMP
        switch (operatorType) {
          case "SD":
            transformedSchools = transformSdData(rawData, operatorType);
            break;
          case "SMP":
            transformedSchools = transformSmpData(rawData, operatorType);
            break;
          case "PAUD":
          case "TK":
            transformedSchools = transformPaudData(rawData, operatorType);
            break;
          case "PKBM":
            transformedSchools = transformPkbmData(rawData, operatorType);
            break;
          default:
            transformedSchools = [];
        }

        if (operatorType === "TK") {
          finalFilteredSchools = transformedSchools.filter(
            (school) => school.jenjang === "TK"
          );
        } else if (operatorType === "PAUD") {
          finalFilteredSchools = transformedSchools.filter(
            (school) => school.jenjang !== "TK"
          );
        } else {
          finalFilteredSchools = transformedSchools;
        }

        setData(finalFilteredSchools);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [operatorType]);

  return { data, isLoading, error };
}
