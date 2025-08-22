"use client";

import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Save, 
  AlertCircle, 
  Users, 
  Building, 
  GraduationCap, 
  Settings,
  BookOpen,
  CheckCircle,
  X
} from 'lucide-react';

// Mock data structures untuk demo
const getTemplateBySchoolType = (userRole) => {
  const baseTemplate = {
    basicInfo: {
      npsn: '',
      namaSekolah: '',
      kecamatan: '',
      status: '',
      kepalaSekolah: '',
      telepon: '',
      alamat: '',
      email: ''
    },
    siswa: {
      jumlahSiswa: 0,
      kelas: [],
      siswaAbk: { kelas: [] },
      siswaLanjutDalamKab: {},
      siswaLanjutLuarKab: {},
      siswaTidakLanjut: 0,
      rombel: []
    },
    prasarana: {
      ukuran: { tanah: 0, bangunan: 0, halaman: 0 },
      fasilitas: {
        gedung: { jumlah: 0, baik: 0, rusakRingan: 0, rusakSedang: 0, rusakBerat: 0 },
        ruangKelas: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
        ruangPerpustakaan: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
        ruangLaboratorium: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
        ruangGuru: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
        ruangUks: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 },
        toilet: { jumlah: 0, baik: 0, rusakSedang: 0, rusakBerat: 0 }
      }
    },
    guru: {
      jumlahGuru: 0,
      pns: 0,
      pppk: 0,
      pppkParuhWaktu: 0,
      nonAsnDapodik: 0,
      nonAsnTidakDapodik: 0,
      kekuranganGuru: 0,
      guruPerMapel: {},
      kualifikasi: { s2: 0, s1: 0, d4: 0, d3: 0, d2: 0, sma: 0 },
      sertifikasi: { sudah: 0, belum: 0 }
    },
    kelembagaan: {
      komiteSekolah: false,
      akreditasi: '',
      iso: false,
      nss: '',
      nds: '',
      siap: false,
      bos: false,
      internet: false,
      listrik: false
    },
    kurikulum: {
      kurikulumDigunakan: '',
      pembelajaran: '',
      ekstrakurikuler: ''
    }
  };

  // Setup kelas berdasarkan jenjang
  const kelasMap = {
    PAUD: ['A', 'B'],
    TK: ['A', 'B'],
    SD: ['1', '2', '3', '4', '5', '6'],
    SMP: ['7', '8', '9'],
    PKBM: ['Paket A', 'Paket B', 'Paket C']
  };

  const kelas = kelasMap[userRole] || [];
  baseTemplate.siswa.kelas = kelas.map(tingkat => ({
    tingkat,
    laki: 0,
    perempuan: 0
  }));
  baseTemplate.siswa.siswaAbk.kelas = kelas.map(tingkat => ({
    tingkat,
    laki: 0,
    perempuan: 0
  }));
  baseTemplate.siswa.rombel = kelas.map(tingkat => ({
    tingkat,
    jumlah: 0
  }));

  // Setup siswa melanjutkan berdasarkan jenjang
  const melanjutkanMap = {
    SD: ['smp', 'mts', 'pontren', 'pkbm'],
    SMP: ['sma', 'smk', 'ma', 'pontren', 'pkbm'],
    PKBM: ['universitas', 'institut', 'akademi']
  };

  if (melanjutkanMap[userRole]) {
    melanjutkanMap[userRole].forEach(key => {
      baseTemplate.siswa.siswaLanjutDalamKab[key] = 0;
      baseTemplate.siswa.siswaLanjutLuarKab[key] = 0;
    });
  }

  return baseTemplate;
};

