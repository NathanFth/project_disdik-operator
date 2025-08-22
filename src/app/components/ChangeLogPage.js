"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  History,
  Search,
  Filter,
  Download,
  RefreshCw,
  User,
  Plus,
  Edit,
  Trash2,
  Settings,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import { toast } from "sonner";

// Mock data dengan terjemahan Bahasa Indonesia
const mockChangeLogData = [
  {
    id: "1",
    timestamp: "2024-01-15 14:30:25",
    user: "Pengguna Admin",
    changeType: "Tambah",
    affectedItem: "SDN Merdeka 01",
    description: "Menambahkan sekolah baru dengan NPSN 20101234",
    details:
      "Informasi sekolah lengkap ditambahkan termasuk detail kontak dan alamat",
    severity: "low",
  },
  {
    id: "2",
    timestamp: "2024-01-15 13:45:12",
    user: "Operator 1",
    changeType: "Ubah",
    affectedItem: "SMP Kartini 15",
    description:
      "Memperbarui alamat sekolah dari 'Jl. Alamat Lama' menjadi 'Jl. Kartini No. 456'",
    details: "Kolom alamat diperbarui oleh operator",
    severity: "low",
  },
  {
    id: "3",
    timestamp: "2024-01-15 12:20:18",
    user: "Sistem",
    changeType: "Sistem",
    affectedItem: "Impor Data",
    description:
      "Impor massal selesai: 25 sekolah diproses, 23 berhasil, 2 gagal",
    details: "Proses sistem otomatis untuk impor data massal",
    severity: "medium",
  },
  {
    id: "4",
    timestamp: "2024-01-15 11:15:33",
    user: "Operator 2",
    changeType: "Hapus",
    affectedItem: "PAUD Sekolah Terhapus",
    description: "Menghapus sekolah dengan NPSN 20199999 (data ganda)",
    details:
      "Sekolah diidentifikasi sebagai duplikat dan dihapus setelah verifikasi",
    severity: "high",
  },
  {
    id: "5",
    timestamp: "2024-01-15 10:05:44",
    user: "Pengguna Admin",
    changeType: "Ubah",
    affectedItem: "SMK Teknologi 12",
    description:
      "Memperbarui status sekolah dari 'Dalam Tinjauan' menjadi 'Aktif'",
    details: "Status diubah setelah proses verifikasi selesai",
    severity: "medium",
  },
  {
    id: "6",
    timestamp: "2024-01-14 16:22:15",
    user: "Operator 1",
    changeType: "Tambah",
    affectedItem: "TK Pelita Bangsa",
    description: "Menambahkan TK baru dengan NPSN 20117890",
    details: "Pendaftaran sekolah baru diproses",
    severity: "low",
  },
  {
    id: "7",
    timestamp: "2024-01-14 15:18:27",
    user: "Sistem",
    changeType: "Sistem",
    affectedItem: "Pencadangan Database",
    description: "Pencadangan basis data harian berhasil diselesaikan",
    details: "Proses pencadangan harian otomatis",
    severity: "low",
  },
  {
    id: "8",
    timestamp: "2024-01-14 14:12:09",
    user: "Operator 3",
    changeType: "Ubah",
    affectedItem: "SMA Nusantara 03",
    description:
      "Memperbarui email kontak dari old@email.com ke sma.nusantara03@email.com",
    details: "Informasi kontak diperbarui sesuai permintaan sekolah",
    severity: "low",
  },
];

