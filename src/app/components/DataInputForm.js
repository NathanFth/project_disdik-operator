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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [activeSection, setActiveSection] = useState("info"); // Track active accordion section
  const router = useRouter();

  // Form data state dengan struktur lengkap
  const [formData, setFormData] = useState({
    // Basic Info
    noUrut: "",
    noUrutSekolah: "",
    kecamatan: "",
    npsn: "",
    namaSekolah: "",
    status: "Negeri",

    // Siswa
    siswa: {
      jumlahSiswa: 0,
      kelas1: { l: 0, p: 0 },
      kelas2: { l: 0, p: 0 },
      kelas3: { l: 0, p: 0 },
      kelas4: { l: 0, p: 0 },
      kelas5: { l: 0, p: 0 },
      kelas6: { l: 0, p: 0 },
    },

    // Siswa Berkebutuhan Khusus
    siswaAbk: {
      kelas1: { l: 0, p: 0 },
      kelas2: { l: 0, p: 0 },
      kelas3: { l: 0, p: 0 },
      kelas4: { l: 0, p: 0 },
      kelas5: { l: 0, p: 0 },
      kelas6: { l: 0, p: 0 },
    },

    // Siswa Melanjutkan
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

    // Rombel
    rombel: {
      kelas1: 0,
      kelas2: 0,
      kelas3: 0,
      kelas4: 0,
      kelas5: 0,
      kelas6: 0,
    },

    // Kondisi Prasarana
    prasarana: {
      ukuran: {
        tanah: 0,
        bangunan: 0,
        halaman: 0,
      },
      gedung: {
        jumlah: 0,
        baik: 0,
        rusakRingan: 0,
        rusakSedang: 0,
        rusakBerat: 0,
        rusakTotal: 0,
        kelebihan: 0,
        kurangRkb: 0,
        rkbTambahan: 0,
        lahan: 0,
      },
      ruangKelas: {
        jumlah: 0,
        baik: 0,
        rusakSedang: 0,
        rusakBerat: 0,
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
      rumahDinas: 0,
      mebeulairMeja: 0,
      mebeulairKursi: 0,
      chromebook: 0,
      peralatanRumahTangga: 0,
    },

    // Kelembagaan & Kurikulum
    kelembagaan: "",
    kurikulum: "",

    // Guru
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

  // Sections configuration for accordion
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
      id: "kurikulum",
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
    setLoading(false);
  }, [router]);

  // Validation functions
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

    // Required fields validation
    newErrors.namaSekolah = validateRequired(
      formData.namaSekolah,
      "Nama Sekolah"
    );
    newErrors.npsn = validateNPSN(formData.npsn);
    newErrors.kecamatan = validateRequired(formData.kecamatan, "Kecamatan");
    newErrors.status = validateRequired(formData.status, "Status Sekolah");

    // Non-negative validation for siswa
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

    // Consistency validations
    newErrors.totalSiswa = validateTotalSiswa();
    newErrors.rombelConsistency = validateRombelConsistency();

    // Remove null errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (section, field, subField, value) => {
    setFormData((prev) => {
      if (subField) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: {
              ...prev[section][field],
              [subField]: parseInt(value) || 0,
            },
          },
        };
      } else if (field) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: typeof value === "string" ? value : parseInt(value) || 0,
          },
        };
      } else {
        return {
          ...prev,
          [section]: typeof value === "string" ? value : parseInt(value) || 0,
        };
      }
    });

    // Clear related errors when user types
    if (
      errors[`${section}_${field}_${subField}`] ||
      errors[field] ||
      errors[section]
    ) {
      setErrors((prev) => ({
        ...prev,
        [`${section}_${field}_${subField}`]: null,
        [field]: null,
        [section]: null,
      }));
    }
  };

  // Auto calculate total siswa
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

    // Clear previous API errors
    setApiError("");
    setSaveStatus(null);

    // Validate form
    if (!validateForm()) {
      setApiError("Mohon perbaiki kesalahan pada form sebelum menyimpan");
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
        // Handle different types of API errors
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

      // Success
      setSaveStatus("success");
      setTimeout(() => {
        router.push(`/dashboard/${user.role.toLowerCase()}`);
      }, 2000);
    } catch (error) {
      // Network error
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
      case "info":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Urut <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.noUrut}
                onChange={(e) =>
                  handleInputChange("noUrut", null, null, e.target.value)
                }
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
                onChange={(e) =>
                  handleInputChange("npsn", null, null, e.target.value)
                }
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
                onChange={(e) =>
                  handleInputChange("namaSekolah", null, null, e.target.value)
                }
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
                onChange={(e) =>
                  handleInputChange("kecamatan", null, null, e.target.value)
                }
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
                onChange={(e) =>
                  handleInputChange("status", null, null, e.target.value)
                }
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kelas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Laki-laki
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Perempuan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5, 6].map((kelas) => {
                    const kelasKey = `kelas${kelas}`;
                    return (
                      <tr key={kelas}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Kelas {kelas}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            value={formData.siswa[kelasKey].l}
                            onChange={(e) =>
                              handleInputChange(
                                "siswa",
                                kelasKey,
                                "l",
                                e.target.value
                              )
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            value={formData.siswa[kelasKey].p}
                            onChange={(e) =>
                              handleInputChange(
                                "siswa",
                                kelasKey,
                                "p",
                                e.target.value
                              )
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formData.siswa[kelasKey].l +
                            formData.siswa[kelasKey].p}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "rombel":
        return (
          <div>
            {errors.rombelConsistency && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  {errors.rombelConsistency}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((kelas) => {
                const kelasKey = `kelas${kelas}`;
                return (
                  <div key={kelas}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kelas {kelas}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.rombel[kelasKey]}
                      onChange={(e) =>
                        handleInputChange(
                          "rombel",
                          kelasKey,
                          null,
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "guru":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Guru
              </label>
              <input
                type="number"
                min="0"
                value={formData.guru.jumlahGuru}
                onChange={(e) =>
                  handleInputChange("guru", "jumlahGuru", null, e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PNS
              </label>
              <input
                type="number"
                min="0"
                value={formData.guru.pns}
                onChange={(e) =>
                  handleInputChange("guru", "pns", null, e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PPPK
              </label>
              <input
                type="number"
                min="0"
                value={formData.guru.pppk}
                onChange={(e) =>
                  handleInputChange("guru", "pppk", null, e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kekurangan Guru
              </label>
              <input
                type="number"
                min="0"
                value={formData.guru.kekuranganGuru}
                onChange={(e) =>
                  handleInputChange(
                    "guru",
                    "kekuranganGuru",
                    null,
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case "abk":
        return (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Data siswa berkebutuhan khusus per kelas
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kelas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Laki-laki
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Perempuan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5, 6].map((kelas) => {
                    const kelasKey = `kelas${kelas}`;
                    return (
                      <tr key={kelas}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Kelas {kelas}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            value={formData.siswaAbk[kelasKey].l}
                            onChange={(e) =>
                              handleInputChange(
                                "siswaAbk",
                                kelasKey,
                                "l",
                                e.target.value
                              )
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            value={formData.siswaAbk[kelasKey].p}
                            onChange={(e) =>
                              handleInputChange(
                                "siswaAbk",
                                kelasKey,
                                "p",
                                e.target.value
                              )
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formData.siswaAbk[kelasKey].l +
                            formData.siswaAbk[kelasKey].p}
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
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Siswa Melanjutkan Dalam Kabupaten
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SMP
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.siswaLanjutDalamKab.smp}
                    onChange={(e) =>
                      handleInputChange(
                        "siswaLanjutDalamKab",
                        "smp",
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MTs
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.siswaLanjutDalamKab.mts}
                    onChange={(e) =>
                      handleInputChange(
                        "siswaLanjutDalamKab",
                        "mts",
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pontren
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.siswaLanjutDalamKab.pontren}
                    onChange={(e) =>
                      handleInputChange(
                        "siswaLanjutDalamKab",
                        "pontren",
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PKBM
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.siswaLanjutDalamKab.pkbm}
                    onChange={(e) =>
                      handleInputChange(
                        "siswaLanjutDalamKab",
                        "pkbm",
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Siswa Melanjutkan Luar Kabupaten
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SMP
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.siswaLanjutLuarKab.smp}
                    onChange={(e) =>
                      handleInputChange(
                        "siswaLanjutLuarKab",
                        "smp",
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MTs
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.siswaLanjutLuarKab.mts}
                    onChange={(e) =>
                      handleInputChange(
                        "siswaLanjutLuarKab",
                        "mts",
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pontren
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.siswaLanjutLuarKab.pontren}
                    onChange={(e) =>
                      handleInputChange(
                        "siswaLanjutLuarKab",
                        "pontren",
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PKBM
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.siswaLanjutLuarKab.pkbm}
                    onChange={(e) =>
                      handleInputChange(
                        "siswaLanjutLuarKab",
                        "pkbm",
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Siswa Tidak Melanjutkan
              </h4>
              <div className="w-full md:w-1/4">
                <input
                  type="number"
                  min="0"
                  value={formData.siswaTidakLanjut}
                  onChange={(e) =>
                    handleInputChange(
                      "siswaTidakLanjut",
                      null,
                      null,
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case "prasarana":
        return (
          <div className="space-y-6">
            {/* Ukuran */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Ukuran (m²)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanah
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prasarana.ukuran.tanah}
                    onChange={(e) =>
                      handleInputChange(
                        "prasarana",
                        "ukuran",
                        "tanah",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bangunan
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prasarana.ukuran.bangunan}
                    onChange={(e) =>
                      handleInputChange(
                        "prasarana",
                        "ukuran",
                        "bangunan",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Halaman
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prasarana.ukuran.halaman}
                    onChange={(e) =>
                      handleInputChange(
                        "prasarana",
                        "ukuran",
                        "halaman",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Ruang Kelas */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Kondisi Ruang Kelas
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prasarana.ruangKelas.jumlah}
                    onChange={(e) =>
                      handleInputChange(
                        "prasarana",
                        "ruangKelas",
                        "jumlah",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Baik
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prasarana.ruangKelas.baik}
                    onChange={(e) =>
                      handleInputChange(
                        "prasarana",
                        "ruangKelas",
                        "baik",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rusak Sedang
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prasarana.ruangKelas.rusakSedang}
                    onChange={(e) =>
                      handleInputChange(
                        "prasarana",
                        "ruangKelas",
                        "rusakSedang",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rusak Berat
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prasarana.ruangKelas.rusakBerat}
                    onChange={(e) =>
                      handleInputChange(
                        "prasarana",
                        "ruangKelas",
                        "rusakBerat",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Fasilitas Penunjang */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Fasilitas Penunjang
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rumah Dinas
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prasarana.rumahDinas}
                    onChange={(e) =>
                      handleInputChange(
                        "prasarana",
                        "rumahDinas",
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meja
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prasarana.mebeulairMeja}
                    onChange={(e) =>
                      handleInputChange(
                        "prasarana",
                        "mebeulairMeja",
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kursi
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prasarana.mebeulairKursi}
                    onChange={(e) =>
                      handleInputChange(
                        "prasarana",
                        "mebeulairKursi",
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chromebook
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prasarana.chromebook}
                    onChange={(e) =>
                      handleInputChange(
                        "prasarana",
                        "chromebook",
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "kurikulum":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kelembagaan
              </label>
              <select
                value={formData.kelembagaan}
                onChange={(e) =>
                  handleInputChange("kelembagaan", null, null, e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Kelembagaan</option>
                <option value="Reguler">Reguler</option>
                <option value="Terpadu">Terpadu</option>
                <option value="Inklusi">Inklusi</option>
                <option value="SLB">SLB</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kurikulum
              </label>
              <select
                value={formData.kurikulum}
                onChange={(e) =>
                  handleInputChange("kurikulum", null, null, e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Kurikulum</option>
                <option value="Kurikulum 2013">Kurikulum 2013</option>
                <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                <option value="KTSP">KTSP</option>
              </select>
            </div>
          </div>
        );

      // Add other sections as needed
      default:
        return (
          <div className="text-gray-500 text-center py-8">
            <p>Bagian ini sedang dalam pengembangan</p>
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
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() =>
                    router.push(`/dashboard/${user?.role.toLowerCase()}`)
                  }
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

            {/* Alert Messages */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-red-800 font-medium">
                    Terjadi Kesalahan
                  </h4>
                  <p className="text-red-700 text-sm mt-1">{apiError}</p>
                </div>
              </div>
            )}

            {saveStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-green-800 font-medium">
                    Berhasil Disimpan
                  </h4>
                  <p className="text-green-700 text-sm mt-1">
                    Data sekolah telah berhasil disimpan
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Accordion Sections */}
              {sections.map((section) => renderAccordionSection(section))}

              {/* Submit Button */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -m-6 mt-8">
                <div className="flex justify-end gap-4 max-w-4xl mx-auto">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/dashboard/${user?.role.toLowerCase()}`)
                    }
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
