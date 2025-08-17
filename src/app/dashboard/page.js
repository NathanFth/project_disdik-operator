"use client";

import DataVisualization from "../components/DataVisualization";
import Sidebar from "../components/Sidebar";
import StatCards from "../components/StatCards";
import TopNavbar from "../components/TopNavbar";
import SchoolsTable from "../components/SchoolsTable";
import { LayoutDashboard } from "lucide-react";


export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <TopNavbar />

          <main className="p-6 space-y-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl text-foreground mb-2 flex items-center gap-3">
                    <LayoutDashboard className="h-8 w-8 text-primary" />
                    Dashboard
                  </h1>
              <p className="text-muted-foreground">
                Kelola Data Pendidikan Semua Jenjang
              </p>
            </div>

            {/* Summary Cards */}
            <StatCards />

            {/* Data Visualization Charts */}
            <DataVisualization />

            {/* Schools Data Table */}
            <SchoolsTable />
          </main>
        </div>
      </div>
    </div>
  );
}
