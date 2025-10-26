"use client";

import { useState, useEffect, useCallback, useMemo, cloneElement } from "react";
import { useRouter } from "next/navigation";
import {
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
  Save,
  ArrowLeft,
} from "lucide-react";

import { auth } from "../../lib/auth";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { useKecamatanData } from "../../hooks/useKecamatanData";
import { Combobox } from "./ui/Combobox";

/* =========================
   PUSAT KONFIGURASI SEKOLAH
   ========================= */
const schoolConfigs = {
  SD: {
    grades: [1, 2, 3, 4, 5, 6],
    lanjutDalamKabOptions: [
      { key: "smp", label: "SMP" },
      { key: "mts", label: "MTs" },
      { key: "pontren", label: "Pontren" },
      { key: "pkbm", label: "PKBM" },
    ],
    lanjutLuarKabOptions: [
      { key: "smp", label: "SMP" },
      { key: "mts", label: "MTs" },
      { key: "pontren", label: "Pontren" },
      { key: "pkbm", label: "PKBM" },
    ],
  },
  SMP: {
    grades: [7, 8, 9],
    lanjutDalamKabOptions: [
      { key: "sma", label: "SMA" },
      { key: "smk", label: "SMK" },
      { key: "ma", label: "MA" },
      { key: "pontren", label: "Pontren" },
      { key: "pkbm", label: "PKBM" },
    ],
    lanjutLuarKabOptions: [
      { key: "sma", label: "SMA" },
      { key: "smk", label: "SMK" },
      { key: "ma", label: "MA" },
      { key: "pontren", label: "Pontren" },
      { key: "pkbm", label: "PKBM" },
    ],
  },
  "TK/PAUD": {
    isPaud: true,
    rombelTypes: [
      { key: "tka", label: "TK A" },
      { key: "tkb", label: "TK B" },
      { key: "kb", label: "Kelompok Bermain (KB)" },
      { key: "sps_tpa", label: "SPS / TPA" },
    ],
    lanjutDalamKabOptions: [
      { key: "sd", label: "SD" },
      { key: "mi", label: "MI" },
    ],
    lanjutLuarKabOptions: [
      { key: "sd", label: "SD" },
      { key: "mi", label: "MI" },
    ],
  },
  "PKBM Terpadu": {
    isPkbm: true,
    pakets: {
      A: { name: "Paket A (Setara SD)", grades: [1, 2, 3, 4, 5, 6] },
      B: { name: "Paket B (Setara SMP)", grades: [7, 8, 9] },
      C: { name: "Paket C (Setara SMA)", grades: [10, 11, 12] },
    },
    lanjutPaketB: [
      { key: "sma", label: "SMA" },
      { key: "smk", label: "SMK" },
      { key: "ma", label: "MA" },
      { key: "paketC", label: "Lanjut Paket C" },
    ],
    lanjutPaketC: [
      { key: "pt", label: "Perguruan Tinggi" },
      { key: "bekerja", label: "Bekerja" },
    ],
  },
  default: { grades: [], lanjutDalamKabOptions: [], lanjutLuarKabOptions: [] },
};

schoolConfigs.TK = schoolConfigs["TK/PAUD"];
schoolConfigs.PAUD = schoolConfigs["TK/PAUD"];
schoolConfigs.PKBM = schoolConfigs["PKBM Terpadu"];

/* =========================
   INITIAL FORM DATA
   ========================= */
