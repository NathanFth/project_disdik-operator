"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Plus, Upload, Download, FileText } from "lucide-react";
import  SchoolsTable  from "./SchoolsTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
// import { useRouter } from "next/navigation";

export function SchoolQuickActions({ schoolsData = [] }) {
  const router = useRouter();
  <SchoolsTable schoolsData={schoolsData} />;
  const handleAddSchool = () => router.push("/schools/add");
  const handleImportData = () => router.push("/schools/import");

  const handleExportData = () => {
    // Buat array data untuk Excel
    const data = schoolsData.map((s) => ({
      No: s.no,
      District: s.district,
      NPSN: s.npsn,
      Name: s.name,
      Type: s.schoolType,
      Status: s.status,
      Address: s.address,
      Email: s.email,
      Phone: s.phone,
      Students: s.studentsCount,
      Teachers: s.teachersCount,
      Facilities: s.facilitiesCount,
      "Last Updated": s.lastUpdated,
    }));

    // Buat workbook dan worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schools");

    // Export sebagai file .xlsx
    XLSX.writeFile(workbook, "schools_data.xlsx");
  };
  // const handleGenerateReport = () => console.log("Generate Report");
  const handleGenerateReport = () => {
    const doc = new jsPDF();

    // Judul laporan
    doc.setFontSize(16);
    doc.text("School Report", 14, 20);

    // Ringkasan statistik
    const totalSchools = schoolsData.length;
    const totalStudents = schoolsData.reduce(
      (sum, s) => sum + s.studentsCount,
      0
    );
    const totalTeachers = schoolsData.reduce(
      (sum, s) => sum + s.teachersCount,
      0
    );
    const totalFacilities = schoolsData.reduce(
      (sum, s) => sum + s.facilitiesCount,
      0
    );

    doc.setFontSize(12);
    doc.text(`Total Schools: ${totalSchools}`, 14, 30);
    doc.text(`Total Students: ${totalStudents}`, 14, 36);
    doc.text(`Total Teachers: ${totalTeachers}`, 14, 42);
    doc.text(`Total Facilities: ${totalFacilities}`, 14, 48);

    // Tabel sekolah
    const tableColumn = [
      "No",
      "Name",
      "Type",
      "District",
      "Status",
      "Students",
      "Teachers",
    ];
    const tableRows = schoolsData.map((s) => [
      s.no,
      s.name,
      s.schoolType,
      s.district,
      s.status,
      s.studentsCount,
      s.teachersCount,
    ]);

    autoTable(doc, {
      startY: 55,
      head: [tableColumn],
      body: tableRows,
    });

    // Simpan PDF
    doc.save("school_report.pdf");
  };

  return (
    <Card className="rounded-xl shadow-sm border-border/50">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            className="h-20 rounded-xl flex-col gap-2 hover:shadow-md transition-shadow"
            variant="outline"
            onClick={handleAddSchool}
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm">Add School</span>
          </Button>

          <Button
            className="h-20 rounded-xl flex-col gap-2 hover:shadow-md transition-shadow"
            variant="outline"
            onClick={handleImportData}
          >
            <Upload className="h-6 w-6" />
            <span className="text-sm">Import Data</span>
          </Button>

          <Button
            className="h-20 rounded-xl flex-col gap-2 hover:shadow-md transition-shadow"
            variant="outline"
            onClick={handleExportData}
          >
            <Download className="h-6 w-6" />
            <span className="text-sm">Export Data</span>
          </Button>

          <Button
            className="h-20 rounded-xl flex-col gap-2 hover:shadow-md transition-shadow"
            variant="outline"
            onClick={handleGenerateReport}
          >
            <FileText className="h-6 w-6" />
            <span className="text-sm">Generate Report</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
