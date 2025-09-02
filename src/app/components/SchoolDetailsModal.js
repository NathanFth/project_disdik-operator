// src/app/components/SchoolDetailsModal.js
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import {
  School,
  MapPin,
  Phone,
  Mail,
  Users,
  GraduationCap,
  Building,
  Calendar,
  BookOpen,
  UserPlus,
  ClipboardList,
  UserCheck,
} from "lucide-react";
import { useState } from "react";

export function SchoolDetailsModal({ school, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("basic");

  if (!school) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-700 border-green-200";
      case "Data Belum Lengkap":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Sedang Ditinjau":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Tidak Aktif":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTotalAbk = () => {
    if (!school.siswaAbk) return 0;
    return Object.values(school.siswaAbk).reduce(
      (total, kelas) => total + (kelas.l || 0) + (kelas.p || 0),
      0
    );
  };

  const getTotalFacilities = () => {
    const prasarana = school.prasarana || {};
    let total = 0;
    total += prasarana.ruangKelas?.jumlah || 0;
    total += prasarana.ruangPerpustakaan?.jumlah || 0;
    total += prasarana.ruangLaboratorium?.jumlah || 0;
    total += prasarana.ruangGuru?.jumlah || 0;
    total += prasarana.ruangUks?.jumlah || 0;
    total += prasarana.toiletGuruSiswa?.jumlah || 0;
    total += prasarana.rumahDinas?.jumlah || 0;
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
      {/* Header Info */}
      <div className="bg-muted/30 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl text-card-foreground mb-2">
              {school.namaSekolah}
            </h3>
            <p className="text-primary font-mono">{school.npsn}</p>
            <p className="text-sm text-muted-foreground mt-1">
              No. Urut: {school.noUrut}
            </p>
          </div>
          <Badge
            className={`rounded-full ${getStatusColor(school.dataStatus)}`}
          >
            {school.dataStatus}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Kecamatan {school.kecamatan}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {school.schoolType} - {school.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Update: {school.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h4 className="text-card-foreground mb-3">Ringkasan Data</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              {school.siswa.jumlahSiswa}
            </p>
            <p className="text-xs text-blue-600">Total Siswa</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <GraduationCap className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">
              {school.guru.jumlahGuru}
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

  const renderStudentsInfo = () => (
    <div className="space-y-6">
      {/* Regular Students by Class */}
      <div>
        <h4 className="text-card-foreground mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" /> Siswa Reguler per Kelas
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kelas
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Laki-laki
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Perempuan
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Rombel
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5, 6].map((kelas) => {
                const kelasKey = `kelas${kelas}`;
                const siswaData = school.siswa[kelasKey];
                const rombelData = school.rombel[kelasKey];
                if (!siswaData) return null; // Skip if data doesn't exist
                const total = siswaData.l + siswaData.p;
                if (
                  total === 0 &&
                  (school.schoolType === "SMP" ||
                    school.schoolType === "SMA" ||
                    school.schoolType === "SMK") &&
                  kelas > 3
                )
                  return null;
                return (
                  <tr key={kelas}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      Kelas {kelas}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {siswaData.l}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {siswaData.p}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-medium">
                      {total}
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

      {/* Special Needs Students */}
      <div>
        <h4 className="text-card-foreground mb-3 flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Siswa Berkebutuhan Khusus (ABK)
        </h4>
        {/* ... (kode ABK sudah benar) ... */}
      </div>

      {/* Students Continuation */}
      {school.schoolType === "SD" && (
        <div>{/* ... (kode siswa melanjutkan sudah benar) ... */}</div>
      )}
    </div>
  );

  const renderTeachersInfo = () => (
    // ... (kode data guru sudah benar) ...
    <div />
  );

  // --- UPDATED SECTION ---
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
      <div className="space-y-8">
        {/* Land Area */}
        <div>
          <h4 className="text-card-foreground mb-3 flex items-center gap-2">
            <Building className="h-4 w-4" /> Luas Area & Gedung
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-green-600">
                {prasarana.ukuran?.tanah || 0}
              </p>
              <p className="text-xs text-green-600">m² Tanah</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-blue-600">
                {prasarana.ukuran?.bangunan || 0}
              </p>
              <p className="text-xs text-blue-600">m² Bangunan</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-orange-600">
                {prasarana.ukuran?.halaman || 0}
              </p>
              <p className="text-xs text-orange-600">m² Halaman</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-purple-600">
                {prasarana.gedung?.jumlah || 0}
              </p>
              <p className="text-xs text-purple-600">Gedung</p>
            </div>
          </div>
        </div>

        {/* Room Facilities */}
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
                    Jumlah
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Baik
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Rusak Ringan
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Rusak Sedang
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Rusak Berat
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Rusak Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ruangan.map(
                  (item) =>
                    item.data && (
                      <tr key={item.title}>
                        <td className="px-4 py-2 text-sm font-medium">
                          {item.title}
                        </td>
                        <td className="px-4 py-2 text-sm text-center font-bold">
                          {item.data.jumlah || 0}
                        </td>
                        <td className="px-4 py-2 text-sm text-center text-green-600">
                          {item.data.baik || 0}
                        </td>
                        <td className="px-4 py-2 text-sm text-center text-yellow-600">
                          {item.data.rusakRingan || 0}
                        </td>
                        <td className="px-4 py-2 text-sm text-center text-orange-600">
                          {item.data.rusakSedang || 0}
                        </td>
                        <td className="px-4 py-2 text-sm text-center text-red-600">
                          {item.data.rusakBerat || 0}
                        </td>
                        <td className="px-4 py-2 text-sm text-center text-red-800">
                          {item.data.rusakTotal || 0}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RKB Details */}
        {prasarana.ruangKelas && (
          <div>
            <h4 className="text-card-foreground mb-3">
              Detail Ruang Kelas Baru (RKB)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border p-3 rounded-lg text-center">
                <p className="font-bold text-lg">
                  {prasarana.ruangKelas.kurangRkb || 0}
                </p>
                <p className="text-xs text-muted-foreground">Kekurangan RKB</p>
              </div>
              <div className="bg-card border p-3 rounded-lg text-center">
                <p className="font-bold text-lg">
                  {prasarana.ruangKelas.rkbTambahan || 0}
                </p>
                <p className="text-xs text-muted-foreground">RKB Tambahan</p>
              </div>
              <div className="bg-card border p-3 rounded-lg text-center">
                <p className="font-bold text-lg">
                  {prasarana.ruangKelas.kelebihan || 0}
                </p>
                <p className="text-xs text-muted-foreground">Kelebihan Ruang</p>
              </div>
              <div className="bg-card border p-3 rounded-lg text-center">
                <p className="font-bold text-lg">
                  {prasarana.ruangKelas.lahan || "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ketersediaan Lahan
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Furniture and Equipment */}
        {prasarana.mebeulair && (
          <div>
            <h4 className="text-card-foreground mb-3">Mebeulair & Peralatan</h4>
            {/* ... (kode mebeulair & chromebook sudah benar) ... */}
          </div>
        )}
      </div>
    );
  };

  // --- UPDATED SECTION ---
  const renderInstitutionalInfo = () => {
    const kelembagaan = school.kelembagaan || {};

    return (
      <div className="space-y-6">
        {/* Institutional Status */}
        <div>
          <h4 className="text-card-foreground mb-3 flex items-center gap-2">
            <ClipboardList className="h-4 w-4" /> Status Kelembagaan &
            Operasional
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Peralatan Rumah Tangga:</span>
                <Badge variant="outline">
                  {kelembagaan.peralatanRumahTangga}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Pembinaan:</span>
                <Badge variant="outline">{kelembagaan.pembinaan}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Asesmen:</span>
                <Badge variant="outline">{kelembagaan.asesmen}</Badge>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Menyelenggarakan Belajar:</span>
                <Badge variant="outline">
                  {kelembagaan.menyelenggarakanBelajar}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Melaksanakan Rekomendasi:</span>
                <Badge variant="outline">
                  {kelembagaan.melaksanakanRekomendasi}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Siap Dievaluasi:</span>
                <Badge variant="outline">{kelembagaan.siapDievaluasi}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* BOP, Licensing, Curriculum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BOP & Perizinan */}
          <div className="space-y-4">
            <div>
              <h4 className="text-card-foreground mb-2">
                Bantuan Operasional (BOP)
              </h4>
              <div className="bg-card border rounded-lg p-4 text-sm space-y-2">
                <p>
                  <span className="text-muted-foreground">Pengelola:</span>{" "}
                  {kelembagaan.bop?.pengelola || "-"}
                </p>
                <p>
                  <span className="text-muted-foreground">
                    Tenaga Peningkatan:
                  </span>{" "}
                  {kelembagaan.bop?.tenagaPeningkatan || "-"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-card-foreground mb-2">Perizinan</h4>
              <div className="bg-card border rounded-lg p-4 text-sm space-y-2">
                <p>
                  <span className="text-muted-foreground">Pengendalian:</span>{" "}
                  {kelembagaan.perizinan?.pengendalian || "-"}
                </p>
                <p>
                  <span className="text-muted-foreground">Kelayakan:</span>{" "}
                  {kelembagaan.perizinan?.kelayakan || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Kurikulum */}
          <div>
            <h4 className="text-card-foreground mb-2">Kurikulum</h4>
            <div className="bg-card border rounded-lg p-4 text-sm space-y-2">
              <p>
                <span className="text-muted-foreground">Silabus:</span>{" "}
                {kelembagaan.kurikulum?.silabus || "-"}
              </p>
              <p>
                <span className="text-muted-foreground">Kompetensi Dasar:</span>{" "}
                {kelembagaan.kurikulum?.kompetensiDasar || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Detail Informasi Sekolah</DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
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

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-1 pt-6 pr-3">
          {activeTab === "basic" && renderBasicInfo()}
          {activeTab === "students" && renderStudentsInfo()}
          {activeTab === "teachers" && renderTeachersInfo()}
          {activeTab === "facilities" && renderFacilitiesInfo()}
          {activeTab === "institutional" && renderInstitutionalInfo()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