const createInitialFormData = (config) => {
  const baseData = {
    noUrut: "",
    noUrutSekolah: "",
    kecamatan: "",
    npsn: "",
    namaSekolah: "",
    status: "Swasta",
    siswa: { jumlahSiswa: "" },
    siswaAbk: {},
    rombel: {},
    prasarana: {
      ukuran: { tanah: "", bangunan: "", halaman: "" },
      gedung: { jumlah: "" },
      ruangKelas: {
        jumlah: "",
        baik: "",
        rusakRingan: "",
        rusakSedang: "",
        rusakBerat: "",
        rusakTotal: "",
        kelebihan: "",
        kurangRkb: "",
        rkbTambahan: "",
        lahan: "Ada",
      },
      ruangPerpustakaan: {
        jumlah: "",
        baik: "",
        rusakSedang: "",
        rusakBerat: "",
      },
      ruangLaboratorium: {
        jumlah: "",
        baik: "",
        rusakSedang: "",
        rusakBerat: "",
      },
      ruangGuru: { jumlah: "", baik: "", rusakSedang: "", rusakBerat: "" },
      ruangUks: { jumlah: "", baik: "", rusakSedang: "", rusakBerat: "" },
      toiletGuruSiswa: {
        jumlah: "",
        baik: "",
        rusakSedang: "",
        rusakBerat: "",
      },
      rumahDinas: { jumlah: "", baik: "", rusakSedang: "", rusakBerat: "" },
      mebeulair: {
        meja: { jumlah: "", baik: "", rusak: "" },
        kursi: { jumlah: "", baik: "", rusak: "" },
      },
      chromebook: "",
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
      jumlahGuru: "",
      pns: "",
      pppk: "",
      pppkParuhWaktu: "",
      nonAsnDapodik: "",
      nonAsnTidakDapodik: "",
      kekuranganGuru: "",
    },
  };

  // SMP → struktur flat prasarana
  if (config.grades && config.grades.length > 0 && config.grades[0] >= 7) {
    const smpData = {
      class_condition: {
        total_room: "",
        classrooms_good: "",
        classrooms_moderate_damage: "",
        classrooms_heavy_damage: "",
      },
      library: {
        total_all: "",
        good: "",
        moderate_damage: "",
        heavy_damage: "",
      },
      laboratory_comp: {
        total_all: "",
        good: "",
        moderate_damage: "",
        heavy_damage: "",
      },
      laboratory_langua: {
        total_all: "",
        good: "",
        moderate_damage: "",
        heavy_damage: "",
      },
      laboratory_ipa: {
        total_all: "",
        good: "",
        moderate_damage: "",
        heavy_damage: "",
      },
      laboratory_fisika: {
        total_all: "",
        good: "",
        moderate_damage: "",
        heavy_damage: "",
      },
      laboratory_biologi: {
        total_all: "",
        good: "",
        moderate_damage: "",
        heavy_damage: "",
      },
      kepsek_room: {
        total_all: "",
        good: "",
        moderate_damage: "",
        heavy_damage: "",
      },
      teacher_room: {
        total_all: "",
        good: "",
        moderate_damage: "",
        heavy_damage: "",
      },
      administration_room: {
        total_all: "",
        good: "",
        moderate_damage: "",
        heavy_damage: "",
      },
      uks_room: {
        total_all: "",
        good: "",
        moderate_damage: "",
        heavy_damage: "",
      },
      teachers_toilet: {
        male: {
          total_all: "",
          good: "",
          moderate_damage: "",
          heavy_damage: "",
        },
        female: {
          total_all: "",
          good: "",
          moderate_damage: "",
          heavy_damage: "",
        },
      },
      students_toilet: {
        male: {
          total_all: "",
          good: "",
          moderate_damage: "",
          heavy_damage: "",
        },
        female: {
          total_all: "",
          good: "",
          moderate_damage: "",
          heavy_damage: "",
        },
      },
      furniture_computer: { tables: "", chairs: "", boards: "", computer: "" },
      siswaLanjutDalamKab: {},
      siswaLanjutLuarKab: {},
      siswaTidakLanjut: "",
      siswaBekerja: "",
      siswa: { jumlahSiswa: "" },
      rombel: {},
      siswaAbk: {},
      guru: {
        jumlahGuru: "",
        pns: "",
        pppk: "",
        pppkParuhWaktu: "",
        nonAsnDapodik: "",
        nonAsnTidakDapodik: "",
        kekuranganGuru: "",
      },
      status: "Negeri",
    };

    const { grades, lanjutDalamKabOptions, lanjutLuarKabOptions } = config;

    grades.forEach((g) => {
      smpData.siswa[`kelas${g}`] = { l: "", p: "" };
      smpData.siswaAbk[`kelas${g}`] = { l: "", p: "" };
      smpData.rombel[`kelas${g}`] = "";
    });

    lanjutDalamKabOptions.forEach(
      (opt) => (smpData.siswaLanjutDalamKab[opt.key] = "")
    );
    lanjutLuarKabOptions.forEach(
      (opt) => (smpData.siswaLanjutLuarKab[opt.key] = "")
    );
    return smpData;
  }

  // PKBM
  if (config.isPkbm) {
    baseData.siswa.paketA = {};
    baseData.siswa.paketB = {};
    baseData.siswa.paketC = {};
    baseData.siswaAbk.paketA = {};
    baseData.siswaAbk.paketB = {};
    baseData.siswaAbk.paketC = {};
    baseData.rombel.paketA = {};
    baseData.rombel.paketB = {};
    baseData.rombel.paketC = {};
    baseData.lulusanPaketB = {};
    baseData.lulusanPaketC = {};

    Object.entries(config.pakets).forEach(([k, paket]) => {
      const key = `paket${k}`;
      paket.grades.forEach((grade) => {
        baseData.siswa[key][`kelas${grade}`] = { l: "", p: "" };
        baseData.siswaAbk[key][`kelas${grade}`] = { l: "", p: "" };
        baseData.rombel[key][`kelas${grade}`] = "";
      });
    });

    config.lanjutPaketB.forEach(
      (opt) => (baseData.lulusanPaketB[opt.key] = "")
    );
    config.lanjutPaketC.forEach(
      (opt) => (baseData.lulusanPaketC[opt.key] = "")
    );
  } else if (config.isPaud) {
    baseData.siswaLanjutDalamKab = {};
    baseData.siswaLanjutLuarKab = {};
    baseData.siswaTidakLanjut = "";

    config.rombelTypes.forEach((t) => {
      baseData.siswa[t.key] = { l: "", p: "" };
      baseData.siswaAbk[t.key] = { l: "", p: "" };
      baseData.rombel[t.key] = "";
    });

    config.lanjutDalamKabOptions.forEach(
      (opt) => (baseData.siswaLanjutDalamKab[opt.key] = "")
    );
    config.lanjutLuarKabOptions.forEach(
      (opt) => (baseData.siswaLanjutLuarKab[opt.key] = "")
    );
  } else if (config.grades) {
    baseData.status = "Negeri";
    baseData.siswaLanjutDalamKab = {};
    baseData.siswaLanjutLuarKab = {};
    baseData.siswaTidakLanjut = "";
    baseData.siswaBekerja = "";
    const { grades, lanjutDalamKabOptions, lanjutLuarKabOptions } = config;

    grades.forEach((g) => {
      baseData.siswa[`kelas${g}`] = { l: "", p: "" };
      baseData.siswaAbk[`kelas${g}`] = { l: "", p: "" };
      baseData.rombel[`kelas${g}`] = "";
    });

    lanjutDalamKabOptions.forEach(
      (opt) => (baseData.siswaLanjutDalamKab[opt.key] = "")
    );
    lanjutLuarKabOptions.forEach(
      (opt) => (baseData.siswaLanjutLuarKab[opt.key] = "")
    );
  }

  return baseData;
};

