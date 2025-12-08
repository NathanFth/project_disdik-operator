"use client";

import Sidebar from "../../../components/Sidebar";
// import TopNavbar from "../../../components/TopNavbar";
import InputPageBody from "../../../components/InputPageBody";
import { ClipboardList } from "lucide-react";

export default function TkInputPage() {
  return (
    <>
      {/* Sidebar fixed (punya kamu) */}
      <Sidebar />

      {/* Konten: rapat ke kiri pakai md:pl-0 (sesuai perbaikanmu) */}
      <div className="min-h-screen bg-background md:pl-0">
        {/* <TopNavbar /> */}
        <InputPageBody
          title="Input Data TK"
          schoolType="TK" // <- penting: tetap TK
          schemaKey="TKPAUD" // pakai "TKPAUD" kalau skema gabungan; ganti "TK" kalau perlu terpisah
          Icon={ClipboardList}
        />
      </div>
    </>
  );
}
