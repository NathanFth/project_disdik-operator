"use client";

import { useState } from "react";
import DataInputForm from "./DataInputForm";
import ImportExcel from "./ImportExcel";

export default function InputPageBody({ title, schoolType, schemaKey, Icon }) {
  const [tab, setTab] = useState("form");

  return (
    <main className="py-6 px-2 sm:px-3 md:px-4 space-y-4">
      <header className="mb-8">
        <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
          <Icon className="h-8 w-8 text-primary" />
          {title}
        </h1>
        <p className="text-muted-foreground">
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

        <div className="p-3 sm:p-4">
          {tab === "form" ? (
            <DataInputForm schoolType={schoolType} embedded />
          ) : (
            <ImportExcel schemaKey={schemaKey} />
          )}
        </div>
      </div>
    </main>
  );
}
