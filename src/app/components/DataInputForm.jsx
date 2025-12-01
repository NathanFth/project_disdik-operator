'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { School, Users, BookOpen, Save, ArrowLeft, Loader2 } from 'lucide-react';

// PASTIKAN PATH INI SESUAI DENGAN STRUKTUR FOLDER KAMU
import { schoolConfigs, createInitialFormData } from '@/lib/config/schoolConfig';
import { useDataInput } from '@/hooks/useDataInput';
import { NumberInput, TextInput, SelectInput } from './ui/FormInputs';
import Stepper from './Stepper';
import { supabase } from '@/lib/supabase/lib/client';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap.jsx'), {
  ssr: false,
});

// Helper untuk mengambil value dari object bertingkat
const getValue = (obj, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);

export default function DataInputForm({ schoolType, embedded = false }) {
  const router = useRouter();

  // 1. Config & Initial Data
  const config = useMemo(() => schoolConfigs[schoolType] || schoolConfigs.default, [schoolType]);
  const initialData = useMemo(() => createInitialFormData(config), [config]);

  // 2. Hook Form Data
  const { formData, handleChange, errors, validate } = useDataInput(config, initialData);

  // 3. Local State
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [saving, setSaving] = useState(false);

  // 4. Definisi Section (Dibungkus useMemo agar tidak re-render loop)
  const sections = useMemo(
    () => [
      {
        id: 'info',
        title: 'Info Sekolah',
        icon: <School className="w-5 h-5" />,
        fields: ['namaSekolah', 'npsn'],
      },
      {
        id: 'siswa',
        title: 'Data Siswa',
        icon: <Users className="w-5 h-5" />,
        fields: [],
      },
      {
        id: 'rombel',
        title: 'Rombel',
        icon: <BookOpen className="w-5 h-5" />,
        fields: [],
      },
    ],
    []
  );

  // --- LOGIC HELPERS ---

  const sumSiswa = (genderKey) => {
    if (!config.grades) return 0;
    return config.grades.reduce((total, grade) => {
      const val = getValue(formData, `siswa.kelas${grade}.${genderKey}`);
      return total + (Number(val) || 0);
    }, 0);
  };

  const buildRombelMeta = () => {
    const meta = { rombel: {} };
    if (config.grades) {
      config.grades.forEach((grade) => {
        const key = `kelas${grade}`;
        const val = getValue(formData, `rombel.${key}`);
        meta.rombel[key] = Number(val) || 0;
      });
    }
    return meta;
  };

  const buildClassesArray = () => {
    const classes = [];
    if (!config.grades) return classes;

    config.grades.forEach((grade) => {
      const male = Number(getValue(formData, `siswa.kelas${grade}.l`) || 0);
      const female = Number(getValue(formData, `siswa.kelas${grade}.p`) || 0);

      if (male > 0) {
        classes.push({
          grade: `kelas${grade}_L`,
          count: male,
          extra: null,
        });
      }
      if (female > 0) {
        classes.push({
          grade: `kelas${grade}_P`,
          count: female,
          extra: null,
        });
      }
    });

    return classes;
  };

  useEffect(() => {
    console.log('config : ', config);
  }, [config]);

  const handleNext = () => {
    const currentFields = sections[currentStep - 1].fields;

    // Validasi field di step saat ini
    if (validate(currentFields)) {
      setCompletedSteps((prev) => ({ ...prev, [currentStep - 1]: true }));

      if (currentStep < sections.length) {
        setCurrentStep((s) => s + 1);
      }
    } else {
      console.log('Validasi gagal pada step:', currentStep);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  // FUNGSI SAVE: Hanya jalan kalau tombol Simpan diklik
  const handleSave = async () => {
    // Validasi step terakhir sebelum simpan
    const currentFields = sections[currentStep - 1].fields;
    if (!validate(currentFields)) {
      alert('Mohon lengkapi data di halaman ini terlebih dahulu.');
      return;
    }

    setSaving(true);

    try {
      const totalMale = sumSiswa('l');
      const totalFemale = sumSiswa('p');
      const rombelMeta = buildRombelMeta();
      const classes = buildClassesArray();

      const locationPayload = {
        province: 'Jawa Barat',
        district: 'Garut',
        subdistrict: formData.kecamatan,
        village: formData.village_name || formData.desa || 'Banjarwangi',
        extra: null,
      };

      const schoolPayload = {
        name: formData.namaSekolah,
        npsn: formData.npsn?.toString(),
        address: formData.address || null,
        village_name: formData.village_name || formData.desa || locationPayload.village,
        school_type_id: config.schoolTypeId || 3,
        status: formData.status,
        student_count: totalMale + totalFemale,
        st_male: totalMale,
        st_female: totalFemale,
        lat: formData.latitude ? Number(formData.latitude) : null,
        lng: formData.longitude ? Number(formData.longitude) : null,
        facilities: formData.facilities || null,
        class_condition: formData.class_condition || null,
        meta: rombelMeta,
        contact: formData.contact || null,
      };

      const payload = {
        location: locationPayload,
        school: schoolPayload,
        classes,
      };

      console.log('Payload yang dikirim:', payload);

      const { data, error } = await supabase.rpc('insert_school_with_relations', {
        p_payload: payload,
      });

      if (error) {
        console.error('Supabase Error:', error);
        throw new Error(error.message || 'Gagal menyimpan data');
      }

      console.log('Berhasil disimpan:', data);
      alert('Data berhasil disimpan!');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleLocationSelected = (lat, lng) => {
    handleChange('latitude', lat);
    handleChange('longitude', lng);
    setShowMap(false);
  };

  // --- RENDER CONTENT ---

  const renderContent = () => {
    const section = sections[currentStep - 1];

    // Safety check biar gak error "Cannot read properties of undefined"
    if (!formData) return <div>Loading form data...</div>;

    switch (section.id) {
      case 'info':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Nama Sekolah"
              value={formData.namaSekolah}
              onChange={(v) => handleChange('namaSekolah', v)}
              error={errors.namaSekolah}
              required
            />
            <NumberInput
              label="NPSN"
              value={formData.npsn}
              onChange={(v) => handleChange('npsn', v)}
              error={errors.npsn}
              required
              placeholder="8 Digit Angka"
            />
            <SelectInput
              label="Kecamatan"
              value={formData.kecamatan}
              onChange={(v) => handleChange('kecamatan', v)}
              options={['Garut Kota', 'Tarogong Kidul', 'Tarogong Kaler', 'Cilawu']}
              error={errors.kecamatan}
            />
            <SelectInput
              label="Status"
              value={formData.status}
              onChange={(v) => handleChange('status', v)}
              options={['Negeri', 'Swasta']}
              error={errors.status}
            />

            <NumberInput
              label="Latitude"
              value={formData.latitude ?? ''}
              onChange={(v) => handleChange('latitude', v)}
              placeholder="-6.9114359"
            />
            <NumberInput
              label="Longitude"
              value={formData.longitude ?? ''}
              onChange={(v) => handleChange('longitude', v)}
              placeholder="107.5770168"
            />

            <div className="md:col-span-2 space-y-2">
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Pilih Koordinat di Map
              </button>
              <p className="text-xs text-gray-500">
                Anda bisa mengisi koordinat secara manual atau klik tombol di atas.
              </p>
            </div>
          </div>
        );

      case 'siswa':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900">
                Total Siswa: {formData.siswa?.jumlahSiswa || 0}
              </h4>
            </div>

            {config.grades &&
              config.grades.map((grade) => (
                <div key={grade} className="p-4 border rounded-lg bg-gray-50/50">
                  <p className="font-medium mb-3">Kelas {grade}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                      label="Laki-laki"
                      value={getValue(formData, `siswa.kelas${grade}.l`)}
                      onChange={(v) => handleChange(`siswa.kelas${grade}.l`, v)}
                    />
                    <NumberInput
                      label="Perempuan"
                      value={getValue(formData, `siswa.kelas${grade}.p`)}
                      onChange={(v) => handleChange(`siswa.kelas${grade}.p`, v)}
                    />
                  </div>
                </div>
              ))}

            {config.isPaud &&
              config.rombelTypes &&
              config.rombelTypes.map((type) => (
                <div key={type.key} className="p-4 border rounded-lg bg-gray-50/50">
                  <p className="font-medium mb-3">{type.label}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                      label="Laki-laki"
                      value={getValue(formData, `siswa.${type.key}.l`)}
                      onChange={(v) => handleChange(`siswa.${type.key}.l`, v)}
                    />
                    <NumberInput
                      label="Perempuan"
                      value={getValue(formData, `siswa.${type.key}.p`)}
                      onChange={(v) => handleChange(`siswa.${type.key}.p`, v)}
                    />
                  </div>
                </div>
              ))}
          </div>
        );

      case 'rombel':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {config.grades &&
              config.grades.map((grade) => (
                <NumberInput
                  key={`rombel-${grade}`}
                  label={`Rombel Kelas ${grade}`}
                  value={getValue(formData, `rombel.kelas${grade}`)}
                  onChange={(v) => handleChange(`rombel.kelas${grade}`, v)}
                />
              ))}
          </div>
        );

      default:
        return <div>Konten belum tersedia</div>;
    }
  };

  return (
    <div
      className={embedded ? 'w-full' : 'max-w-4xl mx-auto p-6 border rounded-lg bg-white shadow-sm'}
    >
      {!embedded && <h1 className="text-2xl font-bold mb-6">Input Data {schoolType}</h1>}

      <div className="mb-8">
        <Stepper
          sections={sections}
          currentStep={currentStep}
          setStep={setCurrentStep}
          completedSteps={completedSteps}
        />
      </div>

      {/* PENTING: preventDefault agar Enter tidak men-submit form otomatis */}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-center gap-3 text-lg font-semibold mb-6">
          {sections[currentStep - 1].icon}
          <span>{sections[currentStep - 1].title}</span>
        </div>

        <div className="min-h-[300px]">{renderContent()}</div>

        <div className="mt-8 pt-4 border-t flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Batal
          </button>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
            )}

            {currentStep < sections.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Lanjut
              </button>
            ) : (
              <button
                type="button" /* BUTTON, BUKAN SUBMIT */
                onClick={handleSave} /* FUNGSI SIMPAN KHUSUS */
                disabled={saving}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Simpan Data
              </button>
            )}
          </div>
        </div>
      </form>

      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-3xl p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Klik pada peta untuk memilih lokasi sekolah</h2>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                Tutup
              </button>
            </div>

            <LocationPickerMap
              onSelectLocation={handleLocationSelected}
              defaultCenter={
                formData.latitude && formData.longitude
                  ? [Number(formData.latitude), Number(formData.longitude)]
                  : [-6.911435926513646, 107.57701686406499]
              }
            />

            <p className="text-xs text-gray-500">
              Setelah memilih titik di peta, nilai latitude & longitude akan terisi otomatis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
