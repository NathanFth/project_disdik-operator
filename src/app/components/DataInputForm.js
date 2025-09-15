"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import {
  Save,
  ArrowLeft,
  AlertCircle,
  School,
  Users,
  UserPlus,
  GraduationCap,
  BookOpen,
  Building,
  ClipboardList,
  UserCheck,
  Loader2,
  Check,
} from "lucide-react";
import { auth } from "../../lib/auth";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "./ui/utils";

// --- Data Form Awal ---
const initialFormData = {
  noUrut: "",
  noUrutSekolah: "",
  kecamatan: "",
  npsn: "",
  namaSekolah: "",
  status: "Negeri",
  siswa: {
    jumlahSiswa: 0,
    kelas1: { l: 0, p: 0 },
    kelas2: { l: 0, p: 0 },
    kelas3: { l: 0, p: 0 },
    kelas4: { l: 0, p: 0 },
    kelas5: { l: 0, p: 0 },
    kelas6: { l: 0, p: 0 },
  },
  siswaAbk: {
    kelas1: { l: 0, p: 0 },
    kelas2: { l: 0, p: 0 },
    kelas3: { l: 0, p: 0 },
    kelas4: { l: 0, p: 0 },
    kelas5: { l: 0, p: 0 },
    kelas6: { l: 0, p: 0 },
  },
  siswaLanjutDalamKab: { smp: 0, mts: 0, pontren: 0, pkbm: 0 },
  siswaLanjutLuarKab: { smp: 0, mts: 0, pontren: 0, pkbm: 0 },
  siswaTidakLanjut: 0,
  rombel: { kelas1: 0, kelas2: 0, kelas3: 0, kelas4: 0, kelas5: 0, kelas6: 0 },
  prasarana: {
    ukuran: { tanah: 0, bangunan: 0, halaman: 0 },
    gedung: { jumlah: 0 },
    ruangKelas: {
      jumlah: 0,
      baik: 0,
      rusakRingan: 0,
      rusakSedang: 0,
      rusakBerat: 0,
      rusakTotal: 0,
      kelebihan: 0,
      kurangRkb: 0,
      rkbTambahan: 0,
      lahan: "Ada",
    },
    ruangPerpustakaan: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
    ruangLaboratorium: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
    ruangGuru: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
    ruangUks: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
    toiletGuruSiswa: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
    rumahDinas: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
    mebeulair: {
      meja: { jumlah: 0, baik: 0, rusak: 0 },
      kursi: { jumlah: 0, baik: 0, rusak: 0 },
    },
    chromebook: 0,
  },
  kelembagaan: {
    peralatanRumahTangga: "Baik",
    pembinaan: "Belum",
    asesmen: "Belum",
    bop: { pengelola: "", tenagaPeningkatan: "" },
    menyelenggarakanBelajar: "Tidak",
    melaksanakanRekomendasi: "Tidak",
    siapDievaluasi: "Tidak",
    perizinan: { pengendalian: "", kelayakan: "" },
    kurikulum: { silabus: "", kompetensiDasar: "" },
  },
  guru: {
    jumlahGuru: 0,
    pns: 0,
    pppk: 0,
    pppkParuhWaktu: 0,
    nonAsnDapodik: 0,
    nonAsnTidakDapodik: 0,
    kekuranganGuru: 0,
  },
};

