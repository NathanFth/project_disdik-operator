// src/app/api/smp/[npsn]/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "public", "data", "smp.json");

async function readJson() {
  const text = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(text);
}

function findSchoolByNpsn(rawData, npsn) {
  for (const [kecName, arr] of Object.entries(rawData)) {
    const index = arr.findIndex((s) => String(s.npsn) === String(npsn));
    if (index !== -1) {
      const school = arr[index];
      return { school, kecamatan: kecName, index, kecKey: kecName };
    }
  }
  return null;
}

// GET /api/smp/[npsn] -> data dasar untuk form edit
export async function GET(_req, { params }) {
  try {
    const { npsn } = params;
    if (!npsn) {
      return NextResponse.json({ error: "NPSN tidak valid" }, { status: 400 });
    }

    const rawData = await readJson();
    const result = findSchoolByNpsn(rawData, npsn);

    if (!result) {
      return NextResponse.json(
        { error: "SMP dengan NPSN tersebut tidak ditemukan" },
        { status: 404 }
      );
    }

    const { school, kecamatan } = result;

    return NextResponse.json({
      npsn: school.npsn,
      name: school.name || "",
      address: school.address || "",
      village: school.village || "",
      student_count: school.student_count ?? 0,
      type: school.type || "",
      kecamatan,
    });
  } catch (err) {
    console.error("GET /api/smp/[npsn] error:", err);
    return NextResponse.json(
      { error: "Gagal membaca data SMP" },
      { status: 500 }
    );
  }
}

// PATCH /api/smp/[npsn] -> simpan perubahan dari form edit
export async function PATCH(req, { params }) {
  try {
    const { npsn } = params;
    if (!npsn) {
      return NextResponse.json({ error: "NPSN tidak valid" }, { status: 400 });
    }

    const body = await req.json();
    const allowedFields = [
      "name",
      "address",
      "village",
      "student_count",
      "type",
    ];

    const rawData = await readJson();
    const result = findSchoolByNpsn(rawData, npsn);

    if (!result) {
      return NextResponse.json(
        { error: "SMP dengan NPSN tersebut tidak ditemukan" },
        { status: 404 }
      );
    }

    const { school, index, kecKey } = result;

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        if (field === "student_count") {
          const num = Number(body[field]);
          school[field] = Number.isNaN(num) ? 0 : num;
        } else {
          school[field] = body[field];
        }
      }
    });

    rawData[kecKey][index] = school;

    await fs.writeFile(DATA_FILE, JSON.stringify(rawData, null, 2), "utf8");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/smp/[npsn] error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan perubahan" },
      { status: 500 }
    );
  }
}
