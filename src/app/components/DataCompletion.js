"use client";

import { Progress } from "./ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart3 } from "lucide-react";

const completionData = [
  {
    category: "School Data",
    percentage: 85,
    status: "Good",
    color: "bg-blue-500",
  },
  {
    category: "Teacher Data",
    percentage: 72,
    status: "Needs Attention",
    color: "bg-yellow-500",
  },
  {
    category: "Facilities Data",
    percentage: 94,
    status: "Excellent",
    color: "bg-green-500",
  },
];

export default function DataCompletion() {
  return (
    <Card className="rounded-xl shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Data Completion Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {completionData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-card-foreground">
                {item.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{item.percentage}%</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.percentage >= 90
                      ? "bg-green-100 text-green-700"
                      : item.percentage >= 75
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
            <Progress value={item.percentage} className="h-3 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
