"use client";

import TopNavbar from "../components/TopNavbar";
import Sidebar from "../components/Sidebar";
import SchoolsTable from "../components/SchoolsTable";
import { SchoolQuickActions } from "../components/SchoolQuickActions";
import { School } from "lucide-react";

// import { Button } from "../components/ui/button";
// import { Plus, Upload } from "lucide-react";

export default function SchoolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 md:ml-64">
          <TopNavbar />

          <main className="p-6 space-y-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
                    <School className="h-8 w-8 text-primary" />
                    Sekolah
                  </h1>
                <p className="text-muted-foreground">
                  Mengelola dan memantau data sekolah di seluruh kecamatan.
                </p>
              </div>

              {/* <div className="flex gap-3">
                <Button
                  className="rounded-xl"
                  variant="outline"
                  onClick={() => console.log("Import Data")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
                <Button
                  className="rounded-xl"
                  onClick={() => console.log("Add New School")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New School
                </Button>
              </div> */}
            </div>

            {/* Quick Actions */}
            <SchoolQuickActions />

            {/* Schools Data Table */}
            <SchoolsTable />
          </main>
        </div>
      </div>
    </div>
  );
}
