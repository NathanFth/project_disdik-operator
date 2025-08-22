// components/SekolahForm.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';

// Sub-component untuk kondisi ruangan yang berulang
const RuanganConditionForm = ({ title, prefix, formData, handleInputChange }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`${prefix}_jumlah`}>Jumlah</Label>
            <Input
              id={`${prefix}_jumlah`}
              name={`${prefix}_jumlah`}
              type="number"
              min="0"
              value={formData[`${prefix}_jumlah`] || ''}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor={`${prefix}_baik`}>Baik</Label>
            <Input
              id={`${prefix}_baik`}
              name={`${prefix}_baik`}
              type="number"
              min="0"
              value={formData[`${prefix}_baik`] || ''}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor={`${prefix}_rusak_ringan`}>Rusak Ringan</Label>
            <Input
              id={`${prefix}_rusak_ringan`}
              name={`${prefix}_rusak_ringan`}
              type="number"
              min="0"
              value={formData[`${prefix}_rusak_ringan`] || ''}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor={`${prefix}_rusak_sedang`}>Rusak Sedang</Label>
            <Input
              id={`${prefix}_rusak_sedang`}
              name={`${prefix}_rusak_sedang`}
              type="number"
              min="0"
              value={formData[`${prefix}_rusak_sedang`] || ''}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor={`${prefix}_rusak_berat`}>Rusak Berat</Label>
            <Input
              id={`${prefix}_rusak_berat`}
              name={`${prefix}_rusak_berat`}
              type="number"
              min="0"
              value={formData[`${prefix}_rusak_berat`] || ''}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Sub-component untuk data siswa per kelas
