"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import {
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  School,
  Users,
  UserPlus,
  GraduationCap,
  BookOpen,
  Building,
  ClipboardList,
  UserCheck,
  Loader2,
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

export default function DataInputForm({ schoolType = "SD" }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading awal
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [kecamatanList, setKecamatanList] = useState([]);
  const [touchedFields, setTouchedFields] = useState({});
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  // Form data state (struktur tetap sama)
  const [formData, setFormData] = useState({
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
    rombel: {
      kelas1: 0,
      kelas2: 0,
      kelas3: 0,
      kelas4: 0,
      kelas5: 0,
      kelas6: 0,
    },
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
  });

  const sections = [
    {
      id: "info",
      title: "Informasi Sekolah",
      icon: <School className="w-5 h-5" />,
    },
    { id: "siswa", title: "Data Siswa", icon: <Users className="w-5 h-5" /> },
    {
      id: "abk",
      title: "Siswa Berkebutuhan Khusus",
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      id: "lanjut",
      title: "Siswa Melanjutkan",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: "rombel",
      title: "Rombongan Belajar",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "prasarana",
      title: "Prasarana Sekolah",
      icon: <Building className="w-5 h-5" />,
    },
    {
      id: "kelembagaan",
      title: "Kelembagaan & Kurikulum",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    { id: "guru", title: "Data Guru", icon: <UserCheck className="w-5 h-5" /> },
  ];

  const router = useRouter();

  useEffect(() => {
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
        const list = data.features
          .map((feature) => feature.properties.KECAMATAN)
          .sort();
        setKecamatanList(list);
      } catch (error) {
        console.error("Gagal memuat data kecamatan:", error);
      } finally {
        setIsLoading(false); // Selesaikan loading setelah semua data siap
      }
    };
    init();
  }, [router]);

  // --- LOGIKA VALIDASI INTERAKTIF ---
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

  const runValidation = useCallback(() => {
    const newErrors = {};
    const fieldsToValidate = ["namaSekolah", "npsn", "kecamatan"];
    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const handleBlur = (path) => {
    setTouchedFields((prev) => ({ ...prev, [path]: true }));
    const value = path.split(".").reduce((o, k) => o?.[k], formData);
    const error = validateField(path, value);
    setErrors((prev) => ({ ...prev, [path]: error }));
  };

  const handleInputChange = (path, value) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const newFormData = JSON.parse(JSON.stringify(prev));
      let current = newFormData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] || {};
      }
      const finalKey = keys[keys.length - 1];
      const originalValue = current[finalKey];
      if (typeof originalValue === "number") {
        current[finalKey] = parseInt(value, 10) || 0;
      } else {
        current[finalKey] = value;
      }
      return newFormData;
    });

    if (touchedFields[path] || isSubmitAttempted) {
      const error = validateField(path, value);
      setErrors((prev) => ({ ...prev, [path]: error }));
    }
  };

  const handleSelectChange = (path, value) => {
    handleInputChange(path, value);
    setTouchedFields((prev) => ({ ...prev, [path]: true }));
    const error = validateField(path, value);
    setErrors((prev) => ({ ...prev, [path]: error }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitAttempted(true);
    const isValid = runValidation();

    if (!isValid) {
      const firstErrorKey = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorKey) {
        const sectionId = firstErrorKey.split(".")[0];
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    console.log("Form is valid, proceeding to submit...");
  };

  // FIX: Menggunakan isLoading untuk mencegah Hydration Mismatch
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // Helper Functions untuk merender input agar lebih bersih
  const renderNumberInput = (label, path) => {
    const keys = path.split(".");
    let value = formData;
    keys.forEach((key) => {
      if (value) value = value[key];
    });
    const hasError = (touchedFields[path] || isSubmitAttempted) && errors[path];

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
          onBlur={() => handleBlur(path)}
          className={`bg-input-background ${
            hasError ? "border-destructive" : ""
          }`}
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
    const value = path.split(".").reduce((o, k) => o?.[k], formData) || "";
    const hasError = (touchedFields[path] || isSubmitAttempted) && errors[path];
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label} {isRequired && <span className="text-destructive">*</span>}
        </label>
        <Input
          value={value}
          onChange={(e) => handleInputChange(path, e.target.value)}
          onBlur={() => handleBlur(path)}
          placeholder={placeholder}
          className={`bg-input-background ${
            hasError ? "border-destructive" : ""
          }`}
        />
        {hasError && (
          <p className="text-sm text-destructive mt-1.5">{errors[path]}</p>
        )}
      </div>
    );
  };

  const renderSelect = (label, path, options, isRequired = false) => {
    const value = path.split(".").reduce((o, k) => o?.[k], formData);
    const hasError = (touchedFields[path] || isSubmitAttempted) && errors[path];
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label} {isRequired && <span className="text-destructive">*</span>}
        </label>
        <Select
          value={value}
          onValueChange={(value) => handleSelectChange(path, value)}
        >
          <SelectTrigger
            className={`bg-input-background ${
              hasError ? "border-destructive" : ""
            }`}
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
                  className="p-4 border rounded-lg bg-background"
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
                className="p-4 border rounded-lg bg-background"
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
            {[
              { title: "3. Ruang Perpustakaan", key: "ruangPerpustakaan" },
              { title: "4. Ruang Laboratorium", key: "ruangLaboratorium" },
              { title: "5. Ruang Guru", key: "ruangGuru" },
            ].map((item) => (
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
        return (
          <p className="text-muted-foreground">
            Silakan pilih bagian form dari menu navigasi di samping.
          </p>
        );
    }
  };

  return (
    <div className="flex h-screen bg-muted/40">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start">
                <div className="mb-6 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="rounded-full"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">
                      Input Data {schoolType}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Isi data secara lengkap
                    </p>
                  </div>
                </div>
                {isSubmitAttempted &&
                  Object.keys(errors).filter((k) => errors[k]).length > 0 && (
                    <Card className="mb-6 bg-destructive/10 border-destructive/30">
                      <CardHeader className="p-4">
                        <CardTitle className="text-destructive text-base flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" />
                          Terdapat{" "}
                          {
                            Object.keys(errors).filter((k) => errors[k]).length
                          }{" "}
                          Kesalahan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <ul className="list-disc pl-5 space-y-1 text-sm text-destructive/90">
                          {Object.entries(errors)
                            .filter(([, message]) => message)
                            .map(([key, message]) => (
                              <li key={key}>
                                <a
                                  href={`#${key.split(".")[0]}`}
                                  className="hover:underline"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    document
                                      .getElementById(key.split(".")[0])
                                      ?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                      });
                                  }}
                                >
                                  {message}
                                </a>
                              </li>
                            ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                <div className="space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-accent focus:outline-none focus:bg-accent"
                    >
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                        {sections.findIndex((s) => s.id === section.id) + 1}
                      </span>
                      {section.title}
                    </a>
                  ))}
                </div>
              </aside>

              <div className="lg:col-span-3 space-y-6">
                {sections.map((section) => (
                  <Card
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        {section.icon}
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderSectionContent(section.id)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t py-3 mt-8">
              <div className="max-w-6xl mx-auto flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={saving}
                >
                  Batal
                </Button>
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
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
