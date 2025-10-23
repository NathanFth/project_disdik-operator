"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "../../../components/Sidebar";
// import TopNavbar from "../../../components/TopNavbar";
import ImportExcel from "../../../components/ImportExcel";

export default function PaudInputPage() {
  const router = useRouter();
  const [active, setActive] = useState("import");

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          {/* <TopNavbar /> */}
          <main className="p-6 space-y-6">
            <header className="space-y-1">
              <h1 className="text-2xl font-semibold">Input Data PAUD</h1>
              <p className="text-sm text-muted-foreground">
                Pilih metode input: isi formulir manual atau impor dari Excel.
              </p>
            </header>

            <div className="rounded-xl border bg-card text-card-foreground">
              <div className="border-b p-2 flex gap-2">
                <button
                  onClick={() => router.push("/dashboard/paud/input/form")}
                  className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Form Manual
                </button>
                <button
                  onClick={() => setActive("import")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    active === "import"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  Import Excel
                </button>
              </div>

              <div className="p-4">
                <ImportExcel schemaKey="PAUD" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
