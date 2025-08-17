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
  { district: "Central", students: 3245 },
  { district: "North", students: 2876 },
  { district: "South", students: 3156 },
  { district: "East", students: 2890 },
  { district: "West", students: 2680 },
];

const facilityConditions = [
  { name: "Good Condition", value: 68, color: "#22c55e" },
  { name: "Moderate Damage", value: 23, color: "#f59e0b" },
  { name: "Heavy Damage", value: 9, color: "#ef4444" },
];

export default function DataVisualization() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Students per District Bar Chart */}
      <Card className="rounded-xl shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Students per District
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsByDistrict}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="district"
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Bar dataKey="students" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
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
            Facility Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={facilityConditions}
                  cx="50%"
                  cy="50%"
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
                  height={36}
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