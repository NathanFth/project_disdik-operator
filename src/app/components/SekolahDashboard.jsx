// components/SekolahDashboard.jsx
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
} from "lucide-react";

const SekolahDashboard = () => {
  const [sekolahData, setSekolahData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedSekolah, setSelectedSekolah] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Statistics state
  const [stats, setStats] = useState({
    totalSekolah: 0,
    totalSiswa: 0,
    totalGuru: 0,
    sekolahNegeri: 0,
    sekolahSwasta: 0,
  });

  // Load data sekolah
  useEffect(() => {
    fetchSekolahData();
  }, []);

  const fetchSekolahData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/sekolah");
      const result = await response.json();

      if (result.success) {
        setSekolahData(result.data);
        setFilteredData(result.data);
        calculateStats(result.data);
      } else {
        console.error("Error fetching data:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (data) => {
    const stats = {
      totalSekolah: data.length,
      totalSiswa: data.reduce(
        (sum, sekolah) => sum + (sekolah.total_siswa || 0),
        0
      ),
      totalGuru: data.reduce(
        (sum, sekolah) => sum + (sekolah.jumlah_guru || 0),
        0
      ),
      sekolahNegeri: data.filter((sekolah) => sekolah.status_sekolah_id === 1)
        .length,
      sekolahSwasta: data.filter((sekolah) => sekolah.status_sekolah_id === 2)
        .length,
    };
    setStats(stats);
  };

  // Filter data based on search and filters
  useEffect(() => {
    let filtered = sekolahData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (sekolah) =>
          sekolah.nama_sekolah
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          sekolah.npsn.includes(searchTerm) ||
          sekolah.nama_kecamatan
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Kecamatan filter
    if (selectedKecamatan) {
      filtered = filtered.filter(
        (sekolah) => sekolah.kecamatan_id?.toString() === selectedKecamatan
      );
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(
        (sekolah) => sekolah.status_sekolah_id?.toString() === selectedStatus
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedKecamatan, selectedStatus, sekolahData]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle detail modal
  const showDetail = (sekolah) => {
    setSelectedSekolah(sekolah);
    setShowDetailModal(true);
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      // Header
      [
        "NPSN",
        "Nama Sekolah",
        "Kecamatan",
        "Status",
        "Total Siswa",
        "Jumlah Guru",
        "Jumlah Rombel",
      ].join(","),
      // Data rows
      ...filteredData.map((sekolah) =>
        [
          sekolah.npsn,
          sekolah.nama_sekolah,
          sekolah.nama_kecamatan,
          sekolah.status_sekolah_nama,
          sekolah.total_siswa || 0,
          sekolah.jumlah_guru || 0,
          sekolah.jumlah_rombel || 0,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data_sekolah_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Sekolah
          </h1>
          <p className="text-gray-600 mt-2">
            Manajemen data sekolah se-Kota Bandung
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => (window.location.href = "/sekolah/form")}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Sekolah
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Sekolah
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalSekolah}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">🏫</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalSiswa.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Guru</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalGuru.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">👨‍🏫</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Sekolah Negeri
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.sekolahNegeri}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">🏛️</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Sekolah Swasta
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.sekolahSwasta}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl">🏢</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari sekolah, NPSN, atau kecamatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select
                value={selectedKecamatan}
                onValueChange={setSelectedKecamatan}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kecamatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Kecamatan</SelectItem>
                  <SelectItem value="1">Bandung Wetan</SelectItem>
                  <SelectItem value="2">Bandung Kulon</SelectItem>
                  <SelectItem value="3">Bojongloa Kaler</SelectItem>
                  <SelectItem value="4">Bojongloa Kidul</SelectItem>
                  <SelectItem value="5">Astana Anyar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Status</SelectItem>
                  <SelectItem value="1">Negeri</SelectItem>
                  <SelectItem value="2">Swasta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedKecamatan("");
                  setSelectedStatus("");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Data Sekolah ({filteredData.length} dari {sekolahData.length}{" "}
            sekolah)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">No</th>
                  <th className="text-left p-4 font-semibold">NPSN</th>
                  <th className="text-left p-4 font-semibold">Nama Sekolah</th>
                  <th className="text-left p-4 font-semibold">Kecamatan</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Total Siswa</th>
                  <th className="text-left p-4 font-semibold">Guru</th>
                  <th className="text-left p-4 font-semibold">Rombel</th>
                  <th className="text-left p-4 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((sekolah, index) => (
                  <tr key={sekolah.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{indexOfFirstItem + index + 1}</td>
                    <td className="p-4 font-mono text-sm">{sekolah.npsn}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{sekolah.nama_sekolah}</p>
                        <p className="text-sm text-gray-500">
                          No. Urut: {sekolah.no_urut}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">{sekolah.nama_kecamatan || "-"}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          sekolah.status_sekolah_id === 1
                            ? "default"
                            : "secondary"
                        }
                      >
                        {sekolah.status_sekolah_nama}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      {sekolah.total_siswa || 0}
                    </td>
                    <td className="p-4 text-center">
                      {sekolah.jumlah_guru || 0}
                    </td>
                    <td className="p-4 text-center">
                      {sekolah.jumlah_rombel || 0}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => showDetail(sekolah)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            (window.location.href = `/sekolah/edit/${sekolah.id}`)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            if (
                              confirm(
                                "Apakah Anda yakin ingin menghapus data sekolah ini?"
                              )
                            ) {
                              // Implement delete function
                              console.log("Delete sekolah:", sekolah.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Menampilkan {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredData.length)} dari{" "}
              {filteredData.length} data
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNumber = currentPage - 2 + i;
                if (pageNumber > 0 && pageNumber <= totalPages) {
                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        pageNumber === currentPage ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                }
                return null;
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Sekolah</DialogTitle>
          </DialogHeader>
          {selectedSekolah && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    Identitas Sekolah
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>NPSN:</strong> {selectedSekolah.npsn}
                    </p>
                    <p>
                      <strong>Nama:</strong> {selectedSekolah.nama_sekolah}
                    </p>
                    <p>
                      <strong>Kecamatan:</strong>{" "}
                      {selectedSekolah.nama_kecamatan}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {selectedSekolah.status_sekolah_nama}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Ringkasan</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Total Siswa:</strong>{" "}
                      {selectedSekolah.total_siswa || 0}
                    </p>
                    <p>
                      <strong>Jumlah Guru:</strong>{" "}
                      {selectedSekolah.jumlah_guru || 0}
                    </p>
                    <p>
                      <strong>Jumlah Rombel:</strong>{" "}
                      {selectedSekolah.jumlah_rombel || 0}
                    </p>
                    <p>
                      <strong>Ruang Kelas:</strong>{" "}
                      {selectedSekolah.ruang_kelas_jumlah || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Data */}
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Data Siswa per Kelas
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  {[1, 2, 3, 4, 5, 6].map((kelas) => (
                    <div
                      key={kelas}
                      className="text-center p-3 bg-gray-50 rounded"
                    >
                      <p className="font-medium">Kelas {kelas}</p>
                      <p>L: {selectedSekolah[`siswa_kelas${kelas}_l`] || 0}</p>
                      <p>P: {selectedSekolah[`siswa_kelas${kelas}_p`] || 0}</p>
                      <p className="font-semibold">
                        Total:{" "}
                        {(selectedSekolah[`siswa_kelas${kelas}_l`] || 0) +
                          (selectedSekolah[`siswa_kelas${kelas}_p`] || 0)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities Summary */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Fasilitas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <p>
                      <strong>Ruang Kelas:</strong>{" "}
                      {selectedSekolah.ruang_kelas_jumlah || 0} (Baik:{" "}
                      {selectedSekolah.ruang_kelas_baik || 0})
                    </p>
                    <p>
                      <strong>Perpustakaan:</strong>{" "}
                      {selectedSekolah.perpustakaan_jumlah || 0} (Baik:{" "}
                      {selectedSekolah.perpustakaan_baik || 0})
                    </p>
                    <p>
                      <strong>Laboratorium:</strong>{" "}
                      {selectedSekolah.laboratorium_jumlah || 0} (Baik:{" "}
                      {selectedSekolah.laboratorium_baik || 0})
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <strong>Ruang Guru:</strong>{" "}
                      {selectedSekolah.ruang_guru_jumlah || 0} (Baik:{" "}
                      {selectedSekolah.ruang_guru_baik || 0})
                    </p>
                    <p>
                      <strong>Ruang UKS:</strong>{" "}
                      {selectedSekolah.ruang_uks_jumlah || 0} (Baik:{" "}
                      {selectedSekolah.ruang_uks_baik || 0})
                    </p>
                    <p>
                      <strong>Toilet:</strong>{" "}
                      {selectedSekolah.toilet_jumlah || 0} (Baik:{" "}
                      {selectedSekolah.toilet_baik || 0})
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <strong>Meja:</strong> {selectedSekolah.meja_jumlah || 0}{" "}
                      (Baik: {selectedSekolah.meja_baik || 0})
                    </p>
                    <p>
                      <strong>Kursi:</strong>{" "}
                      {selectedSekolah.kursi_jumlah || 0} (Baik:{" "}
                      {selectedSekolah.kursi_baik || 0})
                    </p>
                    <p>
                      <strong>Chromebook:</strong>{" "}
                      {selectedSekolah.jumlah_chromebook || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Teacher Data */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Data Guru</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <p className="font-medium">PNS</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedSekolah.guru_pns || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="font-medium">PPPK</p>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedSekolah.guru_pppk || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded">
                    <p className="font-medium">Non ASN</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedSekolah.guru_non_asn || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="font-medium">Total</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {selectedSekolah.jumlah_guru || 0}
                    </p>
                  </div>
                </div>
                {selectedSekolah.keterangan_guru && (
                  <div className="mt-4">
                    <p className="font-medium mb-2">Keterangan:</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">
                      {selectedSekolah.keterangan_guru}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SekolahDashboard;
