"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
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
  UserCheck
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

  // Calculate totals for ABK students
  const getTotalAbk = () => {
    if (!school.siswaAbk) return 0;
    let total = 0;
    Object.keys(school.siswaAbk).forEach(kelas => {
      if (school.siswaAbk[kelas]?.l !== undefined) {
        total += school.siswaAbk[kelas].l + school.siswaAbk[kelas].p;
      }
    });
    return total;
  };

  // Calculate total facilities
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
    { id: "basic", label: "Informasi Dasar", icon: <School className="h-4 w-4" /> },
    { id: "students", label: "Data Siswa", icon: <Users className="h-4 w-4" /> },
    { id: "teachers", label: "Data Guru", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "facilities", label: "Prasarana", icon: <Building className="h-4 w-4" /> },
    { id: "institutional", label: "Kelembagaan", icon: <ClipboardList className="h-4 w-4" /> },
  ];

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-muted/30 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl text-card-foreground mb-2">{school.namaSekolah}</h3>
            <p className="text-primary font-mono">{school.npsn}</p>
            <p className="text-sm text-muted-foreground mt-1">No. Urut: {school.noUrut}</p>
          </div>
          <Badge className={`rounded-full ${getStatusColor(school.dataStatus)}`}>
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
            <span className="text-sm">{school.schoolType} - {school.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Update: {school.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h4 className="text-card-foreground mb-3">Informasi Kontak</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-card border rounded-lg">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{school.email}</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-card border rounded-lg">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{school.phone}</span>
          </div>
        </div>
        <div className="mt-2 p-3 bg-card border rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-sm">{school.address}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h4 className="text-card-foreground mb-3">Ringkasan Data</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{school.siswa.jumlahSiswa}</p>
            <p className="text-xs text-blue-600">Total Siswa</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <GraduationCap className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{school.guru.jumlahGuru}</p>
            <p className="text-xs text-green-600">Total Guru</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <Building className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{getTotalFacilities()}</p>
            <p className="text-xs text-purple-600">Total Ruangan</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <UserPlus className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{getTotalAbk()}</p>
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
          <Users className="h-4 w-4" />
          Siswa Reguler per Kelas
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Laki-laki</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Perempuan</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rombel</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5, 6].map((kelas) => {
                const kelasKey = `kelas${kelas}`;
                const siswaData = school.siswa[kelasKey];
                const rombelData = school.rombel[kelasKey];
                const total = siswaData ? siswaData.l + siswaData.p : 0;
                
                if (total === 0 && school.schoolType === 'SMP' && kelas > 3) return null;
                if (total === 0 && (school.schoolType === 'SMA' || school.schoolType === 'SMK') && kelas > 3) return null;
                
                return (
                  <tr key={kelas}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Kelas {kelas}</td>
                    <td className="px-4 py-3 text-sm text-center">{siswaData?.l || 0}</td>
                    <td className="px-4 py-3 text-sm text-center">{siswaData?.p || 0}</td>
                    <td className="px-4 py-3 text-sm text-center font-medium">{total}</td>
                    <td className="px-4 py-3 text-sm text-center">{rombelData || 0}</td>
                  </tr>
                );
              })}
              <tr className="bg-blue-50">
                <td className="px-4 py-3 text-sm font-bold text-gray-900">TOTAL</td>
                <td className="px-4 py-3 text-sm font-bold text-center">
                  {Object.keys(school.siswa).reduce((total, key) => {
                    if (key !== 'jumlahSiswa' && school.siswa[key]?.l) {
                      return total + school.siswa[key].l;
                    }
                    return total;
                  }, 0)}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-center">
                  {Object.keys(school.siswa).reduce((total, key) => {
                    if (key !== 'jumlahSiswa' && school.siswa[key]?.p) {
                      return total + school.siswa[key].p;
                    }
                    return total;
                  }, 0)}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-center text-blue-600">
                  {school.siswa.jumlahSiswa}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-center">
                  {Object.keys(school.rombel).reduce((total, key) => {
                    return total + (school.rombel[key] || 0);
                  }, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Special Needs Students */}
      <div>
        <h4 className="text-card-foreground mb-3 flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Siswa Berkebutuhan Khusus (ABK)
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Laki-laki</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Perempuan</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5, 6].map((kelas) => {
                const kelasKey = `kelas${kelas}`;
                const abkData = school.siswaAbk[kelasKey];
                const total = abkData ? abkData.l + abkData.p : 0;
                
                if (total === 0 && school.schoolType === 'SMP' && kelas > 3) return null;
                if (total === 0 && (school.schoolType === 'SMA' || school.schoolType === 'SMK') && kelas > 3) return null;
                
                return (
                  <tr key={kelas}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Kelas {kelas}</td>
                    <td className="px-4 py-3 text-sm text-center">{abkData?.l || 0}</td>
                    <td className="px-4 py-3 text-sm text-center">{abkData?.p || 0}</td>
                    <td className="px-4 py-3 text-sm text-center font-medium">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Students Continuation */}
      {school.schoolType === 'SD' && (
        <div>
          <h4 className="text-card-foreground mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Siswa Melanjutkan Sekolah
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-medium text-green-800 mb-2">Dalam Kabupaten</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>SMP:</span>
                  <span className="font-medium">{school.siswaLanjutDalamKab.smp}</span>
                </div>
                <div className="flex justify-between">
                  <span>MTs:</span>
                  <span className="font-medium">{school.siswaLanjutDalamKab.mts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pontren:</span>
                  <span className="font-medium">{school.siswaLanjutDalamKab.pontren}</span>
                </div>
                <div className="flex justify-between">
                  <span>PKBM:</span>
                  <span className="font-medium">{school.siswaLanjutDalamKab.pkbm}</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-medium text-blue-800 mb-2">Luar Kabupaten</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>SMP:</span>
                  <span className="font-medium">{school.siswaLanjutLuarKab.smp}</span>
                </div>
                <div className="flex justify-between">
                  <span>MTs:</span>
                  <span className="font-medium">{school.siswaLanjutLuarKab.mts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pontren:</span>
                  <span className="font-medium">{school.siswaLanjutLuarKab.pontren}</span>
                </div>
                <div className="flex justify-between">
                  <span>PKBM:</span>
                  <span className="font-medium">{school.siswaLanjutLuarKab.pkbm}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-red-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-800">Siswa Tidak Melanjutkan:</span>
              <span className="font-bold text-red-600">{school.siswaTidakLanjut}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTeachersInfo = () => (
    <div className="space-y-6">
      {/* Teacher Statistics */}
      <div>
        <h4 className="text-card-foreground mb-3 flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          Komposisi Guru
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{school.guru.pns}</p>
            <p className="text-xs text-green-600">PNS</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{school.guru.pppk}</p>
            <p className="text-xs text-blue-600">PPPK</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{school.guru.pppkParuhWaktu}</p>
            <p className="text-xs text-purple-600">PPPK Paruh Waktu</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{school.guru.nonAsnDapodik + school.guru.nonAsnTidakDapodik}</p>
            <p className="text-xs text-orange-600">Non ASN</p>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div>
        <h4 className="text-card-foreground mb-3">Rincian Detail</h4>
        <div className="bg-card border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Guru:</span>
                <span className="text-lg font-bold text-primary">{school.guru.jumlahGuru}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">PNS:</span>
                <span className="font-medium">{school.guru.pns}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">PPPK:</span>
                <span className="font-medium">{school.guru.pppk}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">PPPK Paruh Waktu:</span>
                <span className="font-medium">{school.guru.pppkParuhWaktu}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Non ASN (Dapodik):</span>
                <span className="font-medium">{school.guru.nonAsnDapodik}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Non ASN (Non-Dapodik):</span>
                <span className="font-medium">{school.guru.nonAsnTidakDapodik}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-600">Kekurangan Guru:</span>
                <span className="font-bold text-red-600">{school.guru.kekuranganGuru}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFacilitiesInfo = () => (
    <div className="space-y-6">
      {/* Land Area */}
      <div>
        <h4 className="text-card-foreground mb-3 flex items-center gap-2">
          <Building className="h-4 w-4" />
          Luas Area
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{school.prasarana.ukuran.tanah}</p>
            <p className="text-xs text-green-600">m² Tanah</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{school.prasarana.ukuran.bangunan}</p>
            <p className="text-xs text-blue-600">m² Bangunan</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{school.prasarana.ukuran.halaman}</p>
            <p className="text-xs text-orange-600">m² Halaman</p>
          </div>
        </div>
      </div>

      {/* Room Facilities */}
      <div>
        <h4 className="text-card-foreground mb-3">Fasilitas Ruangan</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Ruang</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Baik</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rusak Sedang</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rusak Berat</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Ruang Kelas</td>
                <td className="px-4 py-3 text-sm text-center">{school.prasarana.ruangKelas.jumlah}</td>
                <td className="px-4 py-3 text-sm text-center text-green-600">{school.prasarana.ruangKelas.baik}</td>
                <td className="px-4 py-3 text-sm text-center text-yellow-600">{school.prasarana.ruangKelas.rusakSedang}</td>
                <td className="px-4 py-3 text-sm text-center text-red-600">{school.prasarana.ruangKelas.rusakBerat}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Perpustakaan</td>
                <td className="px-4 py-3 text-sm text-center">{school.prasarana.ruangPerpustakaan.jumlah}</td>
                <td className="px-4 py-3 text-sm text-center text-green-600">{school.prasarana.ruangPerpustakaan.baik}</td>
                <td className="px-4 py-3 text-sm text-center text-yellow-600">{school.prasarana.ruangPerpustakaan.rusakSedang}</td>
                <td className="px-4 py-3 text-sm text-center text-red-600">{school.prasarana.ruangPerpustakaan.rusakBerat}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Laboratorium</td>
                <td className="px-4 py-3 text-sm text-center">{school.prasarana.ruangLaboratorium.jumlah}</td>
                <td className="px-4 py-3 text-sm text-center text-green-600">{school.prasarana.ruangLaboratorium.baik}</td>
                <td className="px-4 py-3 text-sm text-center text-yellow-600">{school.prasarana.ruangLaboratorium.rusakSedang}</td>
                <td className="px-4 py-3 text-sm text-center text-red-600">{school.prasarana.ruangLaboratorium.rusakBerat}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Ruang Guru</td>
                <td className="px-4 py-3 text-sm text-center">{school.prasarana.ruangGuru.jumlah}</td>
                <td className="px-4 py-3 text-sm text-center text-green-600">{school.prasarana.ruangGuru.baik}</td>
                <td className="px-4 py-3 text-sm text-center text-yellow-600">{school.prasarana.ruangGuru.rusakSedang}</td>
                <td className="px-4 py-3 text-sm text-center text-red-600">{school.prasarana.ruangGuru.rusakBerat}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">UKS</td>
                <td className="px-4 py-3 text-sm text-center">{school.prasarana.ruangUks.jumlah}</td>
                <td className="px-4 py-3 text-sm text-center text-green-600">{school.prasarana.ruangUks.baik}</td>
                <td className="px-4 py-3 text-sm text-center text-yellow-600">{school.prasarana.ruangUks.rusakSedang}</td>
                <td className="px-4 py-3 text-sm text-center text-red-600">{school.prasarana.ruangUks.rusakBerat}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Toilet</td>
                <td className="px-4 py-3 text-sm text-center">{school.prasarana.toiletGuruSiswa.jumlah}</td>
                <td className="px-4 py-3 text-sm text-center text-green-600">{school.prasarana.toiletGuruSiswa.baik}</td>
                <td className="px-4 py-3 text-sm text-center text-yellow-600">{school.prasarana.toiletGuruSiswa.rusakSedang}</td>
                <td className="px-4 py-3 text-sm text-center text-red-600">{school.prasarana.toiletGuruSiswa.rusakBerat}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Furniture and Equipment */}
      <div>
        <h4 className="text-card-foreground mb-3">Mebeulair & Peralatan</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <h5 className="font-medium mb-2">Meja</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{school.prasarana.mebeulair.meja.jumlah}</span>
              </div>
              <div className="flex justify-between">
                <span>Baik:</span>
                <span className="text-green-600">{school.prasarana.mebeulair.meja.baik}</span>
              </div>
              <div className="flex justify-between">
                <span>Rusak:</span>
                <span className="text-red-600">{school.prasarana.mebeulair.meja.rusak}</span>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <h5 className="font-medium mb-2">Kursi</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{school.prasarana.mebeulair.kursi.jumlah}</span>
              </div>
              <div className="flex justify-between">
                <span>Baik:</span>
                <span className="text-green-600">{school.prasarana.mebeulair.kursi.baik}</span>
              </div>
              <div className="flex justify-between">
                <span>Rusak:</span>
                <span className="text-red-600">{school.prasarana.mebeulair.kursi.rusak}</span>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{school.prasarana.chromebook}</p>
            <p className="text-xs text-blue-600">Chromebook</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInstitutionalInfo = () => (
    <div className="space-y-6">
      {/* Institutional Status */}
      <div>
        <h4 className="text-card-foreground mb-3 flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          Status Kelembagaan
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <h5 className="font-medium mb-3">Kondisi Umum</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Peralatan Rumah Tangga:</span>
                <Badge variant="outline" className={school.kelembagaan.peralatanRumahTangga === 'Baik' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}>
                  {school.kelembagaan.peralatanRumahTangga}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Pembinaan:</span>
                <Badge variant="outline" className={school.kelembagaan.pembinaan === 'Sudah' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                  {school.kelembagaan.pembinaan}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Asesmen:</span>
                <Badge variant="outline" className={school.kelembagaan.asesmen === 'Sudah' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                  {school.kelembagaan.asesmen}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <h5 className="font-medium mb-3">Operasional</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Menyelenggarakan Belajar:</span>
                <Badge variant="outline" className={school.kelembagaan.menyelenggarakanBelajar === 'Ya' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                  {school.kelembagaan.menyelenggarakanBelajar}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Melaksanakan Rekomendasi:</span>
                <Badge variant="outline" className={school.kelembagaan.melaksanakanRekomendasi === 'Ya' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                  {school.kelembagaan.melaksanakanRekomendasi}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Siap Dievaluasi:</span>
                <Badge variant="outline" className={school.kelembagaan.siapDievaluasi === 'Ya' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                  {school.kelembagaan.siapDievaluasi}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOP Information */}
      <div>
        <h4 className="text-card-foreground mb-3">Bantuan Operasional Pendidikan (BOP)</h4>
        <div className="bg-card border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Pengelola:</label>
              <p className="text-sm mt-1">{school.kelembagaan.bop.pengelola || 'Tidak tersedia'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Tenaga Peningkatan:</label>
              <p className="text-sm mt-1">{school.kelembagaan.bop.tenagaPeningkatan || 'Tidak tersedia'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Information */}
      <div>
        <h4 className="text-card-foreground mb-3">Kurikulum</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <h5 className="font-medium mb-2">Silabus</h5>
            <p className="text-sm text-muted-foreground">{school.kelembagaan.kurikulum.silabus || 'Tidak tersedia'}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <h5 className="font-medium mb-2">Kompetensi Dasar</h5>
            <p className="text-sm text-muted-foreground">{school.kelembagaan.kurikulum.kompetensiDasar || 'Tidak tersedia'}</p>
          </div>
        </div>
      </div>

      {/* Licensing Information */}
      <div>
        <h4 className="text-card-foreground mb-3">Perizinan</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <label className="text-sm font-medium text-gray-600">Nomor Izin Operasional:</label>
            <p className="text-sm mt-1">{school.kelembagaan.perizinan.nomor || 'Tidak tersedia'}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <label className="text-sm font-medium text-gray-600">Tanggal Izin:</label>
            <p className="text-sm mt-1">{school.kelembagaan.perizinan.tanggal || 'Tidak tersedia'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Detail Informasi Sekolah</DialogTitle>
        </DialogHeader>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-1 pt-6 pr-3">
          {activeTab === 'basic' && renderBasicInfo()}
          {activeTab === 'students' && renderStudentsInfo()}
          {activeTab === 'teachers' && renderTeachersInfo()}
          {activeTab === 'facilities' && renderFacilitiesInfo()}
          {activeTab === 'institutional' && renderInstitutionalInfo()}
        </div>
      </DialogContent>
    </Dialog>
  );
}