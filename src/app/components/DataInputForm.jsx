'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { School, Users, BookOpen, Save, ArrowLeft, Loader2 } from 'lucide-react';

import { schoolConfigs, createInitialFormData } from '@/lib/config/schoolConfig';
import { useDataInput } from '@/hooks/useDataInput';
import { NumberInput, TextInput, SelectInput } from './ui/FormInputs';
import Stepper from './Stepper';

const getValue = (obj, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);

export default function DataInputForm({ schoolType, embedded = false }) {
  const router = useRouter();

  const config = useMemo(() => schoolConfigs[schoolType] || schoolConfigs.default, [schoolType]);
  const initialData = useMemo(() => createInitialFormData(config), [config]);

  const { formData, handleChange, errors, validate, submit, saving } = useDataInput(
    config,
    initialData
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({});

  const sections = [
    {
      id: 'info',
      title: 'Info Sekolah',
      icon: <School className="w-5 h-5" />,
      fields: ['namaSekolah', 'npsn'],
    },
    { id: 'siswa', title: 'Data Siswa', icon: <Users className="w-5 h-5" />, fields: [] },
    { id: 'rombel', title: 'Rombel', icon: <BookOpen className="w-5 h-5" />, fields: [] },
  ];

  const handleNext = () => {
    const currentFields = sections[currentStep - 1].fields;
    if (validate(currentFields)) {
      setCompletedSteps((prev) => ({ ...prev, [currentStep - 1]: true }));
      if (currentStep < sections.length) setCurrentStep((s) => s + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submit(schoolType);
    if (result.success) {
      router.push('/dashboard');
    } else {
      alert('Gagal: ' + result.message);
    }
  };

  const renderContent = () => {
    const section = sections[currentStep - 1];

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
          </div>
        );

      case 'siswa':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900">
                Total Siswa: {formData.siswa.jumlahSiswa}
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

      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 text-lg font-semibold mb-6">
          {sections[currentStep - 1].icon}
          <span>{sections[currentStep - 1].title}</span>
        </div>

        <div className="min-h-[300px]">{renderContent()}</div>

        <div className="mt-8 pt-4 border-t flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Batal
          </button>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Kembali
              </button>
            )}

            {currentStep < sections.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Lanjut
              </button>
            ) : (
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
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
    </div>
  );
}