// --- Komponen Stepper (REVISI) ---
const Stepper = ({
  sections,
  currentStep,
  setStep,
  errors,
  completedSteps,
}) => (
  <nav aria-label="Form Steps" className="w-full">
    <ol className="flex items-start">
      {sections.map((section, index) => {
        const step = index + 1;
        const isCompleted = completedSteps[index];
        const isActive = step === currentStep;
        const hasError =
          Object.keys(errors).some((key) =>
            section.fields.includes(key)
          ) &&
          !isActive;

        return (
          <li
            key={section.id}
            className={cn("relative flex-1", {
              // Mengurangi padding karena item lebih ramping
              "pr-8": step < sections.length,
            })}
          >
            {/* Perubahan Utama: Mengubah layout menjadi kolom vertikal.
              - `flex-col`: Menyusun item secara vertikal.
              - `items-center`: Menengahkan item (ikon dan teks).
            */}
            <div className="flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => (isCompleted || isActive) && setStep(step)}
                disabled={!isCompleted && !isActive}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full font-bold transition-all duration-300 z-10", // Tambah z-10 agar di atas garis
                  isActive
                    ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                    : hasError
                    ? "bg-destructive text-destructive-foreground"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600",
                  (isCompleted || isActive) && "cursor-pointer"
                )}
              >
                {isCompleted && !isActive && !hasError ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <span>{step}</span>
                )}
              </button>
              {/* Teks judul sekarang di bawah ikon.
                - `mt-2`: Memberi jarak dari ikon di atasnya.
                - `text-xs`: Ukuran font lebih kecil agar rapi.
                - Menghapus `hidden sm:block` agar selalu terlihat.
              */}
              <span className="mt-2 block text-xs font-medium text-gray-600">
                {section.title}
              </span>
            </div>

            {/* Garis penghubung antar step.
              Posisinya disesuaikan agar tetap di tengah secara vertikal.
            */}
            {step < sections.length && (
              <div
                className="absolute top-5 left-1/2 -z-10 h-0.5 w-full bg-gray-200"
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
export default function DataInputForm({ schoolType = "SD" }) {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [kecamatanList, setKecamatanList] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({});

  const sections = [
    {
      id: "info",
      title: "Info Sekolah",
      icon: <School className="w-5 h-5" />,
      fields: ["namaSekolah", "npsn", "kecamatan"],
    },
    {
      id: "siswa",
      title: "Data Siswa",
      icon: <Users className="w-5 h-5" />,
      fields: [],
    },
    {
      id: "abk",
      title: "Siswa ABK",
      icon: <UserPlus className="w-5 h-5" />,
      fields: [],
    },
    {
      id: "lanjut",
      title: "Siswa Lanjut",
      icon: <GraduationCap className="w-5 h-5" />,
      fields: [],
    },
    {
      id: "rombel",
      title: "Rombel",
      icon: <BookOpen className="w-5 h-5" />,
      fields: [],
    },
    {
      id: "prasarana",
      title: "Prasarana",
      icon: <Building className="w-5 h-5" />,
      fields: [],
    },
    {
      id: "kelembagaan",
      title: "Kelembagaan",
      icon: <ClipboardList className="w-5 h-5" />,
      fields: [],
    },
    {
      id: "guru",
      title: "Data Guru",
      icon: <UserCheck className="w-5 h-5" />,
      fields: [],
    },
  ];

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const init = async () => {
        const userData = auth.getUser();
        if (!userData) {
          router.push("/login");
          return;
        }
        setUser(userData);
        try {
          const response = await fetch("/data/kecamatan.geojson");
          const data = await response.json();
          const list = [
            ...new Set(data.features.map((f) => f.properties.KECAMATAN)),
          ].sort();
          setKecamatanList(list);
        } catch (error) {
          console.error("Gagal memuat data kecamatan:", error);
        } finally {
          setIsLoading(false);
        }
      };
      init();
    }
  }, [isClient, router]);

  const validateField = useCallback((path, value) => {
    const validateRequired = (val, fieldName) =>
      (val || "").toString().trim() ? null : `${fieldName} wajib diisi`;
    const validateNPSN = (npsn) =>
      /^\d{8}$/.test(npsn) ? null : "NPSN harus 8 digit angka";
    switch (path) {
      case "namaSekolah":
        return validateRequired(value, "Nama Sekolah");
      case "npsn":
        return validateNPSN(value);
      case "kecamatan":
        return validateRequired(value, "Kecamatan");
      default:
        return null;
    }
  }, []);

  const validateStep = (stepIndex) => {
    const section = sections[stepIndex];
    if (!section.fields.length) return true;

    let isValid = true;
    let stepErrors = {};
    section.fields.forEach((field) => {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) {
        stepErrors[field] = error;
        isValid = false;
      }
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      section.fields.forEach((f) => delete newErrors[f]);
      return { ...newErrors, ...stepErrors };
    });
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep - 1)) {
      setCompletedSteps((prev) => ({ ...prev, [currentStep - 1]: true }));
      if (currentStep < sections.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep - 1)) return;

    let allValid = true;
    let allErrors = {};
    sections.forEach((section, index) => {
      if (section.fields.length > 0) {
        section.fields.forEach((field) => {
          const error = validateField(field, formData[field]);
          if (error) {
            allErrors[field] = error;
            allValid = false;
          }
        });
      }
      setCompletedSteps((prev) => ({ ...prev, [index]: true }));
    });

    setErrors(allErrors);
    if (!allValid) {
      const firstErrorField = Object.keys(allErrors)[0];
      const errorStepIndex = sections.findIndex((s) =>
        s.fields.includes(firstErrorField)
      );
      if (errorStepIndex !== -1) {
        setCurrentStep(errorStepIndex + 1);
      }
      return;
    }

    setSaving(true);
    console.log("Form is valid, submitting...", formData);
    setTimeout(() => setSaving(false), 2000);
  };

  const handleInputChange = (path, value) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const newFormData = JSON.parse(JSON.stringify(prev));
      let current = newFormData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = current[keys[i]] || {};
      }
      const finalKey = keys[keys.length - 1];
      const originalValue = current[finalKey];
      if (typeof originalValue === "number" && !isNaN(originalValue)) {
        current[finalKey] = value === "" ? 0 : parseInt(value, 10) || 0;
      } else {
        current[finalKey] = value;
      }
      return newFormData;
    });
  };

  useEffect(() => {
    const totalSiswa = Object.values(formData.siswa)
      .slice(1)
      .reduce((total, kelas) => total + (kelas.l || 0) + (kelas.p || 0), 0);
    if (formData.siswa.jumlahSiswa !== totalSiswa) {
      setFormData((prev) => ({
        ...prev,
        siswa: { ...prev.siswa, jumlahSiswa: totalSiswa },
      }));
    }
  }, [formData.siswa]);

  const renderNumberInput = (label, path) => {
    const value = path.split(".").reduce((o, k) => o?.[k], formData) ?? "";
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
        <Input
          type="number"
          min="0"
          value={value}
          onChange={(e) => handleInputChange(path, e.target.value)}
          className="bg-input-background"
        />
      </div>
    );
  };

  const renderTextInput = (
    label,
    path,
    placeholder = "",
    isRequired = false
  ) => {
    const value = path.split(".").reduce((o, k) => o?.[k], formData) || "";
    const hasError = errors[path];
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label} {isRequired && <span className="text-destructive">*</span>}
        </label>
        <Input
          value={value}
          onChange={(e) => handleInputChange(path, e.target.value)}
          placeholder={placeholder}
          className={cn(
            "bg-input-background",
            hasError && "border-destructive"
          )}
        />
        {hasError && (
          <p className="text-sm text-destructive mt-1.5">{errors[path]}</p>
        )}
      </div>
    );
  };

  const renderSelect = (label, path, options, isRequired = false) => {
    const value = path.split(".").reduce((o, k) => o?.[k], formData);
    const hasError = errors[path];
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label} {isRequired && <span className="text-destructive">*</span>}
        </label>
        <Select
          value={value || ""}
          onValueChange={(val) => handleInputChange(path, val)}
        >
          <SelectTrigger
            className={cn(
              "bg-input-background",
              hasError && "border-destructive"
            )}
          >
            <SelectValue placeholder={`Pilih ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasError && (
          <p className="text-sm text-destructive mt-1.5">{errors[path]}</p>
        )}
      </div>
    );
  };

  // Variabel yang hilang di versi sebelumnya
  const prasaranaItems = [
    { title: "3. Ruang Perpustakaan", key: "ruangPerpustakaan" },
    { title: "4. Ruang Laboratorium", key: "ruangLaboratorium" },
    { title: "5. Ruang Guru", key: "ruangGuru" },
    { title: "6. Ruang UKS", key: "ruangUks" },
    { title: "7. Toilet", key: "toiletGuruSiswa" },
    { title: "8. Rumah Dinas", key: "rumahDinas" },
  ];

  // Fungsi render konten yang lengkap
  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case "info":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {renderTextInput("Nama Sekolah", "namaSekolah", "", true)}
            {renderTextInput("NPSN", "npsn", "8 digit angka", true)}
            {renderSelect(
              "Kecamatan",
              "kecamatan",
              kecamatanList.map((k) => ({ value: k, label: k })),
              true
            )}
            {renderSelect(
              "Status Sekolah",
              "status",
              [
                { value: "Negeri", label: "Negeri" },
                { value: "Swasta", label: "Swasta" },
              ],
              true
            )}
            {renderNumberInput("No. Urut", "noUrut")}
          </div>
        );
      case "siswa":
        return (
          <div>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 text-lg">
                Total Siswa: {formData.siswa.jumlahSiswa}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {[1, 2, 3, 4, 5, 6].map((kelas) => (
                <div
                  key={`siswa-kelas-${kelas}`}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <p className="font-semibold mb-3">Kelas {kelas}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {renderNumberInput("Laki-laki", `siswa.kelas${kelas}.l`)}
                    {renderNumberInput("Perempuan", `siswa.kelas${kelas}.p`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "abk":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {[1, 2, 3, 4, 5, 6].map((kelas) => (
              <div
                key={`abk-kelas-${kelas}`}
                className="p-4 border rounded-lg bg-gray-50"
              >
                <p className="font-semibold mb-3">ABK Kelas {kelas}</p>
                <div className="grid grid-cols-2 gap-4">
                  {renderNumberInput("Laki-laki", `siswaAbk.kelas${kelas}.l`)}
                  {renderNumberInput("Perempuan", `siswaAbk.kelas${kelas}.p`)}
                </div>
              </div>
            ))}
          </div>
        );
      case "lanjut":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">
                Siswa Melanjutkan Dalam Kabupaten
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {renderNumberInput("SMP", "siswaLanjutDalamKab.smp")}
                {renderNumberInput("MTs", "siswaLanjutDalamKab.mts")}
                {renderNumberInput("Pontren", "siswaLanjutDalamKab.pontren")}
                {renderNumberInput("PKBM", "siswaLanjutDalamKab.pkbm")}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">
                Siswa Melanjutkan Luar Kabupaten
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {renderNumberInput("SMP", "siswaLanjutLuarKab.smp")}
                {renderNumberInput("MTs", "siswaLanjutLuarKab.mts")}
                {renderNumberInput("Pontren", "siswaLanjutLuarKab.pontren")}
                {renderNumberInput("PKBM", "siswaLanjutLuarKab.pkbm")}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">
                Siswa Tidak Melanjutkan
              </h4>
              <div className="w-full md:w-1/4">
                {renderNumberInput("Jumlah", "siswaTidakLanjut")}
              </div>
            </div>
          </div>
        );
      case "rombel":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((kelas) => (
              <div key={`rombel-kelas-${kelas}`}>
                {renderNumberInput(
                  `Rombel Kelas ${kelas}`,
                  `rombel.kelas${kelas}`
                )}
              </div>
            ))}
          </div>
        );
      case "prasarana":
        return (
          <div className="space-y-8">
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">
                1. Ukuran
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderNumberInput("Tanah (m²)", "prasarana.ukuran.tanah")}
                {renderNumberInput(
                  "Bangunan (m²)",
                  "prasarana.ukuran.bangunan"
                )}
                {renderNumberInput("Halaman (m²)", "prasarana.ukuran.halaman")}
              </div>
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">
                2. Ruang Kelas
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {renderNumberInput("Jumlah", "prasarana.ruangKelas.jumlah")}
                {renderNumberInput("Baik", "prasarana.ruangKelas.baik")}
                {renderNumberInput(
                  "Rusak Ringan",
                  "prasarana.ruangKelas.rusakRingan"
                )}
                {renderNumberInput(
                  "Rusak Sedang",
                  "prasarana.ruangKelas.rusakSedang"
                )}
                {renderNumberInput(
                  "Rusak Berat",
                  "prasarana.ruangKelas.rusakBerat"
                )}
                {renderSelect("Lahan", "prasarana.ruangKelas.lahan", [
                  { value: "Ada", label: "Ada" },
                  { value: "Tidak", label: "Tidak" },
                ])}
              </div>
            </div>
            {prasaranaItems.map((item) => (
              <div key={item.key}>
                <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">
                  {item.title}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {renderNumberInput("Jumlah", `prasarana.${item.key}.jumlah`)}
                  {renderNumberInput("Baik", `prasarana.${item.key}.baik`)}
                  {renderNumberInput(
                    "Rusak Sedang",
                    `prasarana.${item.key}.rusakSedang`
                  )}
                  {renderNumberInput(
                    "Rusak Berat",
                    `prasarana.${item.key}.rusakBerat`
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      case "guru":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {renderNumberInput("Jumlah Guru", "guru.jumlahGuru")}
            {renderNumberInput("PNS", "guru.pns")}
            {renderNumberInput("PPPK", "guru.pppk")}
            {renderNumberInput("PPPK Paruh Waktu", "guru.pppkParuhWaktu")}
            {renderNumberInput("Non ASN (Dapodik)", "guru.nonAsnDapodik")}
            {renderNumberInput(
              "Non ASN (Non-Dapodik)",
              "guru.nonAsnTidakDapodik"
            )}
            {renderNumberInput("Kekurangan Guru", "guru.kekuranganGuru")}
          </div>
        );
      default:
        return <p>Konten tidak tersedia.</p>;
    }
  };

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const activeSection = sections[currentStep - 1];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Input Data {schoolType}
              </h1>
              <p className="text-sm text-gray-500">
                Lengkapi data sekolah langkah demi langkah.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 mb-8 sticky top-0 z-10 backdrop-blur-sm bg-opacity-80">
              <Stepper
                sections={sections}
                currentStep={currentStep}
                setStep={setCurrentStep}
                errors={errors}
                completedSteps={completedSteps}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="bg-white p-6 rounded-lg border">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    {activeSection.icon}
                    {activeSection.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {renderSectionContent(activeSection.id)}
                </CardContent>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Batal
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                    >
                      Kembali
                    </Button>
                  )}
                  {currentStep < sections.length ? (
                    <Button type="button" onClick={handleNext}>
                      Lanjut
                    </Button>
                  ) : (
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          {" "}
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Menyimpan...{" "}
                        </>
                      ) : (
                        <>
                          {" "}
                          <Save className="mr-2 h-4 w-4" /> Simpan Data{" "}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