const SiswaPerKelasForm = ({ formData, handleInputChange }) => {
  // Hitung total siswa otomatis
  const calculateTotalSiswa = () => {
    let total = 0;
    for (let kelas = 1; kelas <= 6; kelas++) {
      total += parseInt(formData[`siswa_kelas${kelas}_l`] || 0);
      total += parseInt(formData[`siswa_kelas${kelas}_p`] || 0);
    }
    return total;
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Data Siswa per Kelas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2">Kelas</th>
                <th className="border border-gray-300 p-2">Laki-laki</th>
                <th className="border border-gray-300 p-2">Perempuan</th>
                <th className="border border-gray-300 p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map(kelas => (
                <tr key={kelas}>
                  <td className="border border-gray-300 p-2 font-medium">Kelas {kelas}</td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      name={`siswa_kelas${kelas}_l`}
                      type="number"
                      min="0"
                      value={formData[`siswa_kelas${kelas}_l`] || ''}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      name={`siswa_kelas${kelas}_p`}
                      type="number"
                      min="0"
                      value={formData[`siswa_kelas${kelas}_p`] || ''}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center font-medium">
                    {parseInt(formData[`siswa_kelas${kelas}_l`] || 0) + parseInt(formData[`siswa_kelas${kelas}_p`] || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-blue-50 font-bold">
                <td className="border border-gray-300 p-2">TOTAL</td>
                <td className="border border-gray-300 p-2 text-center">
                  {[1, 2, 3, 4, 5, 6].reduce((sum, kelas) => sum + parseInt(formData[`siswa_kelas${kelas}_l`] || 0), 0)}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {[1, 2, 3, 4, 5, 6].reduce((sum, kelas) => sum + parseInt(formData[`siswa_kelas${kelas}_p`] || 0), 0)}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {calculateTotalSiswa()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="mt-4">
          <Label htmlFor="jumlah_rombel">Jumlah Rombel</Label>
          <Input
            id="jumlah_rombel"
            name="jumlah_rombel"
            type="number"
            min="0"
            value={formData.jumlah_rombel || ''}
            onChange={handleInputChange}
            placeholder="0"
            className="w-32"
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Main Form Component
const SekolahForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [formData, setFormData] = useState({});
  const [kecamatanList, setKecamatanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load data kecamatan
  useEffect(() => {
    // Simulasi data kecamatan - ganti dengan API call
    const loadKecamatan = async () => {
      // const response = await fetch('/api/kecamatan');
      // const data = await response.json();
      // setKecamatanList(data);
      
      // Data dummy untuk development
      setKecamatanList([
        { id: 1, nama_kecamatan: 'Bandung Wetan' },
        { id: 2, nama_kecamatan: 'Bandung Kulon' },
        { id: 3, nama_kecamatan: 'Bojongloa Kaler' },
        { id: 4, nama_kecamatan: 'Bojongloa Kidul' },
        { id: 5, nama_kecamatan: 'Astana Anyar' },
        // ... tambahkan data kecamatan lainnya
      ]);
    };
    
    loadKecamatan();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Implement API call to save data
      const response = await fetch('/api/sekolah', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Data berhasil disimpan!');
        setFormData({});
        setCurrentStep(1);
      } else {
        throw new Error('Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>1. Identitas Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="no_urut">No. Urut</Label>
                  <Input
                    id="no_urut"
                    name="no_urut"
                    type="number"
                    min="1"
                    value={formData.no_urut || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="no_urut_sekolah_kecamatan">No. Urut Sekolah/Kecamatan</Label>
                  <Input
                    id="no_urut_sekolah_kecamatan"
                    name="no_urut_sekolah_kecamatan"
                    value={formData.no_urut_sekolah_kecamatan || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="kecamatan_id">Kecamatan</Label>
                  <Select
                    value={formData.kecamatan_id || ''}
                    onValueChange={(value) => handleSelectChange('kecamatan_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kecamatan" />
                    </SelectTrigger>
                    <SelectContent>
                      {kecamatanList.map(kec => (
                        <SelectItem key={kec.id} value={kec.id.toString()}>
                          {kec.nama_kecamatan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="npsn">NPSN</Label>
                  <Input
                    id="npsn"
                    name="npsn"
                    value={formData.npsn || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="nama_sekolah">Nama Sekolah</Label>
                  <Input
                    id="nama_sekolah"
                    name="nama_sekolah"
                    value={formData.nama_sekolah || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label>Status Sekolah</Label>
                  <RadioGroup
                    value={formData.status_sekolah_id || ''}
                    onValueChange={(value) => handleSelectChange('status_sekolah_id', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="negeri" />
                      <Label htmlFor="negeri">Negeri</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="swasta" />
                      <Label htmlFor="swasta">Swasta</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return <SiswaPerKelasForm formData={formData} handleInputChange={handleInputChange} />;

      case 3:
        return (
          <>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Kondisi Ruang Kelas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label htmlFor="ruang_kelas_jumlah">Jumlah Ruang Kelas</Label>
                    <Input
                      id="ruang_kelas_jumlah"
                      name="ruang_kelas_jumlah"
                      type="number"
                      min="0"
                      value={formData.ruang_kelas_jumlah || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ruang_kelas_baik">Baik</Label>
                    <Input
                      id="ruang_kelas_baik"
                      name="ruang_kelas_baik"
                      type="number"
                      min="0"
                      value={formData.ruang_kelas_baik || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ruang_kelas_rusak_ringan">Rusak Ringan</Label>
                    <Input
                      id="ruang_kelas_rusak_ringan"
                      name="ruang_kelas_rusak_ringan"
                      type="number"
                      min="0"
                      value={formData.ruang_kelas_rusak_ringan || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ruang_kelas_rusak_sedang">Rusak Sedang</Label>
                    <Input
                      id="ruang_kelas_rusak_sedang"
                      name="ruang_kelas_rusak_sedang"
                      type="number"
                      min="0"
                      value={formData.ruang_kelas_rusak_sedang || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ruang_kelas_rusak_berat">Rusak Berat</Label>
                    <Input
                      id="ruang_kelas_rusak_berat"
                      name="ruang_kelas_rusak_berat"
                      type="number"
                      min="0"
                      value={formData.ruang_kelas_rusak_berat || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ruang_kelas_kelebihan_tidak_terawat">Kelebihan & Tidak Terawat</Label>
                    <Input
                      id="ruang_kelas_kelebihan_tidak_terawat"
                      name="ruang_kelas_kelebihan_tidak_terawat"
                      type="number"
                      min="0"
                      value={formData.ruang_kelas_kelebihan_tidak_terawat || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ruang_kelas_kurang_rkb">Kurang RKB</Label>
                    <Input
                      id="ruang_kelas_kurang_rkb"
                      name="ruang_kelas_kurang_rkb"
                      type="number"
                      min="0"
                      value={formData.ruang_kelas_kurang_rkb || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label>Lahan</Label>
                    <RadioGroup
                      value={formData.ruang_kelas_lahan || ''}
                      onValueChange={(value) => handleSelectChange('ruang_kelas_lahan', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Ada" id="lahan_ada" />
                        <Label htmlFor="lahan_ada">Ada</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Tidak" id="lahan_tidak" />
                        <Label htmlFor="lahan_tidak">Tidak</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        );

      case 4:
        return (
          <>
            <RuanganConditionForm 
              title="Ruang Perpustakaan" 
              prefix="perpustakaan" 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            <RuanganConditionForm 
              title="Ruang Laboratorium" 
              prefix="laboratorium" 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            <RuanganConditionForm 
              title="Ruang Guru" 
              prefix="ruang_guru" 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            <RuanganConditionForm 
              title="Ruang UKS" 
              prefix="ruang_uks" 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            <RuanganConditionForm 
              title="Toilet Guru & Siswa" 
              prefix="toilet" 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            <RuanganConditionForm 
              title="Rumah Dinas" 
              prefix="rumah_dinas" 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
          </>
        );

      case 5:
        return (
          <>
            <RuanganConditionForm 
              title="Mebeler - Meja" 
              prefix="meja" 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            <RuanganConditionForm 
              title="Mebeler - Kursi" 
              prefix="kursi" 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Fasilitas Lain</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="jumlah_chromebook">Jumlah Chromebook</Label>
                  <Input
                    id="jumlah_chromebook"
                    name="jumlah_chromebook"
                    type="number"
                    min="0"
                    value={formData.jumlah_chromebook || ''}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-48"
                  />
                </div>
              </CardContent>
            </Card>
          </>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Data Guru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jumlah_guru">Jumlah Guru</Label>
                  <Input
                    id="jumlah_guru"
                    name="jumlah_guru"
                    type="number"
                    min="0"
                    value={formData.jumlah_guru || ''}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="guru_pns">PNS</Label>
                  <Input
                    id="guru_pns"
                    name="guru_pns"
                    type="number"
                    min="0"
                    value={formData.guru_pns || ''}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="guru_pppk">PPPK</Label>
                  <Input
                    id="guru_pppk"
                    name="guru_pppk"
                    type="number"
                    min="0"
                    value={formData.guru_pppk || ''}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="guru_non_asn">Non ASN (Paruh Waktu / Tidak Masuk Dapodik)</Label>
                  <Input
                    id="guru_non_asn"
                    name="guru_non_asn"
                    type="number"
                    min="0"
                    value={formData.guru_non_asn || ''}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="keterangan_guru">Keterangan Guru</Label>
                  <Textarea
                    id="keterangan_guru"
                    name="keterangan_guru"
                    value={formData.keterangan_guru || ''}
                    onChange={handleInputChange}
                    placeholder="Masukkan keterangan tambahan tentang guru..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Summary Card */}
              <Card className="mt-6 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Ringkasan Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">Identitas Sekolah</h4>
                      <p><strong>NPSN:</strong> {formData.npsn || '-'}</p>
                      <p><strong>Nama:</strong> {formData.nama_sekolah || '-'}</p>
                      <p><strong>Status:</strong> {formData.status_sekolah_id === '1' ? 'Negeri' : formData.status_sekolah_id === '2' ? 'Swasta' : '-'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">Data Siswa</h4>
                      <p><strong>Total Siswa:</strong> {
                        [1, 2, 3, 4, 5, 6].reduce((total, kelas) => 
                          total + parseInt(formData[`siswa_kelas${kelas}_l`] || 0) + parseInt(formData[`siswa_kelas${kelas}_p`] || 0), 0
                        )
                      }</p>
                      <p><strong>Rombel:</strong> {formData.jumlah_rombel || 0}</p>
                      <p><strong>Ruang Kelas:</strong> {formData.ruang_kelas_jumlah || 0}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">Data Guru</h4>
                      <p><strong>Total Guru:</strong> {formData.jumlah_guru || 0}</p>
                      <p><strong>PNS:</strong> {formData.guru_pns || 0}</p>
                      <p><strong>PPPK:</strong> {formData.guru_pppk || 0}</p>
                      <p><strong>Non ASN:</strong> {formData.guru_non_asn || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Input Data Sekolah</h1>
          <p className="text-gray-600">Input data sekolah untuk keperluan administrasi Disdik</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Langkah {currentStep} dari {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}% selesai
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Labels */}
        <div className="flex flex-wrap justify-between mb-8 text-xs">
          {[
            'Identitas Sekolah',
            'Data Siswa',
            'Ruang Kelas',
            'Fasilitas',
            'Mebeler & Lainnya',
            'Data Guru'
          ].map((label, index) => (
            <div
              key={index}
              className={`flex-1 text-center pb-2 ${
                currentStep > index + 1
                  ? 'text-green-600 font-semibold'
                  : currentStep === index + 1
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-400'
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Form Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Sebelumnya
            </Button>

            <div className="flex space-x-2">
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                >
                  Selanjutnya
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Form Validation Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Informasi Pengisian:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Field yang wajib diisi: NPSN, Nama Sekolah, Status Sekolah</li>
            <li>• Total siswa akan dihitung otomatis dari data per kelas</li>
            <li>• Pastikan jumlah kondisi ruangan tidak melebihi jumlah total ruangan</li>
            <li>• Data dapat disimpan sebagai draft dan dilanjutkan nanti</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SekolahForm;