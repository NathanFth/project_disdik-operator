"use client";

import React from "react";
import Sidebar from "../../../components/Sidebar";
// import TopNavbar from "../../../components/TopNavbar";
import DataInputForm from "../../../components/DataInputForm";
import ImportExcel from "../../../components/ImportExcel";

export default function SdInputPage() {
  // JS murni, tanpa generic
  const [tab, setTab] = React.useState("form"); // 'form' | 'import'

  return (
    // Sidebar dipasang sekali, konten digeser dengan md:pl-64 supaya “nyatu”
    <div className="min-h-screen bg-background md:pl-64">
      <Sidebar />

      {/* <TopNavbar /> */}
      <main className="p-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold">Input Data SD</h1>
            <p className="text-sm text-muted-foreground">
              Pilih metode input: isi formulir manual atau impor dari Excel.
            </p>
          </header>

          <div className="rounded-xl border bg-card text-card-foreground">
            <div className="border-b p-2 flex gap-2">
              <button
                onClick={() => setTab("form")}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  tab === "form"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                Form Manual
              </button>
              <button
                onClick={() => setTab("import")}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  tab === "import"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                Import Excel
              </button>
            </div>

            <div className="p-4">
              {tab === "form" ? (
                // pastikan DataInputForm tidak render Sidebar/layout lagi di dalamnya
                <DataInputForm schoolType="SD" embedded />
              ) : (
                <ImportExcel schemaKey="SD" />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
