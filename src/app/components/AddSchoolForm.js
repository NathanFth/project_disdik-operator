"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
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
import { Textarea } from "./ui/textarea";
import { Save, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AddSchoolForm() {
  const [formData, setFormData] = useState({
    district: "",
    npsn: "",
    schoolName: "",
    schoolType: "",
    address: "",
    status: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.district) newErrors.district = "Kecamatan wajib diisi";
    if (!formData.npsn) newErrors.npsn = "NPSN wajib diisi";
    if (!formData.schoolName) newErrors.schoolName = "Nama sekolah wajib diisi";
    if (!formData.schoolType)
      newErrors.schoolType = "Jenis sekolah wajib diisi";
    if (!formData.address) newErrors.address = "Alamat wajib diisi";
    if (!formData.status) newErrors.status = "Status wajib diisi";

    if (formData.npsn && !/^\d{8}$/.test(formData.npsn)) {
      newErrors.npsn = "NPSN harus 8 digit angka";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Masukkan alamat email yang valid";
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Masukkan nomor telepon yang valid (10-15 digit)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Periksa kembali data yang diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Sekolah berhasil ditambahkan!");
      setHasUnsavedChanges(false);

      setFormData({
        district: "",
        npsn: "",
        schoolName: "",
        schoolType: "",
        address: "",
        status: "",
        email: "",
        phone: "",
        notes: "",
      });
    } catch (error) {
      toast.error("Gagal menambahkan sekolah. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("Perubahan belum disimpan. Yakin batal?")) {
        setFormData({
          district: "",
          npsn: "",
          schoolName: "",
          schoolType: "",
          address: "",
          status: "",
          email: "",
          phone: "",
          notes: "",
        });
        setHasUnsavedChanges(false);
        setErrors({});
      }
    }
  };

  return (
    <Card className="rounded-xl shadow-lg border-border/50 max-w-9xl mx-auto">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informasi Dasar */}
          <div className="space-y-6">
            <h3 className="text-lg text-card-foreground border-l-4 border-primary pl-4">
              Informasi Dasar
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="district" className="text-card-foreground">
                  Kecamatan <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) =>
                    handleInputChange("district", value)
                  }
                >
                  <SelectTrigger
                    className={`rounded-xl h-12 ${
                      errors.district
                        ? "border-destructive"
                        : "border-border/50"
                    }`}
                  >
                    <SelectValue placeholder="Pilih kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pusat">Pusat</SelectItem>
                    <SelectItem value="Utara">Utara</SelectItem>
                    <SelectItem value="Selatan">Selatan</SelectItem>
                    <SelectItem value="Timur">Timur</SelectItem>
                    <SelectItem value="Barat">Barat</SelectItem>
                  </SelectContent>
                </Select>
                {errors.district && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.district}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="npsn" className="text-card-foreground">
                  NPSN <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="npsn"
                  value={formData.npsn}
                  onChange={(e) =>
                    handleInputChange(
                      "npsn",
                      e.target.value.replace(/\D/g, "").slice(0, 8)
                    )
                  }
                  className={`rounded-xl h-12 ${
                    errors.npsn ? "border-destructive" : "border-border/50"
                  }`}
                  placeholder="Masukkan 8 digit NPSN"
                  maxLength={8}
                />
                {errors.npsn && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.npsn}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolName" className="text-card-foreground">
                Nama Sekolah <span className="text-destructive">*</span>
              </Label>
              <Input
                id="schoolName"
                value={formData.schoolName}
                onChange={(e) =>
                  handleInputChange("schoolName", e.target.value)
                }
                className={`rounded-xl h-12 ${
                  errors.schoolName ? "border-destructive" : "border-border/50"
                }`}
                placeholder="Masukkan nama lengkap sekolah"
              />
              {errors.schoolName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.schoolName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="schoolType" className="text-card-foreground">
                  Jenis Sekolah <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.schoolType}
                  onValueChange={(value) =>
                    handleInputChange("schoolType", value)
                  }
                >
                  <SelectTrigger
                    className={`rounded-xl h-12 ${
                      errors.schoolType
                        ? "border-destructive"
                        : "border-border/50"
                    }`}
                  >
                    <SelectValue placeholder="Pilih jenis sekolah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PKBM">PKBM</SelectItem>
                    <SelectItem value="PAUD">PAUD</SelectItem>
                    <SelectItem value="SD">SD</SelectItem>
                    <SelectItem value="SMP">SMP</SelectItem>
                  </SelectContent>
                </Select>
                {errors.schoolType && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.schoolType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-card-foreground">
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger
                    className={`rounded-xl h-12 ${
                      errors.status ? "border-destructive" : "border-border/50"
                    }`}
                  >
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                    <SelectItem value="Dalam Tinjauan">
                      Dalam Tinjauan
                    </SelectItem>
                    <SelectItem value="Data Belum Lengkap">
                      Data Belum Lengkap
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.status}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-card-foreground">
                Alamat <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`rounded-xl ${
                  errors.address ? "border-destructive" : "border-border/50"
                }`}
                placeholder="Masukkan alamat lengkap sekolah"
                rows={4}
              />
              {errors.address && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.address}
                </p>
              )}
            </div>
          </div>

          {/* Informasi Kontak */}
          <div className="space-y-6">
            <h3 className="text-lg text-card-foreground border-l-4 border-primary pl-4">
              Informasi Kontak
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">
                  Alamat Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`rounded-xl h-12 ${
                    errors.email ? "border-destructive" : "border-border/50"
                  }`}
                  placeholder="contoh: sekolah@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-card-foreground">
                  Nomor Telepon
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`rounded-xl h-12 ${
                    errors.phone ? "border-destructive" : "border-border/50"
                  }`}
                  placeholder="contoh: 021-1234567"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Keterangan Tambahan */}
          <div className="space-y-6">
            <h3 className="text-lg text-card-foreground border-l-4 border-primary pl-4">
              Keterangan Tambahan
            </h3>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-card-foreground">
                Catatan Tambahan
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="rounded-xl border-border/50"
                placeholder="Tambahkan keterangan tambahan (opsional)"
                rows={3}
              />
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/50">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl h-12 flex-1 sm:flex-none sm:min-w-32"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Sekolah
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-xl h-12 flex-1 sm:flex-none sm:min-w-32"
            >
              <X className="h-4 w-4 mr-2" />
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
