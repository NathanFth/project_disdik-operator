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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { School, Search, Edit, Eye, Plus, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { SchoolDetailsModal } from "./SchoolDetailsModal";
import { EditSchoolModal } from "./EditSchoolModal";

// FUNGSI UTAMA: Menggabungkan dan mengubah data dari sd_new.json dan kecamatan.geojson
const transformAndFlattenData = (schoolData, kecamatanGeoJson, schoolType) => {
  if (!schoolData || typeof schoolData !== "object") {
    console.error("Format sd_new.json tidak valid.");
    return { allSchools: [], kecamatanList: [] };
  }

  const kecamatanMap = new Map();
  kecamatanGeoJson?.features?.forEach(feature => {
    const props = feature.properties;
    if (props && props.KECAMATAN) {
      kecamatanMap.set(props.KECAMATAN.toUpperCase(), props);
    }
  });

  const allSchools = Object.entries(schoolData).flatMap(
    ([kecamatanName, schoolsInKecamatan]) =>
      schoolsInKecamatan.map((school) => ({
        ...school,
        kecamatan: kecamatanName,
      }))
  );
  
  const kecamatanList = [...new Set(allSchools.map(s => s.kecamatan))].sort();

  const transformedSchools = allSchools.map((school, index) => {
    const noUrutStr = (index + 1).toString().padStart(3, "0");
    const jumlahSiswa = parseInt(school.student_count, 10) || 0;

    return {
      id: school.npsn,
      no: index + 1,
      noUrut: noUrutStr,
      noUrutSekolah: `${schoolType}${noUrutStr}`,
      kecamatan: school.kecamatan,
      npsn: school.npsn,
      namaSekolah: school.name,
      schoolType: schoolType,
      status: school.type,
      dataStatus: jumlahSiswa > 0 ? "Aktif" : "Data Belum Lengkap",
      dataStatusColor:
        jumlahSiswa > 0
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700",
      siswa: {
        jumlahSiswa: jumlahSiswa,
        kelas1: { l: parseInt(school.classes?.class_1?._L, 10) || 0, p: parseInt(school.classes?.class_1?._P, 10) || 0 },
        kelas2: { l: parseInt(school.classes?.class_2?._L, 10) || 0, p: parseInt(school.classes?.class_2?._P, 10) || 0 },
        kelas3: { l: parseInt(school.classes?.class_3?._L, 10) || 0, p: parseInt(school.classes?.class_3?._P, 10) || 0 },
        kelas4: { l: parseInt(school.classes?.class_4?._L, 10) || 0, p: parseInt(school.classes?.class_4?._P, 10) || 0 },
        kelas5: { l: parseInt(school.classes?.class_5?._L, 10) || 0, p: parseInt(school.classes?.class_5?._P, 10) || 0 },
        kelas6: { l: parseInt(school.classes?.class_6?._L, 10) || 0, p: parseInt(school.classes?.class_6?._P, 10) || 0 },
      },
      rombel: {
        kelas1: parseInt(school.rombel?.class_1, 10) || 0,
        kelas2: parseInt(school.rombel?.class_2, 10) || 0,
        kelas3: parseInt(school.rombel?.class_3, 10) || 0,
        kelas4: parseInt(school.rombel?.class_4, 10) || 0,
        kelas5: parseInt(school.rombel?.class_5, 10) || 0,
        kelas6: parseInt(school.rombel?.class_6, 10) || 0,
      },
      prasarana: {
        ukuran: {
          tanah: parseInt(school.facilities?.land_area, 10) || 0,
          bangunan: parseInt(school.facilities?.building_area, 10) || 0,
          halaman: 0,
        },
        ruangKelas: {
          jumlah: parseInt(school.class_condition?.total, 10) || 0,
          baik: parseInt(school.class_condition?.good, 10) || 0,
          rusakRingan: 0,
          rusakSedang: parseInt(school.class_condition?.moderate_damage, 10) || 0,
          rusakBerat: parseInt(school.class_condition?.heavy_damage, 10) || 0,
          rusakTotal: 0, lahan: "N/A", kelebihan: 0, kurangRkb: 0, rkbTambahan: 0,
        },
        ruangPerpustakaan: {
          jumlah: parseInt(school.library?.total, 10) || 0,
          baik: parseInt(school.library?.good, 10) || 0,
          rusakSedang: parseInt(school.library?.moderate_damage, 10) || 0,
          rusakBerat: parseInt(school.library?.heavy_damage, 10) || 0,
        },
        ruangLaboratorium: {
          jumlah: parseInt(school.laboratory?.total, 10) || 0,
          baik: parseInt(school.laboratory?.good, 10) || 0,
          rusakSedang: parseInt(school.laboratory?.moderate_damage, 10) || 0,
          rusakBerat: parseInt(school.laboratory?.heavy_damage, 10) || 0,
        },
        gedung: { jumlah: 0 },
        ruangGuru: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
        ruangUks: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
        toiletGuruSiswa: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
        rumahDinas: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
        mebeulair: { meja: { jumlah: 0, baik: 0, rusak: 0 }, kursi: { jumlah: 0, baik: 0, rusak: 0 }},
        chromebook: 0,
      },
      guru: {
        jumlahGuru: 0, pns: 0, pppk: 0, pppkParuhWaktu: 0, nonAsnDapodik: 0, nonAsnTidakDapodik: 0, kekuranganGuru: 0,
      },
      siswaAbk: {},
      siswaLanjutDalamKab: {},
      siswaLanjutLuarKab: {},
      siswaTidakLanjut: 0,
      kelembagaan: {},
      address: school.address,
      email: "N/A",
      phone: "N/A",
      lastUpdated: new Date().toISOString().split("T")[0],
    };
  });
  
  return { transformedSchools, kecamatanList };
};

export default function SchoolsTable({ operatorType }) {
  const [schoolsData, setSchoolsData] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  useEffect(() => {
    const fetchAllData = async () => {
      if (!operatorType) return;
      setIsLoading(true);

      try {
        const [schoolsResponse, kecamatanResponse] = await Promise.all([
          fetch("/data/sd_new.json").catch(e => { console.error("Gagal fetch sd_new.json:", e); return null; }),
          fetch("/data/kecamatan.geojson").catch(e => { console.error("Gagal fetch kecamatan.geojson:", e); return null; }),
        ]);

        if (!schoolsResponse || !schoolsResponse.ok) {
            throw new Error("Gagal memuat data sekolah (sd_new.json).");
        }

        const schoolsRawData = await schoolsResponse.json();
        const kecamatanRawData = kecamatanResponse && kecamatanResponse.ok ? await kecamatanResponse.json() : null;

        const { transformedSchools, kecamatanList } = transformAndFlattenData(
          schoolsRawData,
          kecamatanRawData,
          operatorType
        );
        
        setSchoolsData(transformedSchools);
        setKecamatanList(kecamatanList);

      } catch (error) {
        console.error(`Error memuat data:`, error);
        setSchoolsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (operatorType === "SD") {
      fetchAllData();
    } else {
      console.warn(`Tipe operator ${operatorType} belum diimplementasikan.`);
      setSchoolsData([]);
      setIsLoading(false);
    }
  }, [operatorType]);

  // --- FILTERING LOGIC ---
  const filteredSchools = useMemo(() => {
    let filtered = schoolsData;

    if (selectedKecamatan !== 'all') {
        filtered = filtered.filter(school => school.kecamatan === selectedKecamatan);
    }

    if (searchTerm) {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(
            (school) =>
            school.namaSekolah?.toLowerCase().includes(lowercasedSearchTerm) ||
            school.npsn?.includes(searchTerm)
        );
    }
    
    return filtered;
  }, [schoolsData, searchTerm, selectedKecamatan]);

  // --- PAGINATION LOGIC ---
  const paginatedSchools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSchools.slice(startIndex, endIndex);
  }, [filteredSchools, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedKecamatan, itemsPerPage]);

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

  const getTableTitle = () => `Data ${operatorType}`;
  const getSearchPlaceholder = () => `Cari nama sekolah atau NPSN...`;

  return (
    <>
      <Card className="rounded-xl shadow-sm border border-border/60">
        <CardHeader className="border-b border-border/60 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <School className="h-5 w-5 text-primary" />
              {getTableTitle()}
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
               <Select value={selectedKecamatan} onValueChange={setSelectedKecamatan}>
                <SelectTrigger className="w-full sm:w-[200px] rounded-lg bg-background">
                  <SelectValue placeholder="Semua Kecamatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kecamatan</SelectItem>
                  {kecamatanList.map(kec => (
                    <SelectItem key={kec} value={kec}>{kec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={getSearchPlaceholder()}
                  className="pl-10 rounded-lg w-full sm:w-64 bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Memuat data sekolah...</p>
            </div>
          ) : paginatedSchools.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <School className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="font-semibold mb-1">
                {searchTerm || selectedKecamatan !== 'all'
                  ? "Tidak ada hasil yang cocok"
                  : `Data ${operatorType} tidak ditemukan`}
              </p>
              <p className="text-sm">
                Coba ubah filter atau kata kunci pencarian Anda.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 pl-6">No.</TableHead>
                    <TableHead>Nama Sekolah</TableHead>
                    <TableHead>NPSN</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Jumlah Siswa</TableHead>
                    <TableHead className="w-32 pr-6 text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSchools.map((school, index) => (
                    <TableRow key={school.id} className="hover:bg-muted/50 even:bg-muted/20">
                      <TableCell className="font-medium pl-6">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>{school.namaSekolah}</div>
                        <div className="text-xs text-muted-foreground">{school.kecamatan}</div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{school.npsn}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-normal capitalize"
                        >
                          {school.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {school.siswa.jumlahSiswa}
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex gap-1 justify-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleViewDetails(school)} title="Lihat Detail">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleEditSchool(school)} title="Edit Data">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border/60">
                <div className="text-sm text-muted-foreground">
                    Menampilkan <strong>{paginatedSchools.length}</strong> dari <strong>{filteredSchools.length}</strong> data
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Baris per halaman:</span>
                        <Select
                            value={`${itemsPerPage}`}
                            onValueChange={(value) => {
                                setItemsPerPage(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px] bg-background">
                                <SelectValue placeholder={itemsPerPage} />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 25, 50, 100].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="text-sm font-medium">
                        Halaman {currentPage} dari {totalPages}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        )}

      </Card>

      <div className="mt-6 flex justify-end">
          <Button className="rounded-lg">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Data Sekolah
          </Button>
      </div>

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