export default function ChangeLogPage() {
  const [changeLogData, setChangeLogData] = useState(mockChangeLogData);
  const [filteredData, setFilteredData] = useState(mockChangeLogData);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [changeTypeFilter, setChangeTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Unique users
  const uniqueUsers = Array.from(
    new Set(changeLogData.map((entry) => entry.user))
  );

  const applyFilters = () => {
    let filtered = changeLogData;

    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.affectedItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (userFilter !== "all") {
      filtered = filtered.filter((entry) => entry.user === userFilter);
    }

    if (changeTypeFilter !== "all") {
      filtered = filtered.filter(
        (entry) => entry.changeType === changeTypeFilter
      );
    }

    if (dateFrom) {
      filtered = filtered.filter((entry) => entry.timestamp >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(
        (entry) => entry.timestamp <= dateTo + " 23:59:59"
      );
    }

    setFilteredData(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setUserFilter("all");
    setChangeTypeFilter("all");
    setDateFrom("");
    setDateTo("");
    setFilteredData(changeLogData);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Catatan perubahan berhasil disegarkan");
    } catch (error) {
      toast.error("Gagal menyegarkan catatan perubahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      "Waktu,Pengguna,Tipe Perubahan,Item Terdampak,Deskripsi",
      ...filteredData.map(
        (entry) =>
          `"${entry.timestamp}","${entry.user}","${entry.changeType}","${entry.affectedItem}","${entry.description}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `catatan_perubahan_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Catatan perubahan berhasil diekspor!");
  };

  const getChangeTypeIcon = (type, severity) => {
    const iconClass =
      severity === "high"
        ? "text-red-600"
        : severity === "medium"
        ? "text-yellow-600"
        : "text-blue-600";

    switch (type) {
      case "Tambah":
        return <Plus className={`h-4 w-4 ${iconClass}`} />;
      case "Ubah":
        return <Edit className={`h-4 w-4 ${iconClass}`} />;
      case "Hapus":
        return <Trash2 className={`h-4 w-4 ${iconClass}`} />;
      case "Sistem":
        return <Settings className={`h-4 w-4 ${iconClass}`} />;
      default:
        return <Info className={`h-4 w-4 ${iconClass}`} />;
    }
  };

  const getChangeTypeBadge = (type) => {
    let colorClass = "";

    switch (type) {
      case "Tambah":
        colorClass = "bg-green-100 text-green-700 border-green-200";
        break;
      case "Ubah":
        colorClass = "bg-blue-100 text-blue-700 border-blue-200";
        break;
      case "Hapus":
        colorClass = "bg-red-100 text-red-700 border-red-200";
        break;
      case "Sistem":
        colorClass = "bg-purple-100 text-purple-700 border-purple-200";
        break;
      default:
        colorClass = "bg-gray-100 text-gray-700 border-gray-200";
    }

    return (
      <Badge variant="outline" className={`rounded-full border ${colorClass}`}>
        {type}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.replace(" ", "T"));
    return {
      date: date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, userFilter, changeTypeFilter, dateFrom, dateTo]);

  return (
    <div className="space-y-6">
      {/* Panel Filter */}
      <Card className="rounded-xl shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pencarian */}
          <div className="space-y-2">
            <Label htmlFor="search">Cari</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl"
                placeholder="Cari berdasarkan nama sekolah, NPSN, pengguna, atau deskripsi..."
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Baris Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Dari Tanggal</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">Sampai Tanggal</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userFilter">Pengguna</Label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Semua Pengguna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Pengguna</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="changeType">Tipe Perubahan</Label>
              <Select
                value={changeTypeFilter}
                onValueChange={setChangeTypeFilter}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Semua Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="Tambah">Tambah</SelectItem>
                  <SelectItem value="Ubah">Ubah</SelectItem>
                  <SelectItem value="Hapus">Hapus</SelectItem>
                  <SelectItem value="Sistem">Sistem</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="rounded-xl"
            >
              <X className="h-4 w-4 mr-2" />
              Hapus Filter
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="rounded-xl"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Segarkan
            </Button>
            <Button onClick={handleExport} className="rounded-xl">
              <Download className="h-4 w-4 mr-2" />
              Ekspor Log
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ringkasan Hasil */}
      {filteredData.length !== changeLogData.length && (
        <Alert className="rounded-xl">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Menampilkan {filteredData.length} dari {changeLogData.length} total
            entri log
          </AlertDescription>
        </Alert>
      )}

      {/* Tabel Catatan Perubahan */}
      <Card className="rounded-xl shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Catatan Perubahan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg text-card-foreground mb-2">
                Tidak ada log yang ditemukan
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ||
                userFilter !== "all" ||
                changeTypeFilter !== "all" ||
                dateFrom ||
                dateTo
                  ? "Coba sesuaikan filter Anda untuk melihat lebih banyak hasil."
                  : "Tidak ada entri catatan perubahan yang tersedia saat ini."}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-40">Waktu</TableHead>
                      <TableHead className="w-32">Pengguna</TableHead>
                      <TableHead className="w-24">Tipe</TableHead>
                      <TableHead>Item Terdampak</TableHead>
                      <TableHead>Deskripsi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((entry) => {
                      const timestamp = formatTimestamp(entry.timestamp);
                      return (
                        <TableRow key={entry.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono">
                            <div className="flex flex-col">
                              <span className="text-sm">{timestamp.date}</span>
                              <span className="text-xs text-muted-foreground">
                                {timestamp.time}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{entry.user}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getChangeTypeIcon(
                                entry.changeType,
                                entry.severity
                              )}
                              {getChangeTypeBadge(entry.changeType)}
                            </div>
                          </TableCell>
                          <TableCell>{entry.affectedItem}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{entry.description}</p>
                              {entry.details && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {entry.details}
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Placeholder Paginasi */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Menampilkan {filteredData.length} entri
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
                    Berikutnya
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
