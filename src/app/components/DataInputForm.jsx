"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  School,
  Users,
  BookOpen,
  Save,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import {
  schoolConfigs,
  createInitialFormData,
} from "@/lib/config/schoolConfig";
import { useDataInput } from "@/hooks/useDataInput";
import { NumberInput, TextInput, SelectInput } from "./ui/FormInputs";
import Stepper from "./Stepper";
import { supabase } from "@/lib/supabase/lib/client";


// dynamic import komponen map supaya tidak di-render di server
const LocationPickerMap = dynamic(() => import("./LocationPickerMap.jsx"), {
  ssr: false,
});

const getValue = (obj, path) =>
  path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);

export default function DataInputForm({ schoolType, embedded = false }) {
  const router = useRouter();

  const config = useMemo(
    () => schoolConfigs[schoolType] || schoolConfigs.default,
    [schoolType]
  );
  const initialData = useMemo(() => createInitialFormData(config), [config]);

  const { formData, handleChange, errors, validate } = useDataInput(
    config,
    initialData
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [saving, setSaving] = useState(false);

  const sections = [
    {
      id: "info",
      title: "Info Sekolah",
      icon: <School className="w-5 h-5" />,
      fields: ["namaSekolah", "npsn"],
    },
    {
      id: "siswa",
      title: "Data Siswa",
      icon: <Users className="w-5 h-5" />,
      fields: [],
    },
    {
      id: "rombel",
      title: "Rombel",
      icon: <BookOpen className="w-5 h-5" />,
      fields: [],
    },
  ];

  const handleNext = () => {
    const currentFields = sections[currentStep - 1].fields;
    if (validate(currentFields)) {
      setCompletedSteps((prev) => ({ ...prev, [currentStep - 1]: true }));
      if (currentStep < sections.length) setCurrentStep((s) => s + 1);
    }
  };

  // helper: jumlah siswa L/P dari semua kelas di config.grades
  const sumSiswa = (genderKey) => {
    if (!config.grades) return 0;
    return config.grades.reduce((total, grade) => {
      const val = getValue(formData, `siswa.kelas${grade}.${genderKey}`);
      return total + (Number(val) || 0);
    }, 0);
  };

  // helper: meta rombel { rombel: { kelas1: 1, kelas2: 1, ... } }
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

  // helper: array school_classes
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // bisa tambahkan validasi full di sini kalau mau
    setSaving(true);

    try {
      const totalMale = sumSiswa("l");
      const totalFemale = sumSiswa("p");
      const rombelMeta = buildRombelMeta();
      const classes = buildClassesArray();

      // 1) bagian location
      const locationPayload = {
        province: "Jawa Barat", // bisa diubah dari form kalau sudah ada
        district: "Garut",
        subdistrict: formData.kecamatan,
        village: formData.village_name || formData.desa || "Banjarwangi",
        extra: null,
      };

      // 2) bagian school
      const schoolPayload = {
        name: formData.namaSekolah,
        npsn: formData.npsn?.toString(),
        address: formData.address || null,
        village_name:
          formData.village_name || formData.desa || locationPayload.village,
        school_type_id: config.schoolTypeId || 3, // sesuaikan dengan config kamu
        status: formData.status,
        student_count: totalMale + totalFemale,
        st_male: totalMale,
        st_female: totalFemale,
        lat: formData.latitude ? Number(formData.latitude) : null,
        lng: formData.longitude ? Number(formData.longitude) : null,
        facilities: formData.facilities || null, // kalau ada di form
        class_condition: formData.class_condition || null, // kalau ada di form
        meta: rombelMeta,
        contact: formData.contact || null,
       
      };

      const payload = {
        location: locationPayload,
        school: schoolPayload,
        classes,
      };

      console.log('hasil : ', payload)
      const { data, error } = await supabase.rpc(
        "insert_school_with_relations",
        {
          p_payload: payload,
        }
      );

      if (error) {
        console.error(error);
        throw new Error(error.message || "Gagal menyimpan data");
      }

      // data harusnya berisi { location_id, school_id }
      console.log("RPC result:", data);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan saat menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  // dipanggil ketika user klik titik di map
  const handleLocationSelected = (lat, lng) => {
    handleChange("latitude", lat);
    handleChange("longitude", lng);
    setShowMap(false);
  };

  const renderContent = () => {
    const section = sections[currentStep - 1];

    switch (section.id) {
      case "info":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Nama Sekolah"
              value={formData.namaSekolah}
              onChange={(v) => handleChange("namaSekolah", v)}
              error={errors.namaSekolah}
              required
            />
            <NumberInput
              label="NPSN"
              value={formData.npsn}
              onChange={(v) => handleChange("npsn", v)}
              error={errors.npsn}
              required
              placeholder="8 Digit Angka"
            />
            <SelectInput
              label="Kecamatan"
              value={formData.kecamatan}
              onChange={(v) => handleChange("kecamatan", v)}
              options={[
                "Garut Kota",
                "Tarogong Kidul",
                "Tarogong Kaler",
                "Cilawu",
              ]}
              error={errors.kecamatan}
            />
            <SelectInput
              label="Status"
              value={formData.status}
              onChange={(v) => handleChange("status", v)}
              options={["Negeri", "Swasta"]}
              error={errors.status}
            />

            {/* OPSI MANUAL: isi latitude & longitude */}
            <NumberInput
              label="Latitude"
              value={formData.latitude ?? ""}
              onChange={(v) => handleChange("latitude", v)}
              placeholder="-6.9114359"
            />
            <NumberInput
              label="Longitude"
              value={formData.longitude ?? ""}
              onChange={(v) => handleChange("longitude", v)}
              placeholder="107.5770168"
            />

            {/* OPSI DARI MAP: klik tombol, pilih titik di map */}
            <div className="md:col-span-2 space-y-2">
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Pilih Koordinat di Map
              </button>
              <p className="text-xs text-gray-500">
                Anda bisa mengisi koordinat secara manual (latitude & longitude)
                atau klik "Pilih Koordinat di Map" lalu klik titik lokasi
                sekolah. Contoh: -6.911435926513646, 107.57701686406499
              </p>
            </div>
          </div>
        );

      case "siswa":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900">
                Total Siswa: {formData.siswa.jumlahSiswa}
              </h4>
            </div>

            {config.grades &&
              config.grades.map((grade) => (
                <div
                  key={grade}
                  className="p-4 border rounded-lg bg-gray-50/50"
                >
                  <p className="font-medium mb-3">Kelas {grade}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                      label="Laki-laki"
                      value={getValue(formData, `siswa.kelas${grade}.l`)}
                      onChange={(v) =>
                        handleChange(`siswa.kelas${grade}.l`, v)
                      }
                    />
                    <NumberInput
                      label="Perempuan"
                      value={getValue(formData, `siswa.kelas${grade}.p`)}
                      onChange={(v) =>
                        handleChange(`siswa.kelas${grade}.p`, v)
                      }
                    />
                  </div>
                </div>
              ))}

            {config.isPaud &&
              config.rombelTypes &&
              config.rombelTypes.map((type) => (
                <div
                  key={type.key}
                  className="p-4 border rounded-lg bg-gray-50/50"
                >
                  <p className="font-medium mb-3">{type.label}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                      label="Laki-laki"
                      value={getValue(formData, `siswa.${type.key}.l`)}
                      onChange={(v) =>
                        handleChange(`siswa.${type.key}.l`, v)
                      }
                    />
                    <NumberInput
                      label="Perempuan"
                      value={getValue(formData, `siswa.${type.key}.p`)}
                      onChange={(v) =>
                        handleChange(`siswa.${type.key}.p`, v)
                      }
                    />
                  </div>
                </div>
              ))}
          </div>
        );

      case "rombel":
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
      className={
        embedded
          ? "w-full"
          : "max-w-4xl mx-auto p-6 border rounded-lg bg-white shadow-sm"
      }
    >
      {!embedded && (
        <h1 className="text-2xl font-bold mb-6">Input Data {schoolType}</h1>
      )}

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

      {/* Modal Map untuk pilih titik koordinat */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-3xl p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">
                Klik pada peta untuk memilih lokasi sekolah
              </h2>
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
              Setelah memilih titik di peta, nilai latitude & longitude akan
              terisi otomatis di form.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