const validateSchoolData = (formData, userRole) => {
  const errors = [];
  
  if (!formData.basicInfo.npsn) errors.push('NPSN harus diisi');
  if (!formData.basicInfo.namaSekolah) errors.push('Nama sekolah harus diisi');
  if (!formData.basicInfo.kecamatan) errors.push('Kecamatan harus dipilih');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default function ComprehensiveSchoolForm({ 
  userRole, 
  initialData = null, 
  onSave, 
  onCancel 
}) {
  const [formData, setFormData] = useState(() => {
    return initialData || getTemplateBySchoolType(userRole);
  });
  
  const [errors, setErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);

  // Update form data
  const updateFormData = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const pathArray = path.split('.');
      let current = newData;
      
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      
      current[pathArray[pathArray.length - 1]] = value;
      return newData;
    });
  };

  // Update array data (untuk kelas, rombel, dll)
  const updateArrayData = (path, index, field, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const pathArray = path.split('.');
      let current = newData;
      
      for (let i = 0; i < pathArray.length; i++) {
        if (i === pathArray.length - 1) {
          current[pathArray[i]][index][field] = value;
        } else {
          current = current[pathArray[i]];
        }
      }
      
      return newData;
    });
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    
    // Validate data
    const validation = validateSchoolData(formData, userRole);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setSaving(false);
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave(formData);
      }
      
      setErrors([]);
    } catch (error) {
      setErrors(['Gagal menyimpan data. Silakan coba lagi.']);
    } finally {
      setSaving(false);
    }
  };

  const getRoleDisplayName = () => {
    switch(userRole) {
      case 'PAUD': return 'PAUD';
      case 'TK': return 'TK';
      case 'SD': return 'SD';
      case 'SMP': return 'SMP';
      case 'PKBM': return 'PKBM';
      default: return 'Sekolah';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6 text-primary" />
              {initialData ? 'Edit' : 'Tambah'} Data {getRoleDisplayName()}
            </div>
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
          {errors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
                <AlertCircle className="h-4 w-4" />
                Terdapat kesalahan pada form:
              </div>
              <ul className="text-sm text-red-600 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Form Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Info Dasar</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Siswa</span>
          </TabsTrigger>
          <TabsTrigger value="facilities" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Prasarana</span>
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Guru</span>
          </TabsTrigger>
          <TabsTrigger value="institution" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Kelembagaan</span>
          </TabsTrigger>
          <TabsTrigger value="curriculum" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Kurikulum</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Info Dasar */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar {getRoleDisplayName()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="npsn">NPSN *</Label>
                  <Input
                    id="npsn"
                    value={formData.basicInfo.npsn}
                    onChange={(e) => updateFormData('basicInfo.npsn', e.target.value)}
                    placeholder="Nomor Pokok Sekolah Nasional"
                  />
                </div>
                
                <div>
                  <Label htmlFor="namaSekolah">Nama {getRoleDisplayName()} *</Label>
                  <Input
                    id="namaSekolah"
                    value={formData.basicInfo.namaSekolah}
                    onChange={(e) => updateFormData('basicInfo.namaSekolah', e.target.value)}
                    placeholder={`Nama ${getRoleDisplayName()}`}
                  />
                </div>

                <div>
                  <Label htmlFor="kecamatan">Kecamatan *</Label>
                  <Select 
                    value={formData.basicInfo.kecamatan}
                    onValueChange={(value) => updateFormData('basicInfo.kecamatan', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kecamatan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tasikmalaya">Tasikmalaya</SelectItem>
                      <SelectItem value="Singaparna">Singaparna</SelectItem>
                      <SelectItem value="Ciawi">Ciawi</SelectItem>
                      <SelectItem value="Rajapolah">Rajapolah</SelectItem>
                      <SelectItem value="Manonjaya">Manonjaya</SelectItem>
                      <SelectItem value="Salawu">Salawu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.basicInfo.status}
                    onValueChange={(value) => updateFormData('basicInfo.status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                      <SelectItem value="Data Belum Lengkap">Data Belum Lengkap</SelectItem>
                      <SelectItem value="Sedang Ditinjau">Sedang Ditinjau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="kepalaSekolah">Kepala {getRoleDisplayName()}</Label>
                  <Input
                    id="kepalaSekolah"
                    value={formData.basicInfo.kepalaSekolah}
                    onChange={(e) => updateFormData('basicInfo.kepalaSekolah', e.target.value)}
                    placeholder={`Nama Kepala ${getRoleDisplayName()}`}
                  />
                </div>

                <div>
                  <Label htmlFor="telepon">Telepon</Label>
                  <Input
                    id="telepon"
                    value={formData.basicInfo.telepon}
                    onChange={(e) => updateFormData('basicInfo.telepon', e.target.value)}
                    placeholder="Nomor telepon"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="alamat">Alamat Lengkap</Label>
                <Textarea
                  id="alamat"
                  value={formData.basicInfo.alamat}
                  onChange={(e) => updateFormData('basicInfo.alamat', e.target.value)}
                  placeholder="Alamat lengkap sekolah"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.basicInfo.email}
                  onChange={(e) => updateFormData('basicInfo.email', e.target.value)}
                  placeholder="email@sekolah.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Data Siswa */}
        <TabsContent value="students">
          <div className="space-y-6">
            {/* Total Siswa */}
            <Card>
              <CardHeader>
                <CardTitle>Data Siswa</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="jumlahSiswa">Jumlah Total Siswa</Label>
                  <Input
                    id="jumlahSiswa"
                    type="number"
                    value={formData.siswa.jumlahSiswa}
                    onChange={(e) => updateFormData('siswa.jumlahSiswa', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data per Kelas/Tingkat */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Data Siswa per {userRole === 'PAUD' || userRole === 'TK' ? 'Kelompok' : userRole === 'PKBM' ? 'Program' : 'Kelas'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.siswa.kelas.map((kelas, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">
                        {userRole === 'PAUD' || userRole === 'TK' ? `Kelompok ${kelas.tingkat}` :
                         userRole === 'PKBM' ? kelas.tingkat :
                         `Kelas ${kelas.tingkat}`}
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Laki-laki</Label>
                          <Input
                            type="number"
                            value={kelas.laki}
                            onChange={(e) => updateArrayData('siswa.kelas', index, 'laki', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>Perempuan</Label>
                          <Input
                            type="number"
                            value={kelas.perempuan}
                            onChange={(e) => updateArrayData('siswa.kelas', index, 'perempuan', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Total: {kelas.laki + kelas.perempuan} siswa
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Siswa Berkebutuhan Khusus */}
            <Card>
              <CardHeader>
                <CardTitle>Siswa Berkebutuhan Khusus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.siswa.siswaAbk.kelas.map((kelas, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <h5 className="font-medium mb-2">
                        {userRole === 'PAUD' || userRole === 'TK' ? `Kelompok ${kelas.tingkat}` :
                         userRole === 'PKBM' ? kelas.tingkat :
                         `Kelas ${kelas.tingkat}`}
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Laki-laki ABK</Label>
                          <Input
                            type="number"
                            value={kelas.laki}
                            onChange={(e) => updateArrayData('siswa.siswaAbk.kelas', index, 'laki', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>Perempuan ABK</Label>
                          <Input
                            type="number"
                            value={kelas.perempuan}
                            onChange={(e) => updateArrayData('siswa.siswaAbk.kelas', index, 'perempuan', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Siswa Melanjutkan */}
            {(userRole === 'SD' || userRole === 'SMP' || userRole === 'PKBM') && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Siswa Melanjutkan dalam Kabupaten</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.keys(formData.siswa.siswaLanjutDalamKab).map(key => (
                        <div key={key}>
                          <Label>{key.toUpperCase()}</Label>
                          <Input
                            type="number"
                            value={formData.siswa.siswaLanjutDalamKab[key]}
                            onChange={(e) => updateFormData(`siswa.siswaLanjutDalamKab.${key}`, parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Siswa Melanjutkan luar Kabupaten</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.keys(formData.siswa.siswaLanjutLuarKab).map(key => (
                        <div key={key}>
                          <Label>{key.toUpperCase()}</Label>
                          <Input
                            type="number"
                            value={formData.siswa.siswaLanjutLuarKab[key]}
                            onChange={(e) => updateFormData(`siswa.siswaLanjutLuarKab.${key}`, parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Siswa Tidak Melanjutkan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="number"
                      value={formData.siswa.siswaTidakLanjut}
                      onChange={(e) => updateFormData('siswa.siswaTidakLanjut', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </CardContent>
                </Card>
              </>
            )}

            {/* Data Rombel */}
            <Card>
              <CardHeader>
                <CardTitle>Data Rombongan Belajar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.siswa.rombel.map((rombel, index) => (
                    <div key={index}>
                      <Label>
                        Rombel {userRole === 'PAUD' || userRole === 'TK' ? 'Kelompok' : userRole === 'PKBM' ? '' : 'Kelas'} {rombel.tingkat}
                      </Label>
                      <Input
                        type="number"
                        value={rombel.jumlah}
                        onChange={(e) => updateArrayData('siswa.rombel', index, 'jumlah', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Prasarana */}
        <TabsContent value="facilities">
          <div className="space-y-6">
            {/* Ukuran */}
            <Card>
              <CardHeader>
                <CardTitle>Ukuran (m²)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Tanah</Label>
                    <Input
                      type="number"
                      value={formData.prasarana.ukuran.tanah}
                      onChange={(e) => updateFormData('prasarana.ukuran.tanah', parseInt(e.target.value) || 0)}
                      placeholder="Luas tanah (m²)"
                    />
                  </div>
                  <div>
                    <Label>Bangunan</Label>
                    <Input
                      type="number"
                      value={formData.prasarana.ukuran.bangunan}
                      onChange={(e) => updateFormData('prasarana.ukuran.bangunan', parseInt(e.target.value) || 0)}
                      placeholder="Luas bangunan (m²)"
                    />
                  </div>
                  <div>
                    <Label>Halaman</Label>
                    <Input
                      type="number"
                      value={formData.prasarana.ukuran.halaman}
                      onChange={(e) => updateFormData('prasarana.ukuran.halaman', parseInt(e.target.value) || 0)}
                      placeholder="Luas halaman (m²)"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fasilitas */}
            {Object.entries(formData.prasarana.fasilitas).map(([facility, data]) => (
              <Card key={facility}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {facility.replace(/([A-Z])/g, ' $1').trim()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(data).map(([kondisi, value]) => (
                      <div key={kondisi}>
                        <Label className="capitalize">
                          {kondisi.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => updateFormData(`prasarana.fasilitas.${facility}.${kondisi}`, parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Guru */}
        <TabsContent value="teachers">
          <div className="space-y-6">
            {/* Data Guru Berdasarkan Status */}
            <Card>
              <CardHeader>
                <CardTitle>Data Guru Berdasarkan Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Total Guru</Label>
                    <Input
                      type="number"
                      value={formData.guru.jumlahGuru}
                      onChange={(e) => updateFormData('guru.jumlahGuru', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>PNS</Label>
                    <Input
                      type="number"
                      value={formData.guru.pns}
                      onChange={(e) => updateFormData('guru.pns', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>PPPK</Label>
                    <Input
                      type="number"
                      value={formData.guru.pppk}
                      onChange={(e) => updateFormData('guru.pppk', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>PPPK Paruh Waktu</Label>
                    <Input
                      type="number"
                      value={formData.guru.pppkParuhWaktu}
                      onChange={(e) => updateFormData('guru.pppkParuhWaktu', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Non ASN (Dapodik)</Label>
                    <Input
                      type="number"
                      value={formData.guru.nonAsnDapodik}
                      onChange={(e) => updateFormData('guru.nonAsnDapodik', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Non ASN (Tidak Dapodik)</Label>
                    <Input
                      type="number"
                      value={formData.guru.nonAsnTidakDapodik}
                      onChange={(e) => updateFormData('guru.nonAsnTidakDapodik', parseInt(e.target.value) || 0)}