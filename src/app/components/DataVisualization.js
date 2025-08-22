// src/components/DataVisualization.js
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

const studentsByDistrict = [
  { kecamatan: "Pusat", siswa: 3245 },
  { kecamatan: "Utara", siswa: 2876 },
  { kecamatan: "Selatan", siswa: 3156 },
  { kecamatan: "Timur", siswa: 2890 },
  { kecamatan: "Barat", siswa: 2680 },
];

const facilityConditions = [
  { name: "Kondisi Baik", value: 68, color: "#22c55e" },
  { name: "Kerusakan Sedang", value: 23, color: "#f59e0b" },
  { name: "Kerusakan Berat", value: 9, color: "#ef4444" },
];

export default function DataVisualization() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Students per District Bar Chart */}
      <Card className="rounded-xl shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Siswa per Kecamatan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-68">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsByDistrict}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="kecamatan"
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Bar dataKey="siswa" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Facility Conditions Pie Chart */}
      <Card className="rounded-xl shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Kondisi Fasilitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-68">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={facilityConditions}
                  cx="50%"
                  cy="45%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ value }) => `${value}%`}
                >
                  {facilityConditions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={30}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
