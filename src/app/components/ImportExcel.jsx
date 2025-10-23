"use client";

import { useState, useMemo } from "react";
import { utils, read } from "xlsx";
import {
  IMPORT_SCHEMAS,
  SCHEMA_KEYS,
  matchHeaderToField,
  normalizeHeader,
  missingRequiredFields,
} from "../../lib/importSchemas";

export default function ImportExcel({ schemaKey = "SD" }) {
  const schema = IMPORT_SCHEMAS[schemaKey] || IMPORT_SCHEMAS["SD"];

  const [fileName, setFileName] = useState("");
  const [headersRaw, setHeadersRaw] = useState([]);
  const [headerMap, setHeaderMap] = useState({}); // rawHeader -> fieldName
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hasData = rows.length > 0;

  // Info skema + validasi
  const mappedFieldsSet = useMemo(
    () => new Set(Object.values(headerMap).filter(Boolean)),
    [headerMap]
  );
  const missing = useMemo(
    () => missingRequiredFields(schema, mappedFieldsSet),
    [schema, mappedFieldsSet]
  );

  const handleFile = async (file) => {
    setError("");
    setRows([]);
    setHeadersRaw([]);
    setHeaderMap({});
    if (!file) return;

    const allowed =
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".csv");
    if (!allowed) {
      setError("Format tidak didukung. Gunakan .xlsx, .xls, atau .csv");
      return;
    }

    setLoading(true);
    setFileName(file.name);

    try {
      const buf = await file.arrayBuffer();
      const wb = read(buf, { type: "array" });
      const sheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];

      // Ambil header mentah (baris pertama) & JSON rows
      const headRow =
        utils.sheet_to_json(sheet, { header: 1, range: 0 })?.[0] || [];
      const json = utils.sheet_to_json(sheet, { defval: "" });

      // Batasi preview 50
      const limited = json.slice(0, 50);

      // Otomatis mapping header → field skema (berdasarkan aliases)
      const map = {};
      headRow.forEach((raw) => {
        const field = matchHeaderToField(schema, raw);
        if (field) map[raw] = field;
      });

      setHeadersRaw(headRow);
      setHeaderMap(map);
      setRows(limited);
    } catch (e) {
      console.error(e);
      setError("Gagal membaca file. Pastikan formatnya benar.");
    } finally {
      setLoading(false);
    }
  };

  const onChangeInput = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  // Untuk tampilan preview, kita tampilkan kolom berdasarkan header mentah (apa adanya dari file)
  // Namun, kita beri tanda mana yang berhasil terdeteksi sebagai field skema.
  const displayHeaders = headersRaw;

  return (
    <div className="space-y-4">
      {/* Info Skema Aktif */}
      <div className="rounded-xl border bg-card text-card-foreground p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">
              Import Excel — Skema:{" "}
              <span className="text-primary">{schemaKey}</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Kolom wajib: <strong>{schema.required.join(", ")}</strong>
            </p>
          </div>
          {/* (opsional) dropdown ganti skema di sini nanti; untuk sekarang tetap via prop */}
        </div>
      </div>

      {/* Upload Field */}
      <div className="rounded-xl border bg-card text-card-foreground p-4">
        <p className="text-sm text-muted-foreground mb-3">
          Unggah file Excel/CSV untuk melihat pratinjau (maks. 50 baris pertama)
          dan periksa kecocokan header dengan skema {schemaKey}.
        </p>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center rounded-lg border px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={onChangeInput}
              className="hidden"
            />
            <span>Pilih File</span>
          </label>

          {fileName ? (
            <span className="text-sm text-muted-foreground">
              Dipilih: {fileName}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Belum ada file
            </span>
          )}
        </div>

        {loading && (
          <div className="mt-3 text-sm text-muted-foreground">
            Memproses file…
          </div>
        )}

        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
      </div>

      {/* Validasi header */}
      {headersRaw.length > 0 && (
        <div className="rounded-xl border bg-card text-card-foreground p-4">
          <h3 className="font-semibold mb-2">Pencocokan Header</h3>
          <div className="grid gap-2">
            {displayHeaders.map((raw) => {
              const matched = headerMap[raw];
              const norm = normalizeHeader(raw);
              return (
                <div
                  key={raw}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                    matched
                      ? "border-green-300 bg-green-50/60"
                      : "border-amber-300 bg-amber-50/60"
                  }`}
                >
                  <div className="text-sm">
                    <div>
                      <span className="font-medium">Header file:</span>{" "}
                      {raw || <em>(kosong)</em>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      normalized: {norm || "-"}
                    </div>
                  </div>
                  <div className="text-sm">
                    {matched ? (
                      <>
                        → field:{" "}
                        <span className="font-medium text-green-700">
                          {matched}
                        </span>
                      </>
                    ) : (
                      <span className="text-amber-700">belum dikenali</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info kolom wajib yang belum terpenuhi */}
          {missing.length > 0 ? (
            <div className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Kolom wajib belum lengkap: <strong>{missing.join(", ")}</strong>.
              Kamu tetap bisa preview, tapi untuk commit nanti kolom wajib harus
              dipenuhi (langsung dari file atau nanti lewat mapping manual).
            </div>
          ) : (
            <div className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              Semua kolom wajib terdeteksi. Siap ke tahap berikutnya (mapping &
              commit).
            </div>
          )}
        </div>
      )}

      {/* Preview Table */}
      {hasData && (
        <div className="rounded-xl border bg-card text-card-foreground">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  Pratinjau (maks. 50 baris)
                </div>
                <div className="text-sm">
                  {rows.length} baris, {displayHeaders.length} kolom
                </div>
              </div>
              <div className="text-xs text-muted-foreground max-w-[60%] truncate">
                File: {fileName}
              </div>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-[720px] w-full text-sm">
              <thead className="bg-muted">
                <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
                  {displayHeaders.map((h) => (
                    <th key={h} className="font-medium">
                      {h}
                      {headerMap[h] ? (
                        <span className="ml-1 text-[10px] text-green-700">
                          ({headerMap[h]})
                        </span>
                      ) : (
                        <span className="ml-1 text-[10px] text-amber-700">
                          (unknown)
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="[&>td]:px-3 [&>td]:py-2 border-t">
                    {displayHeaders.map((h) => (
                      <td key={h + i}>{String(r[h] ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tombol aksi berikutnya (disable dulu; next step kita isi mapping & commit) */}
          <div className="p-4 border-t flex items-center gap-2">
            <button
              disabled
              className="rounded-lg border px-3 py-2 text-muted-foreground"
              title="Langkah berikutnya: Mapping kolom manual"
            >
              Mapping Kolom (segera)
            </button>
            <button
              disabled={missing.length > 0}
              className={`rounded-lg border px-3 py-2 ${
                missing.length > 0 ? "text-muted-foreground" : "text-foreground"
              }`}
              title={
                missing.length > 0
                  ? "Lengkapi kolom wajib dulu"
                  : "Langkah berikutnya: Commit ke data"
              }
            >
              Commit Data (segera)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
