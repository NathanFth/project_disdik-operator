// src/app/components/DataInputForm.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import {
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  School,
  Users,
  UserPlus,
  GraduationCap,
  BookOpen,
  Building,
  ClipboardList,
  UserCheck,
} from "lucide-react";
import { auth } from "../../lib/auth";

export default function DataInputForm({ schoolType = "SD" }) {
  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true); // <-- REMOVED this state
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [activeSection, setActiveSection] = useState("info");
  const router = useRouter();

  // Form data state dengan struktur lengkap yang telah diperbarui
  const [formData, setFormData] = useState({
    // Basic Info (Tidak diubah)
    noUrut: "",
    noUrutSekolah: "",
    kecamatan: "",
    npsn: "",
    namaSekolah: "",
    status: "Negeri",

    // Siswa (Tidak diubah)
    siswa: {
      jumlahSiswa: 0,
      kelas1: { l: 0, p: 0 },
      kelas2: { l: 0, p: 0 },
      kelas3: { l: 0, p: 0 },
      kelas4: { l: 0, p: 0 },
      kelas5: { l: 0, p: 0 },
      kelas6: { l: 0, p: 0 },
    },

    // Siswa Berkebutuhan Khusus (Tidak diubah)
    siswaAbk: {
      kelas1: { l: 0, p: 0 },
      kelas2: { l: 0, p: 0 },
      kelas3: { l: 0, p: 0 },
      kelas4: { l: 0, p: 0 },
      kelas5: { l: 0, p: 0 },
      kelas6: { l: 0, p: 0 },
    },

    // Siswa Melanjutkan (Tidak diubah)
    siswaLanjutDalamKab: {
      smp: 0,
      mts: 0,
      pontren: 0,
      pkbm: 0,
    },
    siswaLanjutLuarKab: {
      smp: 0,
      mts: 0,
      pontren: 0,
      pkbm: 0,
    },
    siswaTidakLanjut: 0,

    // Rombel (Tidak diubah)
    rombel: {
      kelas1: 0,
      kelas2: 0,
      kelas3: 0,
      kelas4: 0,
      kelas5: 0,
      kelas6: 0,
    },

    // Kondisi Prasarana (Diperbarui sesuai permintaan)
    prasarana: {
      ukuran: {
        tanah: 0,
        bangunan: 0,
        halaman: 0,
      },
      gedung: {
        jumlah: 0,
      },
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
        lahan: "Ada", // 'Ada' atau 'Tidak'
      },
      ruangPerpustakaan: {
        jumlah: 0,
        baik: 0,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      ruangLaboratorium: {
        jumlah: 0,
        baik: 0,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      ruangGuru: {
        jumlah: 0,
        baik: 0,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      ruangUks: {
        jumlah: 0,
        baik: 0,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      toiletGuruSiswa: {
        jumlah: 0,
        baik: 0,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      rumahDinas: {
        jumlah: 0,
        baik: 0,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      mebeulair: {
        meja: { jumlah: 0, baik: 0, rusak: 0 },
        kursi: { jumlah: 0, baik: 0, rusak: 0 },
      },
      chromebook: 0,
    },

    // Kelembagaan & Kurikulum (Diperbarui sesuai permintaan)
    kelembagaan: {
      peralatanRumahTangga: "Baik", // "Tidak Memiliki", "Harus Diganti", "Baik", "Perlu Rehabilitasi"
      pembinaan: "Belum", // "Sudah", "Belum"
      asesmen: "Belum", // "Sudah", "Belum"
      bop: {
        pengelola: "",
        tenagaPeningkatan: "",
      },
      menyelenggarakanBelajar: "Tidak", // "Ya", "Tidak"
      melaksanakanRekomendasi: "Tidak", // "Ya", "Tidak"
      siapDievaluasi: "Tidak", // "Ya", "Tidak"
      perizinan: {
        pengendalian: "",
        kelayakan: "",
      },
      kurikulum: {
        silabus: "",
        kompetensiDasar: "",
      },
    },

    // Guru (Diperbarui sesuai permintaan)
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

  // Konfigurasi section accordion (tidak diubah)
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
      id: "kelembagaan", // ID disesuaikan
      title: "Kelembagaan & Kurikulum",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    { id: "guru", title: "Data Guru", icon: <UserCheck className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const userData = auth.getUser();
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(userData);
    // setLoading(false); // <-- REMOVED this
  }, [router]);

  // Fungsi validasi (tidak diubah)
  const validateRequired = (value, fieldName) => {
    if (!value || value.toString().trim() === "") {
      return `${fieldName} wajib diisi`;
    }
    return null;
  };

  const validateNPSN = (npsn) => {
    if (!npsn) return "NPSN wajib diisi";
    if (!/^\d{8}$/.test(npsn)) {
      return "NPSN harus terdiri dari 8 digit angka";
    }
    return null;
  };

  const validateNonNegative = (value, fieldName) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0) {
      return `${fieldName} tidak boleh minus`;
    }
    return null;
  };

  const validateTotalSiswa = () => {
    const totalFromClasses = Object.keys(formData.siswa).reduce(
      (total, kelas) => {
        if (
          kelas !== "jumlahSiswa" &&
          typeof formData.siswa[kelas] === "object"
        ) {
          return total + formData.siswa[kelas].l + formData.siswa[kelas].p;
        }
        return total;
      },
      0
    );

    if (totalFromClasses !== formData.siswa.jumlahSiswa) {
      return "Total siswa tidak konsisten dengan jumlah per kelas";
    }
    return null;
  };

  const validateRombelConsistency = () => {
    const errors = [];
    for (let i = 1; i <= 6; i++) {
      const kelasKey = `kelas${i}`;
      const rombelCount = formData.rombel[kelasKey];
      const siswaCount =
        formData.siswa[kelasKey].l + formData.siswa[kelasKey].p;

      if (rombelCount > 0 && siswaCount === 0) {
        errors.push(`Kelas ${i} memiliki rombel tapi tidak ada siswa`);
      }
    }
    return errors.length > 0 ? errors.join(", ") : null;
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.namaSekolah = validateRequired(
      formData.namaSekolah,
      "Nama Sekolah"
    );
    newErrors.npsn = validateNPSN(formData.npsn);
    newErrors.kecamatan = validateRequired(formData.kecamatan, "Kecamatan");
    newErrors.status = validateRequired(formData.status, "Status Sekolah");
    Object.keys(formData.siswa).forEach((kelas) => {
      if (typeof formData.siswa[kelas] === "object") {
        newErrors[`siswa_${kelas}_l`] = validateNonNegative(
          formData.siswa[kelas].l,
          `Siswa ${kelas} Laki-laki`
        );
        newErrors[`siswa_${kelas}_p`] = validateNonNegative(
          formData.siswa[kelas].p,
          `Siswa ${kelas} Perempuan`
        );
      }
    });
    newErrors.totalSiswa = validateTotalSiswa();
    newErrors.rombelConsistency = validateRombelConsistency();
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fungsi handleInputChange yang telah diperbarui untuk menangani nested state
  const handleInputChange = (path, value) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const newFormData = JSON.parse(JSON.stringify(prev)); // Deep clone
      let current = newFormData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      const finalKey = keys[keys.length - 1];
      // Cek jika input seharusnya number
      if (typeof current[finalKey] === 'number') {
        current[finalKey] = parseInt(value, 10) || 0;
      } else {
        current[finalKey] = value;
      }
      return newFormData;
    });
  };

  // Auto kalkulasi total siswa (tidak diubah)
  useEffect(() => {
    const totalSiswa = Object.keys(formData.siswa).reduce((total, kelas) => {
      if (
        kelas !== "jumlahSiswa" &&
        typeof formData.siswa[kelas] === "object"
      ) {
        return total + formData.siswa[kelas].l + formData.siswa[kelas].p;
      }
      return total;
    }, 0);

    setFormData((prev) => ({
      ...prev,
      siswa: {
        ...prev.siswa,
        jumlahSiswa: totalSiswa,
      },
    }));
  }, [
    formData.siswa.kelas1,
    formData.siswa.kelas2,
    formData.siswa.kelas3,
    formData.siswa.kelas4,
    formData.siswa.kelas5,
    formData.siswa.kelas6,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSaveStatus(null);
    if (!validateForm()) {
      setApiError("Mohon perbaiki kesalahan pada form sebelum menyimpan");
      // Cari section pertama yang ada error dan buka
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const sectionId = firstErrorKey.split('_')[0];
        setActiveSection(sectionId);
      }
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`/api/data-input/${schoolType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({
          schoolType,
          ...formData,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        switch (response.status) {
          case 400:
            setApiError(result.message || "Data yang dikirim tidak valid");
            break;
          case 401:
            setApiError("Sesi Anda telah berakhir, silakan login kembali");
            setTimeout(() => {
              auth.logout();
              router.push("/login");
            }, 2000);
            break;
          case 500:
            setApiError("Terjadi kesalahan server, silakan coba lagi");
            break;
          default:
            setApiError("Terjadi kesalahan, silakan coba lagi");
        }
        return;
      }
      setSaveStatus("success");
      setTimeout(() => {
        router.push(`/dashboard/${user.role.toLowerCase()}`);
      }, 2000);
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setApiError("Koneksi gagal, periksa internet Anda");
      } else {
        setApiError("Terjadi kesalahan jaringan, silakan coba lagi");
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? "" : sectionId);
  };

  // UPDATED: Render loading spinner if user is not yet available
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Helper untuk membuat input number
  const renderNumberInput = (label, path) => {
    const keys = path.split('.');
    let value = formData;
    keys.forEach(key => {
        if (value) value = value[key];
    });

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => handleInputChange(path, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };

  const renderAccordionSection = (section) => {
    const isActive = activeSection === section.id;
    return (
      <div key={section.id} className="border border-gray-200 rounded-lg mb-4">
        <button
          type="button"
          onClick={() => toggleSection(section.id)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">{section.icon}</span>
            <h3 className="text-lg font-medium text-gray-900">
              {section.title}
            </h3>
          </div>
          {isActive ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {isActive && (
          <div className="px-6 py-4 border-t border-gray-200">
            {renderSectionContent(section.id)}
          </div>
        )}
      </div>
    );
  };

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      // BAGIAN YANG TIDAK DIUBAH
      case "info":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Urut
              </label>
              <input
                type="text"
                value={formData.noUrut}
                onChange={(e) => handleInputChange("noUrut", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NPSN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.npsn}
                onChange={(e) => handleInputChange("npsn", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.npsn ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="8 digit angka"
              />
              {errors.npsn && (
                <p className="text-red-500 text-sm mt-1">{errors.npsn}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Sekolah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.namaSekolah}
                onChange={(e) => handleInputChange("namaSekolah", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.namaSekolah ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.namaSekolah && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.namaSekolah}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kecamatan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.kecamatan}
                onChange={(e) => handleInputChange("kecamatan", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.kecamatan ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.kecamatan && (
                <p className="text-red-500 text-sm mt-1">{errors.kecamatan}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Negeri">Negeri</option>
                <option value="Swasta">Swasta</option>
              </select>
            </div>
          </div>
        );
      case "siswa":
        return (
          <div>
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">
                Total Siswa: {formData.siswa.jumlahSiswa}
              </h4>
              {errors.totalSiswa && (
                <p className="text-red-500 text-sm mt-1">{errors.totalSiswa}</p>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laki-laki</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perempuan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5, 6].map((kelas) => {
                    const kelasKey = `kelas${kelas}`;
                    return (
                      <tr key={kelas}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Kelas {kelas}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="number" min="0"
                            value={formData.siswa[kelasKey].l}
                            onChange={(e) => handleInputChange(`siswa.${kelasKey}.l`, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="number" min="0"
                            value={formData.siswa[kelasKey].p}
                            onChange={(e) => handleInputChange(`siswa.${kelasKey}.p`, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formData.siswa[kelasKey].l + formData.siswa[kelasKey].p}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "abk":
        return (
            <div>
                <p className="text-sm text-gray-600 mb-4">Data siswa berkebutuhan khusus per kelas</p>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laki-laki</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perempuan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[1, 2, 3, 4, 5, 6].map((kelas) => {
                                const kelasKey = `kelas${kelas}`;
                                return (
                                    <tr key={kelas}>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Kelas {kelas}</td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <input
                                                type="number" min="0"
                                                value={formData.siswaAbk[kelasKey].l}
                                                onChange={(e) => handleInputChange(`siswaAbk.${kelasKey}.l`, e.target.value)}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <input
                                                type="number" min="0"
                                                value={formData.siswaAbk[kelasKey].p}
                                                onChange={(e) => handleInputChange(`siswaAbk.${kelasKey}.p`, e.target.value)}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formData.siswaAbk[kelasKey].l + formData.siswaAbk[kelasKey].p}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
      case "lanjut":
          return (
              <div className="space-y-6">
                  <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Siswa Melanjutkan Dalam Kabupaten</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {renderNumberInput("SMP", "siswaLanjutDalamKab.smp")}
                          {renderNumberInput("MTs", "siswaLanjutDalamKab.mts")}
                          {renderNumberInput("Pontren", "siswaLanjutDalamKab.pontren")}
                          {renderNumberInput("PKBM", "siswaLanjutDalamKab.pkbm")}
                      </div>
                  </div>
                  <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Siswa Melanjutkan Luar Kabupaten</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {renderNumberInput("SMP", "siswaLanjutLuarKab.smp")}
                          {renderNumberInput("MTs", "siswaLanjutLuarKab.mts")}
                          {renderNumberInput("Pontren", "siswaLanjutLuarKab.pontren")}
                          {renderNumberInput("PKBM", "siswaLanjutLuarKab.pkbm")}
                      </div>
                  </div>
                  <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Siswa Tidak Melanjutkan</h4>
                      <div className="w-full md:w-1/4">
                          {renderNumberInput("", "siswaTidakLanjut")}
                      </div>
                  </div>
              </div>
          );
      case "rombel":
        return (
          <div>
            {errors.rombelConsistency && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{errors.rombelConsistency}</p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((kelas) => {
                const kelasKey = `kelas${kelas}`;
                return (
                  <div key={kelas}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kelas {kelas}</label>
                    <input
                      type="number" min="0"
                      value={formData.rombel[kelasKey]}
                      onChange={(e) => handleInputChange(`rombel.${kelasKey}`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );

      // BAGIAN YANG DIPERBARUI
      case "prasarana":
        return (
          <div className="space-y-8">
            {/* Ukuran */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">1. Ukuran</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderNumberInput("Tanah (m²)", "prasarana.ukuran.tanah")}
                {renderNumberInput("Bangunan (m²)", "prasarana.ukuran.bangunan")}
                {renderNumberInput("Halaman (m²)", "prasarana.ukuran.halaman")}
              </div>
            </div>

            {/* Gedung */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">2. Gedung</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderNumberInput("Jumlah Gedung", "prasarana.gedung.jumlah")}
              </div>
            </div>

            {/* Ruang Kelas */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">3. Ruang Kelas</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {renderNumberInput("Jumlah", "prasarana.ruangKelas.jumlah")}
                {renderNumberInput("Baik", "prasarana.ruangKelas.baik")}
                {renderNumberInput("Rusak Ringan", "prasarana.ruangKelas.rusakRingan")}
                {renderNumberInput("Rusak Sedang", "prasarana.ruangKelas.rusakSedang")}
                {renderNumberInput("Rusak Berat", "prasarana.ruangKelas.rusakBerat")}
                {renderNumberInput("Rusak Total", "prasarana.ruangKelas.rusakTotal")}
                {renderNumberInput("Kelebihan", "prasarana.ruangKelas.kelebihan")}
                {renderNumberInput("Kurang RKB", "prasarana.ruangKelas.kurangRkb")}
                {renderNumberInput("RKB Tambahan", "prasarana.ruangKelas.rkbTambahan")}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lahan</label>
                  <select
                    value={formData.prasarana.ruangKelas.lahan}
                    onChange={(e) => handleInputChange("prasarana.ruangKelas.lahan", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Ada">Ada</option>
                    <option value="Tidak">Tidak</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ruang Lainnya */}
            {[
                { title: "4. Ruang Perpustakaan", key: "ruangPerpustakaan" },
                { title: "5. Ruang Laboratorium", key: "ruangLaboratorium" },
                { title: "6. Ruang Guru", key: "ruangGuru" },
                { title: "7. Ruang UKS", key: "ruangUks" },
                { title: "8. Toilet Guru dan Siswa", key: "toiletGuruSiswa" },
                { title: "9. Rumah Dinas", key: "rumahDinas" },
            ].map(item => (
                <div key={item.key}>
                    <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">{item.title}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {renderNumberInput("Jumlah", `prasarana.${item.key}.jumlah`)}
                        {renderNumberInput("Baik", `prasarana.${item.key}.baik`)}
                        {renderNumberInput("Rusak Sedang", `prasarana.${item.key}.rusakSedang`)}
                        {renderNumberInput("Rusak Berat", `prasarana.${item.key}.rusakBerat`)}
                    </div>
                </div>
            ))}
            
            {/* Mebeulair */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">10. Mebeulair</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                    <p className="font-medium text-gray-600 mb-2">Meja</p>
                    <div className="grid grid-cols-3 gap-2">
                        {renderNumberInput("Jumlah", "prasarana.mebeulair.meja.jumlah")}
                        {renderNumberInput("Baik", "prasarana.mebeulair.meja.baik")}
                        {renderNumberInput("Rusak", "prasarana.mebeulair.meja.rusak")}
                    </div>
                </div>
                 <div>
                    <p className="font-medium text-gray-600 mb-2">Kursi</p>
                    <div className="grid grid-cols-3 gap-2">
                        {renderNumberInput("Jumlah", "prasarana.mebeulair.kursi.jumlah")}
                        {renderNumberInput("Baik", "prasarana.mebeulair.kursi.baik")}
                        {renderNumberInput("Rusak", "prasarana.mebeulair.kursi.rusak")}
                    </div>
                </div>
              </div>
            </div>

            {/* Chromebook */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">11. Chromebook</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderNumberInput("Jumlah Chromebook", "prasarana.chromebook")}
              </div>
            </div>

          </div>
        );
      case "kelembagaan":
        return (
            <div className="space-y-8">
                {/* Peralatan Rumah Tangga */}
                <div>
                    <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">1. Peralatan Rumah Tangga</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status Peralatan</label>
                            <select
                                value={formData.kelembagaan.peralatanRumahTangga}
                                onChange={(e) => handleInputChange("kelembagaan.peralatanRumahTangga", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Baik">Baik</option>
                                <option value="Tidak Memiliki">Tidak Memiliki</option>
                                <option value="Harus Diganti">Harus Diganti</option>
                                <option value="Perlu Rehabilitasi">Perlu Rehabilitasi</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Pembinaan & Asesmen */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">2. Pembinaan</h4>
                        <select
                            value={formData.kelembagaan.pembinaan}
                            onChange={(e) => handleInputChange("kelembagaan.pembinaan", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Sudah">Sudah</option>
                            <option value="Belum">Belum</option>
                        </select>
                    </div>
                    <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">3. Asesmen</h4>
                        <select
                            value={formData.kelembagaan.asesmen}
                            onChange={(e) => handleInputChange("kelembagaan.asesmen", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Sudah">Sudah</option>
                            <option value="Belum">Belum</option>
                        </select>
                    </div>
                </div>

                {/* BOP */}
                <div>
                    <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">4. BOP</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Yang Mengelola</label>
                            <input type="text" value={formData.kelembagaan.bop.pengelola} onChange={(e) => handleInputChange("kelembagaan.bop.pengelola", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tenaga yang Ditingkatkan</label>
                            <input type="text" value={formData.kelembagaan.bop.tenagaPeningkatan} onChange={(e) => handleInputChange("kelembagaan.bop.tenagaPeningkatan", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                        </div>
                    </div>
                </div>

                {/* Lainnya */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-2">5. Menyelenggarakan Belajar</h4>
                        <select value={formData.kelembagaan.menyelenggarakanBelajar} onChange={(e) => handleInputChange("kelembagaan.menyelenggarakanBelajar", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="Ya">Ya</option>
                            <option value="Tidak">Tidak</option>
                        </select>
                    </div>
                    <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-2">6. Melaksanakan Rekomendasi</h4>
                        <select value={formData.kelembagaan.melaksanakanRekomendasi} onChange={(e) => handleInputChange("kelembagaan.melaksanakanRekomendasi", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="Ya">Ya</option>
                            <option value="Tidak">Tidak</option>
                        </select>
                    </div>
                    <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-2">7. Siap Dievaluasi</h4>
                        <select value={formData.kelembagaan.siapDievaluasi} onChange={(e) => handleInputChange("kelembagaan.siapDievaluasi", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="Ya">Ya</option>
                            <option value="Tidak">Tidak</option>
                        </select>
                    </div>
                </div>

                {/* Perizinan & Kurikulum */}
                <div>
                    <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">8. Perizinan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pengendalian</label>
                            <input type="text" value={formData.kelembagaan.perizinan.pengendalian} onChange={(e) => handleInputChange("kelembagaan.perizinan.pengendalian", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kelayakan</label>
                            <input type="text" value={formData.kelembagaan.perizinan.kelayakan} onChange={(e) => handleInputChange("kelembagaan.perizinan.kelayakan", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                        </div>
                    </div>
                </div>
                 <div>
                    <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">9. Kurikulum</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Silabus</label>
                            <input type="text" value={formData.kelembagaan.kurikulum.silabus} onChange={(e) => handleInputChange("kelembagaan.kurikulum.silabus", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kompetensi Dasar</label>
                            <input type="text" value={formData.kelembagaan.kurikulum.kompetensiDasar} onChange={(e) => handleInputChange("kelembagaan.kurikulum.kompetensiDasar", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                        </div>
                    </div>
                </div>
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
            {renderNumberInput("Non ASN (Non-Dapodik)", "guru.nonAsnTidakDapodik")}
            {renderNumberInput("Kekurangan Guru", "guru.kekuranganGuru")}
          </div>
        );

      default:
        return (
          <div className="text-gray-500 text-center py-8">
            <p>Konten untuk bagian ini belum tersedia.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => router.push(`/dashboard/${user?.role.toLowerCase()}`)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Kembali
                </button>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Input Data Sekolah {schoolType}
              </h1>
              <p className="text-gray-600 mt-1">
                Lengkapi semua informasi sekolah dengan teliti
              </p>
            </div>

            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-red-800 font-medium">Terjadi Kesalahan</h4>
                  <p className="text-red-700 text-sm mt-1">{apiError}</p>
                </div>
              </div>
            )}
            {saveStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-green-800 font-medium">Berhasil Disimpan</h4>
                  <p className="text-green-700 text-sm mt-1">
                    Data sekolah telah berhasil disimpan
                  </p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {sections.map((section) => renderAccordionSection(section))}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -m-6 mt-8">
                <div className="flex justify-end gap-4 max-w-4xl mx-auto">
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/${user?.role.toLowerCase()}`)}
                    className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={saving}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Simpan Data
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
