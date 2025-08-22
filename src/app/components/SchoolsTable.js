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
    district: "Garut",
    npsn: "20101234",
    name: "SDN 01 Garut",
    schoolType: "SD",
    status: "Aktif",
    statusColor: "bg-green-100 text-green-700",
    address: "Jl. Contoh No. 123, Garut",
    email: "sdn.01garut@education.go.id",
    phone: "0265-1234567",
    studentsCount: 485,
    teachersCount: 24,
    facilitiesCount: 15,
    lastUpdated: "2025-08-20",
  },
  {
    id: "2",
    no: 2,
    district: "Leuwigoong",
    npsn: "20105678",
    name: "SMPN 1 Leuwigoong",
    schoolType: "SMP",
    status: "Data Belum Lengkap",
    statusColor: "bg-yellow-100 text-yellow-700",
    address: "Jl. Contoh No. 45, Leuwigoong",
    email: "smpn.1leuwigoong@education.go.id",
    phone: "0265-2345678",
    studentsCount: 654,
    teachersCount: 32,
    facilitiesCount: 18,
    lastUpdated: "2025-08-19",
  },
  {
    id: "3",
    no: 3,
    district: "Leuwigoong",
    npsn: "20109012",
    name: "SMAN 10 Garut",
    schoolType: "SMA",
    status: "Aktif",
    statusColor: "bg-green-100 text-green-700",
    address: "Jl. Contoh No. 67, Leuwigoong",
    email: "sman10.garut@education.go.id",
    phone: "0265-3456789",
    studentsCount: 842,
    teachersCount: 45,
    facilitiesCount: 25,
    lastUpdated: "2025-08-18",
  },
  {
    id: "4",
    no: 4,
    district: "Banyuresmi",
    npsn: "20113456",
    name: "SMK Alghifari",
    schoolType: "SMK",
    status: "Sedang Ditinjau",
    statusColor: "bg-blue-100 text-blue-700",
    address: "Jl. Contoh No. 89, Banyuresmi",
    email: "smk.alghifari@education.go.id",
    phone: "0265-4567890",
    studentsCount: 756,
    teachersCount: 38,
    facilitiesCount: 22,
    lastUpdated: "2025-08-17",
  },
  {
    id: "5",
    no: 5,
    district: "Leuwigoong",
    npsn: "20117890",
    name: "TK Pelita Bangsa",
    schoolType: "TK",
    status: "Aktif",
    statusColor: "bg-green-100 text-green-700",
    address: "Jl. Contoh No. 12, Leuwigoong",
    email: "tk.pelitabangsa@education.go.id",
    phone: "0265-5678901",
    studentsCount: 156,
    teachersCount: 12,
    facilitiesCount: 8,
    lastUpdated: "2025-08-21",
  },
  {
    id: "6",
    no: 6,
    district: "Banyuresmi",
    npsn: "20121234",
    name: "PAUD Manbaul Ulum",
    schoolType: "PAUD",
    status: "Aktif",
    statusColor: "bg-green-100 text-green-700",
    address: "Jl. Contoh No. 34, Banyuresmi",
    email: "paud.manbaululum@education.go.id",
    phone: "0265-6789012",
    studentsCount: 95,
    teachersCount: 8,
    facilitiesCount: 6,
    lastUpdated: "2025-08-21",
  },
  {
    id: "7",
    no: 7,
    district: "Garut",
    npsn: "20125678",
    name: "PKBM Cerdas Mandiri",
    schoolType: "PKBM",
    status: "Aktif",
    statusColor: "bg-green-100 text-green-700",
    address: "Jl. Contoh No. 56, Garut",
    email: "pkbm.cerdasmandiri@education.go.id",
    phone: "0265-7890123",
    studentsCount: 234,
    teachersCount: 15,
    facilitiesCount: 10,
    lastUpdated: "2025-08-16",
  },
  {
    id: "8",
    no: 8,
    district: "Garut",
    npsn: "20129012",
    name: "TK Nurul Huda",
    schoolType: "TK",
    status: "Data Belum Lengkap",
    statusColor: "bg-yellow-100 text-yellow-700",
    address: "Jl. Contoh No. 78, Garut",
    email: "tk.nurulhuda@education.go.id",
    phone: "0265-8901234",
    studentsCount: 89,
    teachersCount: 6,
    facilitiesCount: 5,
    lastUpdated: "2025-08-17",
  },
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
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.npsn.includes(searchTerm) ||
        school.district.toLowerCase().includes(searchTerm.toLowerCase())
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
                          {school.district}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {school.npsn}
                        </TableCell>
                        <TableCell className="font-medium">
                          {school.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`rounded-full ${school.statusColor}`}
                          >
                            {school.status}
                          </Badge>
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
