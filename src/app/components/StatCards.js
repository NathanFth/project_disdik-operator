// src/components/StatCards.js
"use client";
import {
  Users,
  AlertTriangle,
  Monitor,
  GraduationCap,
  Baby,
  Blocks,
  BookOpen,
  School,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useMemo } from "react";

// Mock data untuk setiap jenjang
const mockDataByOperatorType = {
  PAUD: {
    students: 2847,
    teachers: 187,
    facilities: 124,
    damaged: 23,
  },
  TK: {
    students: 3456,
    teachers: 234,
    facilities: 167,
    damaged: 18,
  },
  SD: {
    students: 45672,
    teachers: 2341,
    facilities: 1890,
    damaged: 234,
  },
  SMP: {
    students: 23456,
    teachers: 1245,
    facilities: 987,
    damaged: 67,
  },
  PKBM: {
    students: 1234,
    teachers: 89,
    facilities: 45,
    damaged: 12,
  },
};

export default function StatCards({ operatorType }) {
  const currentData =
    mockDataByOperatorType[operatorType] || mockDataByOperatorType.SD;

  // Tentukan icon berdasarkan operator type
  const getOperatorIcon = (type) => {
    switch (type) {
      case "PAUD":
        return Baby;
      case "TK":
        return Blocks;
      case "SD":
        return BookOpen;
      case "SMP":
        return School;
      case "PKBM":
        return GraduationCap;
      default:
        return GraduationCap;
    }
  };

  const getOperatorLabel = (type) => {
    switch (type) {
      case "PAUD":
        return "PAUD";
      case "TK":
        return "TK";
      case "SD":
        return "SD";
      case "SMP":
        return "SMP";
      case "PKBM":
        return "PKBM";
      default:
        return "Sekolah";
    }
  };

  const stats = useMemo(() => {
    const operatorLabel = getOperatorLabel(operatorType);

    return [
      {
        icon: Users,
        label: "Jumlah Siswa",
        value: currentData.students.toLocaleString("id-ID"),
        caption: `Siswa ${operatorLabel}`,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        icon: GraduationCap,
        label: "Jumlah Guru",
        value: currentData.teachers.toLocaleString("id-ID"),
        caption: `Guru ${operatorLabel}`,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        icon: Monitor,
        label: "Jumlah Fasilitas",
        value: currentData.facilities.toLocaleString("id-ID"),
        caption: `Fasilitas ${operatorLabel}`,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        icon: AlertTriangle,
        label: "Fasilitas Rusak",
        value: currentData.damaged.toLocaleString("id-ID"),
        caption: `Perlu perbaikan di ${operatorLabel}`,
        color: "text-red-600",
        bgColor: "bg-red-50",
      },
    ];
  }, [operatorType, currentData]);

  return (
    <>
      {/* Operator Type Indicator Card */}
      <div className="mb-6">
        <Card className="rounded-xl shadow-sm border-border/50 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100">
                {(() => {
                  const OperatorIcon = getOperatorIcon(operatorType);
                  return <OperatorIcon className="h-8 w-8 text-blue-600" />;
                })()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Dashboard Operator {getOperatorLabel(operatorType)}
                </h3>
                <p className="text-sm text-gray-600">
                  Statistik khusus untuk jenjang{" "}
                  {getOperatorLabel(operatorType)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="rounded-xl shadow-sm border-border/50 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-semibold text-card-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.caption}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
