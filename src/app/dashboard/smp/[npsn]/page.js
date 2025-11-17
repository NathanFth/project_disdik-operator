"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "../../../components/Sidebar";
import { Button } from "../../../components/ui/button";
import SchoolDetailsTabs from "../../../components/SchoolDetailsTabs";
import { BookOpen, ArrowLeft, Loader2, PencilLine } from "lucide-react";

const SMP_DATA_URL = "/data/smp.json";
const OPERATOR_TYPE = "SMP";

const EMPTY_SISWA_DETAIL = {
  kelas1: { l: 0, p: 0 },
  kelas2: { l: 0, p: 0 },
  kelas3: { l: 0, p: 0 },
  kelas4: { l: 0, p: 0 },
  kelas5: { l: 0, p: 0 },
  kelas6: { l: 0, p: 0 },
  kelas7: { l: 0, p: 0 },
  kelas8: { l: 0, p: 0 },
  kelas9: { l: 0, p: 0 },
};

const EMPTY_GURU_DETAIL = {
  jumlahGuru: 0,
  pns: 0,
  pppk: 0,
  pppkParuhWaktu: 0,
  nonAsnDapodik: 0,
  nonAsnTidakDapodik: 0,
  kekuranganGuru: 0,
  jumlahTendik: 0,
};

function toNum(value) {
  const n = parseFloat(value);
  return Number.isNaN(n) ? 0 : n;
}

function transformSingleSmpSchool(rawSchool, kecamatanName) {
  const school = {
    ...rawSchool,
    kecamatan: kecamatanName,
  };

  const totalSiswa = toNum(school.student_count);

  // data guru (sementara dari blok teacher kalau nanti ada di JSON lain)
  const guruRaw = school.teacher || {};
  const jumlahGuru = toNum(guruRaw.teachers);
  const jumlahTendik = toNum(guruRaw.tendik);

  return {
    // ====== IDENTITAS ======
    id: school.npsn,
    namaSekolah: school.name,
    npsn: school.npsn,
    kecamatan: school.kecamatan,
    status: school.type || "NEGERI",
    schoolType: OPERATOR_TYPE, // "SMP"
    jenjang: "SMP",
    dataStatus: totalSiswa > 0 ? "Aktif" : "Data Belum Lengkap",

    address: school.address,
    village: school.village,
    coordinates: school.coordinates || null,

    // dipakai di ringkasan atas
    student_count: totalSiswa,
    st_male: toNum(school.st_male),
    st_female: toNum(school.st_female),

    // ====== SISWA ======
    siswa: {
      jumlahSiswa: totalSiswa,
      ...EMPTY_SISWA_DETAIL, // kalau nanti ada per kelas bisa diisi beneran
    },

    // ====== PRASARANA KHUSUS SMP (LEVEL ATAS) ======
    // biarkan mirip dengan struktur JSON aslinya, supaya SchoolDetailsTabs bisa baca
    class_condition: school.class_condition || {},
    library: school.library || {},
    laboratory_comp: school.laboratory_comp || {},
    laboratory_langua: school.laboratory_langua || {},
    laboratory_ipa: school.laboratory_ipa || {},
    laboratory_fisika: school.laboratory_fisika || {},
    laboratory_biologi: school.laboratory_biologi || {},
    kepsek_room: school.kepsek_room || {},
    teacher_room: school.teacher_room || {},
    administration_room: school.administration_room || {},
    uks_room: school.uks_room || {},

    teachers_toilet: school.teachers_toilet || {},
    students_toilet: school.students_toilet || {},

    furniture_computer: school.furniture_computer || {},
    official_residences: school.official_residences || {},

    // ====== GURU ======
    guru: {
      ...EMPTY_GURU_DETAIL,
      jumlahGuru,
      jumlahTendik,
    },

    // ====== KELEMBAGAAN (kalau datanya ada di JSON lain nanti tinggal diisi) ======
    kelembagaan: {
      kepalaSekolah: school.kepsek?.name || "",
      statusKepsek: school.kepsek?.status || "",
    },
  };
}

export default function SmpDetailPage() {
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

        const res = await fetch(SMP_DATA_URL);
        if (!res.ok) {
          throw new Error("Gagal memuat data SMP");
        }

        const rawData = await res.json();

        // rawData bentuknya: { "KecamatanName": [ {...}, ... ], ... }
        const transformedSchools = Object.entries(rawData).flatMap(
          ([kecamatanName, schoolsInKecamatan]) =>
            (schoolsInKecamatan || []).map((school) =>
              transformSingleSmpSchool(school, kecamatanName)
            )
        );

        const found = transformedSchools.find(
          (school) => String(school.npsn) === String(npsnParam)
        );

        if (!found) {
          throw new Error("SMP dengan NPSN tersebut tidak ditemukan");
        }

        if (!ignore) {
          setDetail(found);
        }
      } catch (e) {
        if (!ignore) {
          setError(e.message || "Terjadi kesalahan saat memuat data");
          setDetail(null);
        }
      } finally {
        if (!ignore) setLoading(false);
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
                <span>Detail SMP</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Detail SMP
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
              <Link href="/dashboard/smp">
                <Button variant="outline" size="sm">
                  Ke Data SMP
                </Button>
              </Link>
              {npsnParam && (
                <Link href={`/dashboard/smp/edit/${npsnParam}`}>
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
              Memuat detail…
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
