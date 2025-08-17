"use client";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { School, Search, Edit, Eye } from "lucide-react";
import { useState } from "react";
import { SchoolDetailsModal } from "./SchoolDetailsModal";
import { EditSchoolModal } from "./EditSchoolModal";
// import { SchoolQuickActions } from "./SchoolQuickActions";

const initialSchoolsData = [
  {
    id: "1",
    no: 1,
    district: "Central",
    npsn: "20101234",
    name: "SDN Merdeka 01",
    schoolType: "SD",
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
    address: "Jl. Merdeka No. 123, Bandung Tengah",
    email: "sdn.merdeka01@education.go.id",
    phone: "022-1234567",
    studentsCount: 485,
    teachersCount: 24,
    facilitiesCount: 15,
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    no: 2,
    district: "North",
    npsn: "20105678",
    name: "SMP Kartini 15",
    schoolType: "SMP",
    status: "Incomplete Data",
    statusColor: "bg-yellow-100 text-yellow-700",
    address: "Jl. Kartini No. 45, Bandung Utara",
    email: "smp.kartini15@education.go.id",
    phone: "022-2345678",
    studentsCount: 654,
    teachersCount: 32,
    facilitiesCount: 18,
    lastUpdated: "2024-01-12",
  },
  {
    id: "3",
    no: 3,
    district: "South",
    npsn: "20109012",
    name: "SMA Nusantara 03",
    schoolType: "SMA",
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
    address: "Jl. Nusantara No. 67, Bandung Selatan",
    email: "sma.nusantara03@education.go.id",
    phone: "022-3456789",
    studentsCount: 842,
    teachersCount: 45,
    facilitiesCount: 25,
    lastUpdated: "2024-01-14",
  },
  {
    id: "4",
    no: 4,
    district: "East",
    npsn: "20113456",
    name: "SMK Teknologi 12",
    schoolType: "SMK",
    status: "Under Review",
    statusColor: "bg-blue-100 text-blue-700",
    address: "Jl. Teknologi No. 89, Bandung Timur",
    email: "smk.teknologi12@education.go.id",
    phone: "022-4567890",
    studentsCount: 756,
    teachersCount: 38,
    facilitiesCount: 22,
    lastUpdated: "2024-01-10",
  },
  {
    id: "5",
    no: 5,
    district: "West",
    npsn: "20117890",
    name: "TK Pelita Bangsa",
    schoolType: "TK",
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
    address: "Jl. Pelita No. 12, Bandung Barat",
    email: "tk.pelitabangsa@education.go.id",
    phone: "022-5678901",
    studentsCount: 156,
    teachersCount: 12,
    facilitiesCount: 8,
    lastUpdated: "2024-01-13",
  },
  {
    id: "6",
    no: 6,
    district: "Central",
    npsn: "20121234",
    name: "PAUD Harapan Bunda",
    schoolType: "PAUD",
    status: "Inactive",
    statusColor: "bg-red-100 text-red-700",
    address: "Jl. Harapan No. 34, Bandung Tengah",
    email: "paud.harapanbunda@education.go.id",
    phone: "022-6789012",
    studentsCount: 95,
    teachersCount: 8,
    facilitiesCount: 6,
    lastUpdated: "2024-01-08",
  },
];

export default function SchoolsTable() {
  const [schoolsData, setSchoolsData] = useState(initialSchoolsData);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewDetails = (school) => {
    setSelectedSchool(school);
    setIsDetailsModalOpen(true);
  };

  const handleEditSchool = (school) => {
    setSelectedSchool(school);
    setIsEditModalOpen(true);
  };

  const handleSaveSchool = (updatedSchool) => {
    setSchoolsData((prevData) =>
      prevData.map((school) =>
        school.id === updatedSchool.id ? updatedSchool : school
      )
    );
  };

  const filteredSchools = schoolsData.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.npsn.includes(searchTerm) ||
      school.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card className="rounded-xl shadow-sm border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5 text-primary" />
              Schools Data
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schools..."
                className="pl-10 rounded-xl border-border/50 bg-input-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-16">No.</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>NPSN</TableHead>
                  <TableHead>School Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => (
                  <TableRow key={school.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{school.no}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {school.district}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {school.npsn}
                    </TableCell>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {school.schoolType}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-full ${school.statusColor}`}
                      >
                        {school.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => handleViewDetails(school)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => handleEditSchool(school)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredSchools.length} of {schoolsData.length} schools
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg">
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg bg-primary text-primary-foreground"
              >
                1
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg">
                2
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg">
                3
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <SchoolDetailsModal
        school={selectedSchool}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedSchool(null);
        }}
      />

      <EditSchoolModal
        school={selectedSchool}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSchool(null);
        }}
        onSave={handleSaveSchool}
      />
    </>
  );
}
