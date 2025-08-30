// src/components/SchoolsTable.js

"use client";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { School, Search, Edit, Eye, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { SchoolDetailsModal } from "./SchoolDetailsModal";
import { EditSchoolModal } from "./EditSchoolModal";

const initialSchoolsData = [
  {
    id: "1",
    no: 1,
    // Basic Info
    noUrut: "001",
    noUrutSekolah: "SD001",
    kecamatan: "Garut",
    npsn: "20101234",
    namaSekolah: "SDN 01 Garut",
    schoolType: "SD",
    status: "Negeri",
    dataStatus: "Aktif",
    dataStatusColor: "bg-green-100 text-green-700",
    
    // Siswa
    siswa: {
      jumlahSiswa: 485,
      kelas1: { l: 45, p: 40 },
      kelas2: { l: 42, p: 38 },
      kelas3: { l: 40, p: 42 },
      kelas4: { l: 38, p: 40 },
      kelas5: { l: 35, p: 37 },
      kelas6: { l: 33, p: 35 },
    },
    
    // Siswa Berkebutuhan Khusus
    siswaAbk: {
      kelas1: { l: 2, p: 1 },
      kelas2: { l: 1, p: 2 },
      kelas3: { l: 0, p: 1 },
      kelas4: { l: 1, p: 0 },
      kelas5: { l: 0, p: 1 },
      kelas6: { l: 1, p: 0 },
    },
    
    // Siswa Melanjutkan
    siswaLanjutDalamKab: {
      smp: 25,
      mts: 8,
      pontren: 2,
      pkbm: 0,
    },
    siswaLanjutLuarKab: {
      smp: 3,
      mts: 1,
      pontren: 0,
      pkbm: 0,
    },
    siswaTidakLanjut: 1,
    
    // Rombel
    rombel: {
      kelas1: 3,
      kelas2: 3,
      kelas3: 3,
      kelas4: 3,
      kelas5: 2,
      kelas6: 2,
    },
    
    // Prasarana
    prasarana: {
      ukuran: {
        tanah: 2500,
        bangunan: 800,
        halaman: 1200,
      },
      gedung: {
        jumlah: 2,
      },
      ruangKelas: {
        jumlah: 16,
        baik: 14,
        rusakRingan: 2,
        rusakSedang: 0,
        rusakBerat: 0,
        rusakTotal: 0,
        kelebihan: 0,
        kurangRkb: 0,
        rkbTambahan: 0,
        lahan: "Ada",
      },
      ruangPerpustakaan: {
        jumlah: 1,
        baik: 1,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      ruangLaboratorium: {
        jumlah: 1,
        baik: 1,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      ruangGuru: {
        jumlah: 1,
        baik: 1,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      ruangUks: {
        jumlah: 1,
        baik: 1,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      toiletGuruSiswa: {
        jumlah: 4,
        baik: 4,
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
        meja: { jumlah: 250, baik: 240, rusak: 10 },
        kursi: { jumlah: 500, baik: 485, rusak: 15 },
      },
      chromebook: 25,
    },
    
    // Kelembagaan
    kelembagaan: {
      peralatanRumahTangga: "Baik",
      pembinaan: "Sudah",
      asesmen: "Sudah",
      bop: {
        pengelola: "Kepala Sekolah",
        tenagaPeningkatan: "Guru Senior",
      },
      menyelenggarakanBelajar: "Ya",
      melaksanakanRekomendasi: "Ya",
      siapDievaluasi: "Ya",
      perizinan: {
        pengendalian: "Lengkap",
        kelayakan: "Sesuai",
      },
      kurikulum: {
        silabus: "Kurikulum Merdeka",
        kompetensiDasar: "Sesuai Standar",
      },
    },
    
    // Guru
    guru: {
      jumlahGuru: 24,
      pns: 18,
      pppk: 4,
      pppkParuhWaktu: 0,
      nonAsnDapodik: 2,
      nonAsnTidakDapodik: 0,
      kekuranganGuru: 2,
    },
    
    // Metadata
    address: "Jl. Contoh No. 123, Garut",
    email: "sdn.01garut@education.go.id",
    phone: "0265-1234567",
    lastUpdated: "2025-08-20",
  },
  {
    id: "2",
    no: 2,
    noUrut: "002",
    noUrutSekolah: "SMP001",
    kecamatan: "Leuwigoong",
    npsn: "20105678",
    namaSekolah: "SMPN 1 Leuwigoong",
    schoolType: "SMP",
    status: "Negeri",
    dataStatus: "Data Belum Lengkap",
    dataStatusColor: "bg-yellow-100 text-yellow-700",
    
    siswa: {
      jumlahSiswa: 654,
      kelas1: { l: 110, p: 108 },
      kelas2: { l: 105, p: 112 },
      kelas3: { l: 108, p: 111 },
      kelas4: { l: 0, p: 0 },
      kelas5: { l: 0, p: 0 },
      kelas6: { l: 0, p: 0 },
    },
    
    siswaAbk: {
      kelas1: { l: 3, p: 2 },
      kelas2: { l: 2, p: 1 },
      kelas3: { l: 1, p: 2 },
      kelas4: { l: 0, p: 0 },
      kelas5: { l: 0, p: 0 },
      kelas6: { l: 0, p: 0 },
    },
    
    siswaLanjutDalamKab: {
      smp: 0, // SMP tidak relevan
      mts: 0,
      pontren: 15,
      pkbm: 2,
    },
    siswaLanjutLuarKab: {
      smp: 0,
      mts: 0,
      pontren: 5,
      pkbm: 0,
    },
    siswaTidakLanjut: 3,
    
    rombel: {
      kelas1: 7,
      kelas2: 7,
      kelas3: 7,
      kelas4: 0,
      kelas5: 0,
      kelas6: 0,
    },
    
    prasarana: {
      ukuran: {
        tanah: 4000,
        bangunan: 1200,
        halaman: 2000,
      },
      gedung: {
        jumlah: 3,
      },
      ruangKelas: {
        jumlah: 21,
        baik: 18,
        rusakRingan: 2,
        rusakSedang: 1,
        rusakBerat: 0,
        rusakTotal: 0,
        kelebihan: 0,
        kurangRkb: 0,
        rkbTambahan: 0,
        lahan: "Ada",
      },
      ruangPerpustakaan: {
        jumlah: 1,
        baik: 1,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      ruangLaboratorium: {
        jumlah: 2,
        baik: 2,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      ruangGuru: {
        jumlah: 1,
        baik: 1,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      ruangUks: {
        jumlah: 1,
        baik: 1,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      toiletGuruSiswa: {
        jumlah: 6,
        baik: 5,
        rusakSedang: 1,
        rusakBerat: 0,
      },
      rumahDinas: {
        jumlah: 1,
        baik: 1,
        rusakSedang: 0,
        rusakBerat: 0,
      },
      mebeulair: {
        meja: { jumlah: 350, baik: 320, rusak: 30 },
        kursi: { jumlah: 700, baik: 650, rusak: 50 },
      },
      chromebook: 40,
    },
    
    kelembagaan: {
      peralatanRumahTangga: "Perlu Rehabilitasi",
      pembinaan: "Belum",
      asesmen: "Belum",
      bop: {
        pengelola: "Kepala Sekolah",
        tenagaPeningkatan: "Wakil Kepala",
      },
      menyelenggarakanBelajar: "Ya",
      melaksanakanRekomendasi: "Tidak",
      siapDievaluasi: "Tidak",
      perizinan: {
        pengendalian: "Sedang Proses",
        kelayakan: "Perlu Perbaikan",
      },
      kurikulum: {
        silabus: "Kurikulum 2013",
        kompetensiDasar: "Perlu Update",
      },
    },
    
    guru: {
      jumlahGuru: 32,
      pns: 22,
      pppk: 6,
      pppkParuhWaktu: 2,
      nonAsnDapodik: 2,
      nonAsnTidakDapodik: 0,
      kekuranganGuru: 5,
    },
    
    address: "Jl. Contoh No. 45, Leuwigoong",
    email: "smpn.1leuwigoong@education.go.id",
    phone: "0265-2345678",
    lastUpdated: "2025-08-19",
  }
];

export default function SchoolsTable({ operatorType }) {
  const [schoolsData, setSchoolsData] = useState(initialSchoolsData);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter schools based on operator type - operator hanya melihat data sesuai bidangnya
  const filteredByOperatorType = useMemo(() => {
    return schoolsData.filter((school) => school.schoolType === operatorType);
  }, [schoolsData, operatorType]);

  // Further filter by search term
  const filteredSchools = useMemo(() => {
    return filteredByOperatorType.filter(
      (school) =>
        school.namaSekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.npsn.includes(searchTerm) ||
        school.kecamatan.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredByOperatorType, searchTerm]);

  const handleViewDetails = (school) => {
    setSelectedSchool(school);
    setIsDetailsModalOpen(true);
  };

  const handleEditSchool = (school) => {
    setSelectedSchool(school);
    setIsEditModalOpen(true);
  };

  const handleSaveSchool = (updatedSchool) => {
    setSchoolsData((prevData) =>
      prevData.map((school) =>
        school.id === updatedSchool.id ? updatedSchool : school
      )
    );
  };

  // Get table title based on operator type
  const getTableTitle = () => {
    switch (operatorType) {
      case "PAUD":
        return "Data PAUD";
      case "TK":
        return "Data TK";
      case "SD":
        return "Data SD";
      case "SMP":
        return "Data SMP";
      case "PKBM":
        return "Data PKBM";
      default:
        return "Data Sekolah";
    }
  };

  // Get placeholder text based on operator type
  const getSearchPlaceholder = () => {
    switch (operatorType) {
      case "PAUD":
        return "Cari PAUD...";
      case "TK":
        return "Cari TK...";
      case "SD":
        return "Cari SD...";
      case "SMP":
        return "Cari SMP...";
      case "PKBM":
        return "Cari PKBM...";
      default:
        return "Cari sekolah...";
    }
  };

  return (
    <>
      <Card className="rounded-xl shadow-sm border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5 text-primary" />
              {getTableTitle()}
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={getSearchPlaceholder()}
                  className="pl-10 rounded-xl border-border/50 bg-input-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Tombol tambah data untuk operator */}
              <Button className="rounded-xl whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Data {operatorType}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSchools.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <School className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">
                {searchTerm
                  ? "Tidak ada hasil pencarian"
                  : `Belum ada data ${operatorType}`}
              </p>
              <p className="text-sm">
                {searchTerm
                  ? "Coba gunakan kata kunci lain"
                  : `Tambahkan data ${operatorType} pertama Anda`}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-16">No.</TableHead>
                      <TableHead>Kecamatan</TableHead>
                      <TableHead>NPSN</TableHead>
                      <TableHead>Nama {operatorType}</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Jumlah Siswa</TableHead>
                      <TableHead>Jumlah Guru</TableHead>
                      <TableHead className="w-32">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchools.map((school, index) => (
                      <TableRow key={school.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {school.kecamatan}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {school.npsn}
                        </TableCell>
                        <TableCell className="font-medium">
                          {school.namaSekolah}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`rounded-full ${school.dataStatusColor}`}
                          >
                            {school.dataStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {school.siswa.jumlahSiswa}
                        </TableCell>
                        <TableCell className="text-center">
                          {school.guru.jumlahGuru}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg"
                              onClick={() => handleViewDetails(school)}
                              title="Lihat Detail"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {/* Operator bisa edit semua data sesuai bidangnya */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg"
                              onClick={() => handleEditSchool(school)}
                              title="Edit Data"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Menampilkan {filteredSchools.length} dari{" "}
                  {filteredByOperatorType.length} data {operatorType}
                  {searchTerm && ` (pencarian: "${searchTerm}")`}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg bg-primary text-primary-foreground"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Selanjutnya
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <SchoolDetailsModal
        school={selectedSchool}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedSchool(null);
        }}
      />

      <EditSchoolModal
        school={selectedSchool}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSchool(null);
        }}
        onSave={handleSaveSchool}
      />
    </>
  );
}