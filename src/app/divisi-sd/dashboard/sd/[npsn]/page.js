// src/app/dashboard/sd/[npsn]/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "../../../../components/Sidebar";
import { Button } from "../../../../components/ui/button";
import SchoolDetailsTabs from "../../../../components/SchoolDetailsTabs";
import { BookOpen, ArrowLeft, Loader2, PencilLine } from "lucide-react";

const SD_DATA_URL = "/data/sd_new.json";
// --- BARU ---
// Definisikan URL untuk data kegiatan baru
const KEGIATAN_DATA_URL = "/data/data_kegiatan_sd.json";

// Fungsi transform khusus SD, disamakan dengan yang dipakai di tabel
function transformSingleSdSchool(rawSchool, kecamatanName) {
  const classes = rawSchool.classes || {};
  const rombel = rawSchool.rombel || {};
  const facilities = rawSchool.facilities || {};
  const classCondition = rawSchool.class_condition || {};
  const library = rawSchool.library || {};
  const laboratory = rawSchool.laboratory || {};
  const teacherRoom = rawSchool.teacher_room || {};
  const uksRoom = rawSchool.uks_room || {};
  const toilets = rawSchool.toilets || {};
  const officialResidences = rawSchool.official_residences || {};
  const furniture = rawSchool.furniture || {};

  const studentCount = parseInt(rawSchool.student_count, 10) || 0;

  const stMale = Object.keys(classes)
    .filter((k) => k.endsWith("_L"))
    .reduce((sum, key) => sum + (classes[key] || 0), 0);

  const stFemale = Object.keys(classes)
    .filter((k) => k.endsWith("_P"))
    .reduce((sum, key) => sum + (classes[key] || 0), 0);

  return {
    id: rawSchool.npsn,
    namaSekolah: rawSchool.name,
    npsn: rawSchool.npsn,
    kecamatan: kecamatanName,
    status: rawSchool.type,
    schoolType: "SD",
    jenjang: "SD",

    dataStatus: studentCount > 0 ? "Aktif" : "Data Belum Lengkap",
    st_male: stMale,
    st_female: stFemale,

    siswa: {
      jumlahSiswa: studentCount,
      kelas1: {
        l: parseInt(classes["1_L"], 10) || 0,
        p: parseInt(classes["1_P"], 10) || 0,
      },
      kelas2: {
        l: parseInt(classes["2_L"], 10) || 0,
        p: parseInt(classes["2_P"], 10) || 0,
      },
      kelas3: {
        l: parseInt(classes["3_L"], 10) || 0,
        p: parseInt(classes["3_P"], 10) || 0,
      },
      kelas4: {
        l: parseInt(classes["4_L"], 10) || 0,
        p: parseInt(classes["4_P"], 10) || 0,
      },
      kelas5: {
        l: parseInt(classes["5_L"], 10) || 0,
        p: parseInt(classes["5_P"], 10) || 0,
      },
      kelas6: {
        l: parseInt(classes["6_L"], 10) || 0,
        p: parseInt(classes["6_P"], 10) || 0,
      },
    },

    rombel: {
      kelas1: rombel["1"] || 0,
      kelas2: rombel["2"] || 0,
      kelas3: rombel["3"] || 0,
      kelas4: rombel["4"] || 0,
      kelas5: rombel["5"] || 0,
      kelas6: rombel["6"] || 0,
    },

    prasarana: {
      ukuran: {
        tanah: facilities.land_area,
        bangunan: facilities.building_area,
        halaman: facilities.yard_area,
      },
      ruangKelas: {
        jumlah: classCondition.total_room,
        baik: classCondition.classrooms_good,
        rusakSedang: classCondition.classrooms_moderate_damage,
        rusakBerat: classCondition.classrooms_heavy_damage,
      },
      ruangPerpustakaan: library,
      ruangLaboratorium: laboratory,
      ruangGuru: teacherRoom,
      ruangUks: uksRoom,
      toiletGuruSiswa: toilets,
      rumahDinas: officialResidences,
      mebeulair: furniture,
    },

    // sementara guru / ABK / kelembagaan masih kosong
    guru: {
      jumlahGuru: 0,
      pns: 0,
      pppk: 0,
      pppkParuhWaktu: 0,
      nonAsnDapodik: 0,
      nonAsnTidakDapodik: 0,
      kekuranganGuru: 0,
    },
    siswaAbk: {},
    kelembagaan: {},
    // --- BARU ---
    // Siapkan tempat untuk data kegiatan fisik
    kegiatanFisik: {},
  };
}

