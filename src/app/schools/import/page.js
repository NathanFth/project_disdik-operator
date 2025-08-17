"use client";

import TopNavbar from "../../components/TopNavbar";
import Sidebar from "../../components/Sidebar";
import ImportDataPage from "../../components/ImportDataPage";
import { Upload } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 md:ml-64">
          <TopNavbar />

          <main className="p-6 space-y-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
                    <Upload className="h-8 w-8 text-primary" />
                    Import Data Sekolah
                  </h1>
                  <p className="text-muted-foreground">
                    Unggah file data sekolah dalam format Excel (.xlsx) atau CSV
                    untuk import massal
                  </p>
                </div>
              </div>
            </div>

            {/* Import Data Content */}
            <ImportDataPage />
          </main>
        </div>
      </div>
    </div>
  );
}
