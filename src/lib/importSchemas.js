// src/lib/importSchemas.js
//
// Registry skema import per-bidang.
// - "required": kolom Wajib ada di file Excel
// - "optional": kolom opsional, kalau ada dipakai
// - "aliases": nama lain yang sering dipakai di lapangan (akan di-normalisasi)
//
// Catatan: sesuaikan dengan format nyata di masing-masing bidang.
// Ini contoh awal yang umum; nanti gampang diubah.

export const SCHEMA_KEYS = ["PAUD", "TK", "PKBM", "SD", "SMP"];

const commonAliases = {
  sekolah: [
    "nama sekolah",
    "sekolah",
    "satuan pendidikan",
    "npsn/nama",
    "nama_satuan_pendidikan",
  ],
  npsn: ["npsn", "kode sekolah", "kode_sp"],
  kecamatan: ["kecamatan", "kec"],
  alamat: ["alamat", "alamat sekolah"],
  tahun: ["tahun", "tahun ajaran", "tahun_anggaran", "thn"],
  nilai: ["nilai", "anggaran", "pagu", "biaya", "jumlah"],
  status: ["status", "kondisi", "tahap", "progress"],
};

export const IMPORT_SCHEMAS = {
  PAUD: {
    required: ["sekolah", "npsn", "kecamatan", "tahun", "nilai", "status"],
    optional: ["alamat", "jumlah_rombel", "jumlah_siswa"],
    aliases: {
      ...commonAliases,
      jumlah_rombel: ["rombel", "jml_rombel"],
      jumlah_siswa: ["siswa", "jml_siswa", "peserta didik"],
    },
  },
  TK: {
    required: ["sekolah", "npsn", "kecamatan", "tahun", "nilai", "status"],
    optional: ["alamat", "jumlah_rombel", "jumlah_siswa"],
    aliases: {
      ...commonAliases,
      jumlah_rombel: ["rombel", "jml_rombel"],
      jumlah_siswa: ["siswa", "jml_siswa"],
    },
  },
  PKBM: {
    required: ["sekolah", "kecamatan", "tahun", "nilai", "status"],
    optional: ["alamat", "program", "peserta_didik"],
    aliases: {
      ...commonAliases,
      program: ["program", "jenis program", "paket"],
      peserta_didik: ["peserta", "siswa", "jml_peserta"],
    },
  },
  SD: {
    required: ["sekolah", "npsn", "kecamatan", "tahun", "nilai", "status"],
    optional: ["alamat", "kelas_rusak_berat", "kelas_rusak_sedang"],
    aliases: {
      ...commonAliases,
      kelas_rusak_berat: ["rusak berat", "kelas rusak berat", "krb"],
      kelas_rusak_sedang: ["rusak sedang", "kelas rusak sedang", "krs"],
    },
  },
  SMP: {
    required: ["sekolah", "npsn", "kecamatan", "tahun", "nilai", "status"],
    optional: ["alamat", "kelas_rusak_berat", "kelas_rusak_sedang"],
    aliases: {
      ...commonAliases,
      kelas_rusak_berat: ["rusak berat", "kelas rusak berat", "krb"],
      kelas_rusak_sedang: ["rusak sedang", "kelas rusak sedang", "krs"],
    },
  },
};

// Normalisasi header: huruf kecil, trim spasi, hapus tanda aneh.
export function normalizeHeader(h) {
  return String(h || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s/.-]/g, "")
    .trim();
}

// Coba cocokkan satu header mentah ke nama field standar berdasarkan "aliases"
export function matchHeaderToField(schema, rawHeader) {
  const norm = normalizeHeader(rawHeader);
  // Langsung cocokkan jika sama
  const allFields = new Set([...schema.required, ...(schema.optional || [])]);
  for (const f of allFields) {
    if (norm === f) return f;
  }
  // Coba lewat alias
  const aliases = schema.aliases || {};
  for (const [field, aliasList] of Object.entries(aliases)) {
    if (aliasList.some((a) => normalizeHeader(a) === norm)) {
      return field;
    }
  }
  return null; // tidak ketemu
}

// Dapatkan daftar kolom wajib yang belum terpenuhi dari headers excel
export function missingRequiredFields(schema, mappedFieldsSet) {
  return (schema.required || []).filter((req) => !mappedFieldsSet.has(req));
}