export default function SdDetailPage() {
  const params = useParams();
  const npsnParam = Array.isArray(params?.npsn) ? params.npsn[0] : params?.npsn;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        if (!npsnParam) {
          throw new Error("NPSN tidak valid");
        }

        // --- DIPERBARUI ---
        // Fetch data sekolah dan data kegiatan secara paralel
        const [res, resKegiatan] = await Promise.all([
          fetch(SD_DATA_URL),
          fetch(KEGIATAN_DATA_URL),
        ]);

        if (!res.ok) {
          throw new Error("Gagal memuat data SD");
        }
        if (!resKegiatan.ok) {
          throw new Error("Gagal memuat data kegiatan SD");
        }

        const rawData = await res.json();
        const rawKegiatanData = await resKegiatan.json();
        // --- SELESAI DIPERBARUI ---

        // Ubah JSON → array sekolah yang sudah di-transform
        const transformedSchools = Object.entries(rawData).flatMap(
          ([kecamatanName, schoolsInKecamatan]) =>
            schoolsInKecamatan.map((school) =>
              transformSingleSdSchool(school, kecamatanName)
            )
        );

        const found = transformedSchools.find(
          (school) => String(school.npsn) === String(npsnParam)
        );

        if (!found) {
          throw new Error("Sekolah dengan NPSN tersebut tidak ditemukan");
        }

        // --- BARU ---
        // Setelah sekolah ditemukan, cari data kegiatannya
        if (found && rawKegiatanData) {
          // 1. Filter semua kegiatan untuk NPSN ini
          const kegiatanSekolah = rawKegiatanData.filter(
            (keg) => String(keg.npsn) === String(npsnParam)
          );

          // 2. Proses dan hitung total "Lokal" untuk setiap jenis kegiatan
          // (Kita gunakan .toLowerCase() agar lebih aman)
          const rehabRuangKelas = kegiatanSekolah
            .filter((k) =>
              k.Kegiatan.toLowerCase().includes("rehab ruang kelas")
            )
            .reduce((sum, item) => sum + (Number(item.Lokal) || 0), 0);

          const rehabToilet = kegiatanSekolah
            .filter((k) => k.Kegiatan.toLowerCase().includes("rehab toilet"))
            .reduce((sum, item) => sum + (Number(item.Lokal) || 0), 0);

          const pembangunanToilet = kegiatanSekolah
            .filter((k) =>
              k.Kegiatan.toLowerCase().includes("pembangunan toilet")
            )
            .reduce((sum, item) => sum + (Number(item.Lokal) || 0), 0);

          const pembangunanRKB = kegiatanSekolah
            .filter((k) => k.Kegiatan.toLowerCase().includes("pembangunan rkb"))
            .reduce((sum, item) => sum + (Number(item.Lokal) || 0), 0);

          // 3. Masukkan data yang sudah diproses ke object sekolah
          found.kegiatanFisik = {
            rehabRuangKelas,
            rehabToilet,
            pembangunanToilet,
            pembangunanRKB,
          };
        }
        // --- SELESAI BARU ---

        if (!ignore) {
          setDetail(found);
        }
      } catch (e) {
        if (!ignore) {
          setError(e.message || "Terjadi kesalahan saat memuat data");
          setDetail(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [npsnParam]);

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-background md:pl-0">
        <main className="py-6 px-2 sm:px-3 md:px-4 space-y-4">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <BookOpen className="h-4 w-4" />
                <span>Detail SD</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Detail SD
              </h1>
              {npsnParam && (
                <p className="text-sm text-muted-foreground">
                  NPSN: <span className="font-mono">{npsnParam}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <Link href="/dashboard/sd">
                <Button variant="outline" size="sm">
                  Ke Data SD
                </Button>
              </Link>
              {npsnParam && (
                <Link href={`/dashboard/sd/edit/${npsnParam}`}>
                  <Button size="sm">
                    <PencilLine className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Konten */}
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Memuat detail...
            </div>
          )}

          {!loading && error && (
            <div className="p-4 border border-destructive/30 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {!loading && !error && detail && (
            <SchoolDetailsTabs school={detail} />
          )}
        </main>
      </div>
    </>
  );
}
