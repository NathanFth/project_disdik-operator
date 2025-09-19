"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import {
  School,
  MapPin,
  Users,
  GraduationCap,
  Building,
  Calendar,
  UserCheck,
  ClipboardList,
  UserPlus,
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";

// Helper Konstanta
const PAUD_ROMBEL_TYPES = [
  { key: "tka", label: "TK A" },
  { key: "tkb", label: "TK B" },
  { key: "kb", label: "Kelompok Bermain (KB)" },
  { key: "sps_tpa", label: "SPS / TPA" },
];
const PKBM_PAKETS = [
  { key: "paketA", label: "Paket A (Setara SD)" },
  { key: "paketB", label: "Paket B (Setara SMP)" },
  { key: "paketC", label: "Paket C (Setara SMA)" },
];

export function SchoolDetailsModal({ school, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (isOpen) {
      setActiveTab("basic");
    }
  }, [isOpen]);

  if (!isOpen || !school) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-700 border-green-200";
      case "Data Belum Lengkap":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTotalAbk = () => {
    if (!school.siswaAbk) return 0;
    return Object.values(school.siswaAbk).reduce(
      (total, kelas) => total + (Number(kelas.l) || 0) + (Number(kelas.p) || 0),
      0
    );
  };

  const getTotalFacilities = () => {
    const prasarana = school.prasarana || {};
    let total = 0;
    total +=
      Number(prasarana.ruangKelas?.jumlah) ||
      Number(prasarana.ruangKelas?.total_room) ||
      0;
    total +=
      Number(prasarana.ruangPerpustakaan?.jumlah) ||
      Number(prasarana.ruangPerpustakaan?.total_all) ||
      0;
    total +=
      Number(prasarana.ruangLaboratorium?.jumlah) ||
      Number(prasarana.ruangLaboratorium?.total_all) ||
      0;
    total +=
      Number(prasarana.ruangGuru?.jumlah) ||
      Number(prasarana.ruangGuru?.total_all) ||
      0;
    total +=
      Number(prasarana.ruangUks?.jumlah) ||
      Number(prasarana.ruangUks?.total_all) ||
      0;
    total +=
      Number(prasarana.toiletGuruSiswa?.jumlah) ||
      Number(prasarana.toiletGuruSiswa?.total_all) ||
      0;
    total +=
      Number(prasarana.rumahDinas?.jumlah) ||
      Number(prasarana.rumahDinas?.total_all) ||
      0;
    return total;
  };

  const tabs = [
    {
      id: "basic",
      label: "Informasi Dasar",
      icon: <School className="h-4 w-4" />,
    },
    {
      id: "students",
      label: "Data Siswa",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "teachers",
      label: "Data Guru",
      icon: <UserCheck className="h-4 w-4" />,
    },
    {
      id: "facilities",
      label: "Prasarana",
      icon: <Building className="h-4 w-4" />,
    },
    {
      id: "institutional",
      label: "Kelembagaan",
      icon: <ClipboardList className="h-4 w-4" />,
    },
  ];

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-card-foreground mb-1">
              {school.namaSekolah}
            </h3>
            <p className="text-primary font-mono text-sm">{school.npsn}</p>
          </div>
          <Badge
            className={`rounded-full ${getStatusColor(school.dataStatus)}`}
          >
            {school.dataStatus || "Aktif"}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Kec. {school.kecamatan}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span>
              {school.jenjang || school.schoolType} - {school.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              Update:{" "}
              {school.lastUpdated || new Date().toLocaleDateString("id-ID")}
            </span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-card-foreground mb-3">Ringkasan Data</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              {school.siswa?.jumlahSiswa || 0}
            </p>
            <p className="text-xs text-blue-600">Total Siswa</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <GraduationCap className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">
              {school.guru?.jumlahGuru || 0}
            </p>
            <p className="text-xs text-green-600">Total Guru</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <Building className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              {getTotalFacilities()}
            </p>
            <p className="text-xs text-purple-600">Total Ruangan</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <UserPlus className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">
              {getTotalAbk()}
            </p>
            <p className="text-xs text-orange-600">Siswa ABK</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentsInfo = () => {
    const isSd = school.schoolType === "SD";
    const isSmp = school.schoolType === "SMP";
    const isPaud = school.schoolType === "PAUD" || school.schoolType === "TK";
    const isPkbm = school.schoolType === "PKBM";

    const renderHeader = (isSimpleView) => (
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            {isSimpleView ? "Kelompok Belajar" : "Kelas / Paket"}
          </th>
          {!isSimpleView && (
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
              Laki-laki
            </th>
          )}
          {!isSimpleView && (
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
              Perempuan
            </th>
          )}
          {!isSimpleView && (
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
              Total
            </th>
          )}
          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
            Rombel
          </th>
        </tr>
      </thead>
    );

    const renderRow = (label, data, rombel) => {
      if (!data) return null;
      const total = (data.l || 0) + (data.p || 0);
      if (total === 0 && (rombel === 0 || rombel === "")) return null;
      return (
        <tr key={label}>
          <td className="px-4 py-3 text-sm font-medium text-gray-900">
            {label}
          </td>
          <td className="px-4 py-3 text-sm text-center">{data.l || 0}</td>
          <td className="px-4 py-3 text-sm text-center">{data.p || 0}</td>
          <td className="px-4 py-3 text-sm text-center font-medium">{total}</td>
          <td className="px-4 py-3 text-sm text-center">{rombel || 0}</td>
        </tr>
      );
    };

    const renderSimpleRow = (label, rombelCount) => {
      if (!rombelCount) return null;
      return (
        <tr key={label}>
          <td className="px-4 py-3 text-sm font-medium">{label}</td>
          <td className="px-4 py-3 text-sm text-center font-bold">
            {rombelCount}
          </td>
        </tr>
      );
    };

    if (isPaud || isPkbm || isSmp) {
      return (
        <div className="space-y-6">
          <div>
            <h4 className="text-card-foreground mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" /> Total Siswa Keseluruhan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-800">
                  {school.siswa?.jumlahSiswa || 0}
                </p>
                <p className="text-xs text-blue-700">Total Siswa</p>
              </div>
              <div className="bg-gray-50 border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">
                  {school.st_male || 0}
                </p>
                <p className="text-xs text-gray-600">Laki-laki</p>
              </div>
              <div className="bg-gray-50 border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">
                  {school.st_female || 0}
                </p>
                <p className="text-xs text-gray-600">Perempuan</p>
              </div>
            </div>
          </div>
          {isPaud && (
            <div>
              <h4 className="text-card-foreground mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Rincian Rombongan Belajar
                (Rombel)
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                  {renderHeader(true)}
                  <tbody className="bg-white divide-y divide-gray-200">
                    {PAUD_ROMBEL_TYPES.map((type) =>
                      renderSimpleRow(type.label, school.rombel?.[type.key])
                    )}
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-2">
                  * Data L/P per kelompok belajar tidak tersedia di file sumber.
                </p>
              </div>
            </div>
          )}
          {(isPkbm || isSmp) && (
            <div className="text-center text-muted-foreground p-4 border rounded-lg bg-gray-50">
              <p>
                Data rincian siswa per kelas/paket tidak tersedia di file
                sumber.
              </p>
            </div>
          )}
        </div>
      );
    }

    // Tampilan default untuk SD
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-card-foreground mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" /> Siswa per Kelas
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
              {renderHeader(false)}
              <tbody className="bg-white divide-y divide-gray-200">
                {isSd &&
                  [1, 2, 3, 4, 5, 6].map((kelas) => {
                    const kelasKey = `kelas${kelas}`;
                    const siswaData = school.siswa?.[kelasKey];
                    const rombelData = school.rombel?.[kelasKey];
                    const totalSiswaKelas =
                      (siswaData?.l || 0) + (siswaData?.p || 0);
                    if (
                      totalSiswaKelas === 0 &&
                      (rombelData === 0 || !rombelData)
                    )
                      return null;
                    return (
                      <tr key={kelasKey}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{`Kelas ${kelas}`}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          {siswaData?.l || 0}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          {siswaData?.p || 0}
                        </td>
                        <td className="px-4 py-3 text-sm text-center font-medium">
                          {totalSiswaKelas}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          {rombelData || 0}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTeachersInfo = () => {
    const guru = school.guru || {};
    const guruData = [
      { label: "Jumlah Guru", value: guru.jumlahGuru },
      { label: "PNS", value: guru.pns },
      { label: "PPPK", value: guru.pppk },
      { label: "PPPK Paruh Waktu", value: guru.pppkParuhWaktu },
      { label: "Non ASN (Dapodik)", value: guru.nonAsnDapodik },
      { label: "Non ASN (Non-Dapodik)", value: guru.nonAsnTidakDapodik },
      { label: "Kekurangan Guru", value: guru.kekuranganGuru, highlight: true },
    ];
    return (
      <div>
        <h4 className="text-card-foreground mb-3 flex items-center gap-2">
          <UserCheck className="h-4 w-4" /> Rincian Data Guru
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {guruData.map((item) => (
            <div
              key={item.label}
              className={`bg-card border p-4 rounded-lg text-center ${
                item.highlight ? "bg-red-50 border-red-200" : ""
              }`}
            >
              <p
                className={`text-2xl font-bold ${
                  item.highlight ? "text-red-600" : "text-card-foreground"
                }`}
              >
                {item.value || 0}
              </p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFacilitiesInfo = () => {
    const prasarana = school.prasarana || {};
    const ruangan = [
      { title: "Ruang Kelas", data: prasarana.ruangKelas },
      { title: "Perpustakaan", data: prasarana.ruangPerpustakaan },
      { title: "Laboratorium", data: prasarana.ruangLaboratorium },
      { title: "Ruang Guru", data: prasarana.ruangGuru },
      { title: "UKS", data: prasarana.ruangUks },
      { title: "Toilet", data: prasarana.toiletGuruSiswa },
      { title: "Rumah Dinas", data: prasarana.rumahDinas },
    ];
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-card-foreground mb-3">Luas Area</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center border">
              <p className="text-xl font-bold text-gray-800">
                {prasarana.ukuran?.tanah || 0}
                <span className="text-sm font-normal"> m²</span>
              </p>
              <p className="text-xs text-gray-500">Luas Tanah</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border">
              <p className="text-xl font-bold text-gray-800">
                {prasarana.ukuran?.bangunan || 0}
                <span className="text-sm font-normal"> m²</span>
              </p>
              <p className="text-xs text-gray-500">Luas Bangunan</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border">
              <p className="text-xl font-bold text-gray-800">
                {prasarana.ukuran?.halaman || 0}
                <span className="text-sm font-normal"> m²</span>
              </p>
              <p className="text-xs text-gray-500">Luas Halaman</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-card-foreground mb-3">
            Kondisi Fasilitas Ruangan
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Jenis Ruang
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Baik
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Rusak Sedang
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Rusak Berat
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ruangan.map((item) => {
                  const data = item.data || {};
                  const total =
                    data.total_all || data.total || data.jumlah || 0;
                  if (total === 0) return null;
                  return (
                    <tr key={item.title}>
                      <td className="px-4 py-2 text-sm font-medium">
                        {item.title}
                      </td>
                      <td className="px-4 py-2 text-sm text-center font-bold">
                        {total}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-green-600">
                        {data.good || data.baik || 0}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-orange-600">
                        {data.moderate_damage || data.rusakSedang || 0}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-red-600">
                        {data.heavy_damage || data.rusakBerat || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderInstitutionalInfo = () => (
    <div>
      <p className="text-muted-foreground">
        Rincian data kelembagaan belum tersedia di file JSON.
      </p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        {school ? (
          <>
            <DialogHeader>
              <DialogTitle>Detail Informasi Sekolah</DialogTitle>
            </DialogHeader>
            <div className="border-b border-gray-200">
              <nav
                className="-mb-px flex space-x-4 overflow-x-auto"
                aria-label="Tabs"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-3 px-2 border-b-2 font-medium text-sm flex items-center gap-2`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex-grow overflow-y-auto p-1 pt-6 pr-3">
              {activeTab === "basic" && renderBasicInfo()}
              {activeTab === "students" && renderStudentsInfo()}
              {activeTab === "teachers" && renderTeachersInfo()}
              {activeTab === "facilities" && renderFacilitiesInfo()}
              {activeTab === "institutional" && renderInstitutionalInfo()}
            </div>
          </>
        ) : (
          <div className="text-center p-10">Memuat data...</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
