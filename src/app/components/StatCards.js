// src/components/StatCards.js
"use client";
import { Users, AlertTriangle, Monitor, GraduationCap } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const stats = [
  {
    icon: Users,
    label: "Total Students",
    value: "12,847",
    caption: "All education levels",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: AlertTriangle,
    label: "Damaged Facilities",
    value: "156",
    caption: "Needs repair",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: Monitor,
    label: "Total Devices",
    value: "2,341",
    caption: "Digital equipment",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: GraduationCap,
    label: "Total Teachers",
    value: "687",
    caption: "Active educators",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="rounded-xl shadow-sm border-border/50">
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
  );
}