/* =========================
   STEPPER
   ========================= */
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
          Object.keys(errors).some((key) => section.fields.includes(key)) &&
          !isActive;

        return (
          <li
            key={section.id}
            className={cn("relative flex-1", {
              "pr-8": step < sections.length,
            })}
          >
            <div className="flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => (isCompleted || isActive) && setStep(step)}
                disabled={!isCompleted && !isActive}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full font-bold transition-all duration-300 z-10",
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
              <span className="mt-2 block text-xs font-medium text-gray-600">
                {section.title}
              </span>
            </div>

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

/* =========================
   FORM COMPONENT
   ========================= */
export default function DataInputForm({ schoolType, embedded = false }) {
  const config = useMemo(
    () => schoolConfigs[schoolType] || schoolConfigs.default,
    [schoolType]
  );

  const [isClient, setIsClient] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(() => createInitialFormData(config));
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({});
  const router = useRouter();

  const {
    kecamatanList,
    isLoading: isKecamatanLoading,
    error: kecamatanError,
  } = useKecamatanData();

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

  /* ---- mount/auth ---- */
  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient) return;
    const user = auth.getUser?.();
    if (!user) {
      router.push?.("/login");
      return;
    }
    setIsPageLoading(false);
  }, [isClient, router]);

  /* ---- total siswa auto-sum ---- */
  useEffect(() => {
    let total = 0;
    if (config.isPkbm) {
      total = Object.entries(config.pakets).reduce((sum, [key, paket]) => {
        const pKey = `paket${key}`;
        return (
          sum +
          paket.grades.reduce((t, g) => {
            const kelas = formData.siswa[pKey]?.[`kelas${g}`] || { l: 0, p: 0 };
            return t + (Number(kelas.l) || 0) + (Number(kelas.p) || 0);
          }, 0)
        );
      }, 0);
    } else if (config.isPaud) {
      total = config.rombelTypes.reduce((sum, t) => {
        const grp = formData.siswa[t.key] || { l: 0, p: 0 };
        return sum + (Number(grp.l) || 0) + (Number(grp.p) || 0);
      }, 0);
    } else if (config.grades && config.grades.length) {
      total = config.grades.reduce((sum, g) => {
        const kelas = formData.siswa[`kelas${g}`] || { l: 0, p: 0 };
        return sum + (Number(kelas.l) || 0) + (Number(kelas.p) || 0);
      }, 0);
    }

    if (Number(formData.siswa.jumlahSiswa) !== total) {
      setFormData((prev) => ({
        ...prev,
        siswa: { ...prev.siswa, jumlahSiswa: total || "" },
      }));
    }
  }, [formData.siswa, config]);

  /* ---- validation ---- */
  const validateField = useCallback((path, value) => {
    const required = (val, name) =>
      (val || "").toString().trim() ? null : `${name} wajib diisi`;
    const validNpsn = (n) =>
      /^\d{8}$/.test(n) ? null : "NPSN harus 8 digit angka";
    switch (path) {
      case "namaSekolah":
        return required(value, "Nama Sekolah");
      case "npsn":
        return validNpsn(value);
      case "kecamatan":
        return required(value, "Kecamatan");
      default:
        return null;
    }
  }, []);

  const validateStep = (idx) => {
    const section = sections[idx];
    if (!section.fields.length) return true;
    let ok = true;
    const stepErrors = {};
    section.fields.forEach((f) => {
      const v = formData[f];
      const e = validateField(f, v);
      if (e) {
        stepErrors[f] = e;
        ok = false;
      }
    });
    setErrors((prev) => {
      const copy = { ...prev };
      section.fields.forEach((f) => delete copy[f]);
      return { ...copy, ...stepErrors };
    });
    return ok;
  };

  /* ---- nav ---- */
  const handleNext = () => {
    if (!validateStep(currentStep - 1)) return;
    setCompletedSteps((prev) => ({ ...prev, [currentStep - 1]: true }));
    if (currentStep < sections.length) setCurrentStep((s) => s + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep - 1)) return;

    let ok = true;
    const allErrors = {};
    sections.forEach((sec, idx) => {
      if (!sec.fields.length) return;
      sec.fields.forEach((f) => {
        const e = validateField(f, formData[f]);
        if (e) {
          allErrors[f] = e;
          ok = false;
        }
      });
      setCompletedSteps((prev) => ({ ...prev, [idx]: true }));
    });
    setErrors(allErrors);
    if (!ok) {
      const firstField = Object.keys(allErrors)[0];
      const errIdx = sections.findIndex((s) => s.fields.includes(firstField));
      if (errIdx !== -1) setCurrentStep(errIdx + 1);
      return;
    }

    setSaving(true);
    console.log("SUBMIT:", { ...formData, schoolType });
    setTimeout(() => setSaving(false), 1200);
  };

  /* ---- helpers ---- */
  const handleInputChange = (path, value) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const next = JSON.parse(JSON.stringify(prev));
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur = cur[keys[i]] = cur[keys[i]] || {};
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleNumberChange = (path, value) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const next = JSON.parse(JSON.stringify(prev));
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur = cur[keys[i]] = cur[keys[i]] || {};
      }
      const numeric = String(value).replace(/[^0-9]/g, "");
      cur[keys[keys.length - 1]] = numeric === "" ? "" : parseInt(numeric, 10);
      return next;
    });
  };

  const renderNumberInput = (
    label,
    path,
    placeholder = "0",
    isRequired = false
  ) => {
    const value =
      path.split(".").reduce((o, k) => (o ? o[k] : undefined), formData) ?? "";
    const hasError = errors[path];
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label} {isRequired && <span className="text-destructive">*</span>}
        </label>
        <Input
          type="number"
          min="0"
          value={value}
          placeholder={placeholder}
          onChange={(e) => handleNumberChange(path, e.target.value)}
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

  const renderTextInput = (
    label,
    path,
    placeholder = "",
    isRequired = false
  ) => {
    const value =
      path.split(".").reduce((o, k) => (o ? o[k] : undefined), formData) || "";
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

  const renderSegmentedControl = (label, path, options) => {
    const value = path
      .split(".")
      .reduce((o, k) => (o ? o[k] : undefined), formData);
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
        <div className="flex items-center rounded-lg border p-1 bg-gray-100 w-full">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleInputChange(path, opt.value)}
              className={cn(
                "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                value === opt.value
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const prasaranaItems = [
    { title: "4. Ruang Perpustakaan", key: "ruangPerpustakaan" },
    { title: "5. Ruang Laboratorium", key: "ruangLaboratorium" },
    { title: "6. Ruang Guru", key: "ruangGuru" },
    { title: "7. Ruang UKS", key: "ruangUks" },
    { title: "8. Toilet Guru dan Siswa", key: "toiletGuruSiswa" },
    { title: "9. Rumah Dinas", key: "rumahDinas" },
  ];

  /* ---- section renderer (isi form) ---- */
  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case "info": {
        const hasKecamatanError = errors["kecamatan"];
        const hasStatusError = errors["status"];
        const statusOptions = [
          { value: "Negeri", label: "Negeri" },
          { value: "Swasta", label: "Swasta" },
        ];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {renderTextInput("Nama Sekolah", "namaSekolah", "", true)}
            {renderNumberInput("NPSN", "npsn", "8 digit angka", true)}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Kecamatan <span className="text-destructive">*</span>
              </label>
              <Combobox
                options={(kecamatanList || []).map((k) => ({
                  value: k,
                  label: k,
                }))}
                value={formData.kecamatan}
                onChange={(v) => handleInputChange("kecamatan", v)}
                placeholder={
                  isKecamatanLoading ? "Memuat..." : "Pilih Kecamatan"
                }
                searchPlaceholder="Cari kecamatan..."
                emptyText={kecamatanError || "Kecamatan tidak ditemukan."}
                disabled={isKecamatanLoading || !!kecamatanError}
                className={cn(hasKecamatanError && "border-destructive")}
              />
              {hasKecamatanError && (
                <p className="text-sm text-destructive mt-1.5">
                  {errors["kecamatan"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Status Sekolah <span className="text-destructive">*</span>
              </label>
              <Combobox
                options={statusOptions}
                value={formData.status}
                onChange={(v) => handleInputChange("status", v)}
                placeholder="Pilih Status"
                searchPlaceholder="Cari status..."
                emptyText="Status tidak ditemukan."
                className={cn(hasStatusError && "border-destructive")}
              />
              {hasStatusError && (
                <p className="text-sm text-destructive mt-1.5">
                  {errors["status"]}
                </p>
              )}
            </div>

            {renderNumberInput("No. Urut", "noUrut", "0", false)}
          </div>
        );
      }

      case "siswa": {
        if (config.isPkbm) {
          return (
            <div>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 text-lg">
                  Total Siswa (Semua Paket): {formData.siswa.jumlahSiswa || 0}
                </h4>
              </div>
              {/* Tabs dihilangkan untuk ringkas – tetap grid per paket */}
              {Object.entries(config.pakets).map(([key, paket]) => (
                <div key={key} className="mt-6">
                  <p className="font-semibold">{paket.name}</p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {paket.grades.map((kelas) => (
                      <div
                        key={`siswa-pkbm-${kelas}`}
                        className="p-4 border rounded-lg bg-gray-50"
                      >
                        <p className="font-semibold mb-3">Kelas {kelas}</p>
                        <div className="grid grid-cols-2 gap-4">
                          {renderNumberInput(
                            "Laki-laki",
                            `siswa.paket${key}.kelas${kelas}.l`
                          )}
                          {renderNumberInput(
                            "Perempuan",
                            `siswa.paket${key}.kelas${kelas}.p`
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        if (config.isPaud) {
          return (
            <div>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 text-lg">
                  Total Siswa (Semua Kelompok):{" "}
                  {formData.siswa.jumlahSiswa || 0}
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {config.rombelTypes.map((t) => (
                  <div
                    key={`siswa-${t.key}`}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <p className="font-semibold mb-3">{t.label}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {renderNumberInput("Laki-laki", `siswa.${t.key}.l`)}
                      {renderNumberInput("Perempuan", `siswa.${t.key}.p`)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        const { grades, gradeLabel } = config;
        return (
          <div>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 text-lg">
                Total Siswa: {formData.siswa.jumlahSiswa || 0}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {grades.map((kelas) => (
                <div
                  key={`siswa-kelas-${kelas}`}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <p className="font-semibold mb-3">
                    {gradeLabel || "Kelas"} {kelas}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {renderNumberInput("Laki-laki", `siswa.kelas${kelas}.l`)}
                    {renderNumberInput("Perempuan", `siswa.kelas${kelas}.p`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "abk": {
        if (config.isPkbm) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {Object.entries(config.pakets).map(([key, paket]) =>
                paket.grades.map((kelas) => (
                  <div
                    key={`abk-${key}-${kelas}`}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <p className="font-semibold mb-3">
                      ABK {paket.name.replace(/ \(.*\)/, "")} Kelas {kelas}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {renderNumberInput(
                        "Laki-laki",
                        `siswaAbk.paket${key}.kelas${kelas}.l`
                      )}
                      {renderNumberInput(
                        "Perempuan",
                        `siswaAbk.paket${key}.kelas${kelas}.p`
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        }

        if (config.isPaud) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {config.rombelTypes.map((t) => (
                <div
                  key={`abk-${t.key}`}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <p className="font-semibold mb-3">ABK {t.label}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {renderNumberInput("Laki-laki", `siswaAbk.${t.key}.l`)}
                    {renderNumberInput("Perempuan", `siswaAbk.${t.key}.p`)}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        const { grades, gradeLabel } = config;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {grades.map((kelas) => (
              <div
                key={`abk-kelas-${kelas}`}
                className="p-4 border rounded-lg bg-gray-50"
              >
                <p className="font-semibold mb-3">
                  ABK {gradeLabel || "Kelas"} {kelas}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {renderNumberInput("Laki-laki", `siswaAbk.kelas${kelas}.l`)}
                  {renderNumberInput("Perempuan", `siswaAbk.kelas${kelas}.p`)}
                </div>
              </div>
            ))}
          </div>
        );
      }

      case "rombel": {
        if (config.isPkbm) {
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(config.pakets).map(([key, paket]) =>
                paket.grades.map((kelas) => (
                  <div key={`rombel-${key}-${kelas}`}>
                    {renderNumberInput(
                      `Rombel Kelas ${kelas}`,
                      `rombel.paket${key}.kelas${kelas}`
                    )}
                  </div>
                ))
              )}
            </div>
          );
        }

        if (config.isPaud) {
          return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {config.rombelTypes.map((t) => (
                <div key={`rombel-${t.key}`}>
                  {renderNumberInput(`Rombel ${t.label}`, `rombel.${t.key}`)}
                </div>
              ))}
            </div>
          );
        }

        const { grades, gradeLabel } = config;
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {grades.map((kelas) => (
              <div key={`rombel-kelas-${kelas}`}>
                {renderNumberInput(
                  `Rombel ${gradeLabel || "Kelas"} ${kelas}`,
                  `rombel.kelas${kelas}`
                )}
              </div>
            ))}
          </div>
        );
      }

      case "lanjut": {
        if (config.isPkbm) {
          return (
            <div className="space-y-8">
              <div>
                <h4 className="font-medium text-foreground mb-3 border-b pb-2">
                  Kelanjutan Lulusan Paket B (Setara SMP)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  {config.lanjutPaketB.map((opt) =>
                    cloneElement(
                      renderNumberInput(opt.label, `lulusanPaketB.${opt.key}`),
                      {
                        key: `lanjut-b-${opt.key}`,
                      }
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3 border-b pb-2">
                  Kelanjutan Lulusan Paket C (Setara SMA)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  {config.lanjutPaketC.map((opt) =>
                    cloneElement(
                      renderNumberInput(opt.label, `lulusanPaketC.${opt.key}`),
                      {
                        key: `lanjut-c-${opt.key}`,
                      }
                    )
                  )}
                  {renderNumberInput(
                    "Tidak Melanjutkan",
                    `lulusanPaketC.tidakLanjut`
                  )}
                </div>
              </div>
            </div>
          );
        }

        const { lanjutDalamKabOptions, lanjutLuarKabOptions } = config;

        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">
                Siswa Melanjutkan Dalam Kabupaten
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {lanjutDalamKabOptions.map((opt) =>
                  cloneElement(
                    renderNumberInput(
                      opt.label,
                      `siswaLanjutDalamKab.${opt.key}`
                    ),
                    {
                      key: `dlm-${opt.key}`,
                    }
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3">
                Siswa Melanjutkan Luar Kabupaten
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {lanjutLuarKabOptions.map((opt) =>
                  cloneElement(
                    renderNumberInput(
                      opt.label,
                      `siswaLanjutLuarKab.${opt.key}`
                    ),
                    {
                      key: `luar-${opt.key}`,
                    }
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3">
                Siswa Tidak Melanjutkan / Bekerja
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {renderNumberInput("Tidak Melanjutkan", "siswaTidakLanjut")}
                {!config.isPaud && renderNumberInput("Bekerja", "siswaBekerja")}
              </div>
            </div>
          </div>
        );
      }

      case "prasarana": {
        if (schoolType === "SMP") {
          const group = (title, path) => (
            <div className="p-4 border rounded-lg bg-gray-50/50">
              <h4 className="font-semibold text-gray-900 mb-4">{title}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {renderNumberInput("Jumlah", `${path}.total_all`)}
                {renderNumberInput("Baik", `${path}.good`)}
                {renderNumberInput("Rusak Sedang", `${path}.moderate_damage`)}
                {renderNumberInput("Rusak Berat", `${path}.heavy_damage`)}
              </div>
            </div>
          );

          return (
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-gray-50/50">
                <h4 className="font-semibold text-gray-900 mb-4">
                  1. Ruang Kelas
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {renderNumberInput(
                    "Total Ruang",
                    `class_condition.total_room`
                  )}
                  {renderNumberInput("Baik", `class_condition.classrooms_good`)}
                  {renderNumberInput(
                    "Rusak Sedang",
                    `class_condition.classrooms_moderate_damage`
                  )}
                  {renderNumberInput(
                    "Rusak Berat",
                    `class_condition.classrooms_heavy_damage`
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group("2. Laboratorium Komputer", `laboratory_comp`)}
                {group("3. Laboratorium Bahasa", `laboratory_langua`)}
                {group("4. Laboratorium IPA", `laboratory_ipa`)}
                {group("5. Laboratorium Fisika", `laboratory_fisika`)}
                {group("6. Laboratorium Biologi", `laboratory_biologi`)}
                {group("7. Perpustakaan", `library`)}
                {group("8. Ruang Kepsek", `kepsek_room`)}
                {group("9. Ruang Guru", `teacher_room`)}
                {group("10. Ruang TU", `administration_room`)}
                {group("11. Ruang UKS", `uks_room`)}
              </div>
            </div>
          );
        }

        const prasarana = formData.prasarana || {};
        return (
          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-gray-50/50">
              <h4 className="font-semibold text-gray-900 mb-4">1. Ukuran</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderNumberInput("Tanah (m²)", "prasarana.ukuran.tanah")}
                {renderNumberInput(
                  "Bangunan (m²)",
                  "prasarana.ukuran.bangunan"
                )}
                {renderNumberInput("Halaman (m²)", "prasarana.ukuran.halaman")}
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-gray-50/50">
              <h4 className="font-semibold text-gray-900 mb-4">2. Gedung</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderNumberInput("Jumlah Gedung", "prasarana.gedung.jumlah")}
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-gray-50/50">
              <h4 className="font-semibold text-gray-900 mb-4">
                3. Ruang Kelas
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
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
                {renderNumberInput(
                  "Rusak Total",
                  "prasarana.ruangKelas.rusakTotal"
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t mt-4">
                {renderNumberInput(
                  "Kurang RKB",
                  "prasarana.ruangKelas.kurangRkb"
                )}
                {renderNumberInput(
                  "RKB Tambahan",
                  "prasarana.ruangKelas.rkbTambahan"
                )}
                {renderNumberInput(
                  "Kelebihan & Tidak Terawat",
                  "prasarana.ruangKelas.kelebihan"
                )}
                {renderSegmentedControl("Lahan", "prasarana.ruangKelas.lahan", [
                  { value: "Ada", label: "Ada" },
                  { value: "Tidak", label: "Tidak" },
                ])}
              </div>
            </div>

            {[
              { title: "4. Ruang Perpustakaan", key: "ruangPerpustakaan" },
              { title: "5. Ruang Laboratorium", key: "ruangLaboratorium" },
              { title: "6. Ruang Guru", key: "ruangGuru" },
              { title: "7. Ruang UKS", key: "ruangUks" },
              { title: "8. Toilet Guru dan Siswa", key: "toiletGuruSiswa" },
              { title: "9. Rumah Dinas", key: "rumahDinas" },
            ].map((item) => (
              <div
                key={item.key}
                className="p-4 border rounded-lg bg-gray-50/50"
              >
                <h4 className="font-semibold text-gray-900 mb-4">
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

            <div className="p-4 border rounded-lg bg-gray-50/50">
              <h4 className="font-semibold text-gray-900 mb-4">
                10. Mebeulair
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Meja</p>
                  <div className="grid grid-cols-3 gap-2">
                    {renderNumberInput(
                      "Jumlah",
                      "prasarana.mebeulair.meja.jumlah"
                    )}
                    {renderNumberInput("Baik", "prasarana.mebeulair.meja.baik")}
                    {renderNumberInput(
                      "Rusak",
                      "prasarana.mebeulair.meja.rusak"
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Kursi
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {renderNumberInput(
                      "Jumlah",
                      "prasarana.mebeulair.kursi.jumlah"
                    )}
                    {renderNumberInput(
                      "Baik",
                      "prasarana.mebeulair.kursi.baik"
                    )}
                    {renderNumberInput(
                      "Rusak",
                      "prasarana.mebeulair.kursi.rusak"
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-gray-50/50">
              <h4 className="font-semibold text-gray-900 mb-4">
                11. Jumlah Chromebook
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderNumberInput("Jumlah", "prasarana.chromebook")}
              </div>
            </div>
          </div>
        );
      }

      case "kelembagaan": {
        return (
          <div className="space-y-8">
            <div className="p-4 md:p-5 border rounded-lg bg-gray-50/70">
              <h4 className="text-base font-semibold text-gray-900 mb-5">
                Kelembagaan
              </h4>
              <div className="space-y-6">
                {renderSegmentedControl(
                  "1. Peralatan Rumah Tangga",
                  "kelembagaan.peralatanRumahTangga",
                  [
                    { value: "Tidak Memiliki", label: "Tidak Memiliki" },
                    { value: "Harus Diganti", label: "Harus Diganti" },
                    { value: "Baik", label: "Baik" },
                    {
                      value: "Perlu Rehabilitasi",
                      label: "Perlu Rehabilitasi",
                    },
                  ]
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {renderSegmentedControl(
                    "2. Pembinaan",
                    "kelembagaan.pembinaan",
                    [
                      { value: "Sudah", label: "Sudah" },
                      { value: "Belum", label: "Belum" },
                    ]
                  )}
                  {renderSegmentedControl("3. Asesmen", "kelembagaan.asesmen", [
                    { value: "Sudah", label: "Sudah" },
                    { value: "Belum", label: "Belum" },
                  ])}
                  {renderSegmentedControl(
                    "5. Menyelenggarakan Belajar",
                    "kelembagaan.menyelenggarakanBelajar",
                    [
                      { value: "Ya", label: "Ya" },
                      { value: "Tidak", label: "Tidak" },
                    ]
                  )}
                  {renderSegmentedControl(
                    "6. Melaksanakan Rekomendasi",
                    "kelembagaan.melaksanakanRekomendasi",
                    [
                      { value: "Ya", label: "Ya" },
                      { value: "Tidak", label: "Tidak" },
                    ]
                  )}
                  {renderSegmentedControl(
                    "7. Siap Dievaluasi",
                    "kelembagaan.siapDievaluasi",
                    [
                      { value: "Ya", label: "Ya" },
                      { value: "Tidak", label: "Tidak" },
                    ]
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 md:p-5 border rounded-lg bg-gray-50/70">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                4. BOP (Bantuan Operasional Pendidikan)
              </h4>
              <div className="space-y-4">
                {renderTextInput(
                  "Yang Mengelola",
                  "kelembagaan.bop.pengelola",
                  "Masukkan nama pengelola"
                )}
                {renderTextInput(
                  "Tenaga yang Ditingkatkan",
                  "kelembagaan.bop.tenagaPeningkatan",
                  "Masukkan info"
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-4 md:p-5 border rounded-lg bg-gray-50/70">
                <h4 className="text-base font-semibold text-gray-900 mb-4">
                  8. Perizinan
                </h4>
                <div className="space-y-4">
                  {renderTextInput(
                    "Pengendalian",
                    "kelembagaan.perizinan.pengendalian",
                    "Masukkan info pengendalian"
                  )}
                  {renderTextInput(
                    "Kelayakan",
                    "kelembagaan.perizinan.kelayakan",
                    "Masukkan info kelayakan"
                  )}
                </div>
              </div>

              <div className="p-4 md:p-5 border rounded-lg bg-gray-50/70">
                <h4 className="text-base font-semibold text-gray-900 mb-4">
                  9. Kurikulum
                </h4>
                <div className="space-y-4">
                  {renderTextInput(
                    "Silabus",
                    "kelembagaan.kurikulum.silabus",
                    "Masukkan info silabus"
                  )}
                  {renderTextInput(
                    "Kompetensi Dasar",
                    "kelembagaan.kurikulum.kompetensiDasar",
                    "Masukkan info kompetensi"
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case "guru": {
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
      }

      default:
        return <p>Konten tidak tersedia.</p>;
    }
  };

  /* ---- UI states ---- */
  if (!isClient || isPageLoading) {
    // loader ringan biar gak ngerusak layout parent
    return (
      <div className="py-10 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!config.grades && !config.isPaud && !config.isPkbm) {
    return (
      <div className="text-center text-destructive py-6">
        Error: Tipe Sekolah tidak valid untuk "{schoolType}"
      </div>
    );
  }

  const activeSection = sections[currentStep - 1];

  /* =========================
     RENDER
     ========================= */
  // MODE embedded: TIDAK ada Card/Sidebar/Wrapper – langsung isi
  if (embedded) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stepper ditempatkan di dalam kartu luar (parent) */}
        <div className="mb-2">
          <Stepper
            sections={sections}
            currentStep={currentStep}
            setStep={setCurrentStep}
            errors={errors}
            completedSteps={completedSteps}
          />
        </div>

        {/* Judul section aktif */}
        <div className="flex items-center gap-3 text-lg font-semibold">
          {activeSection.icon}
          <span>{activeSection.title}</span>
        </div>

        {/* Isi section */}
        {renderSectionContent(activeSection.id)}

        {/* Navigasi */}
        <div className="pt-4 flex justify-between items-center">
          <Button type="button" variant="ghost" onClick={() => router.back?.()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Batal
          </Button>

          <div className="flex items-center gap-4">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Simpan Data
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    );
  }

  // MODE standalone (kalau suatu saat mau dipakai sendiri)
  return (
    <main className="p-6">
      <div className="max-w-4xl mx-auto bg-white border rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Input Data {schoolType}
        </h1>
        <p className="text-sm text-gray-500">
          Lengkapi data sekolah langkah demi langkah.
        </p>

        <div className="mt-6">
          <Stepper
            sections={sections}
            currentStep={currentStep}
            setStep={setCurrentStep}
            errors={errors}
            completedSteps={completedSteps}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="flex items-center gap-3 text-lg font-semibold">
            {activeSection.icon}
            <span>{activeSection.title}</span>
          </div>

          {renderSectionContent(activeSection.id)}

          <div className="pt-4 flex justify-between items-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back?.()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Batal
            </Button>

            <div className="flex items-center gap-4">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Simpan Data
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
