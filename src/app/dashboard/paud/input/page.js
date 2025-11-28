"use client";

import Sidebar from "../../../components/Sidebar";
// import TopNavbar from "../../../components/TopNavbar";
import InputPageBody from "../../../components/InputPageBody";
import { ClipboardList } from "lucide-react";

export default function PaudInputPage() {
  return (
    <>
      <div className="min-h-screen bg-background md:pl-0">
        <InputPageBody
          title="Input Data PAUD"
          schoolType="PAUD" // <- penting: tetap PAUD
          schemaKey="TKPAUD" // pakai "TKPAUD" kalau skema gabungan; ganti "PAUD" kalau perlu terpisah
          Icon={ClipboardList}
        />
      </div>
    </>
  );
}
