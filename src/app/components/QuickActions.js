// src/components/QuickActions.js
"use client";

import { Plus, School, Users, Building, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const actions = [
  {
    icon: School,
    label: "Add School",
    description: "Register new school",
    color: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    icon: Users,
    label: "Add Teacher",
    description: "Register new teacher",
    color: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200",
  },
  {
    icon: Building,
    label: "Add Facility",
    description: "Register new facility",
    color: "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    icon: Upload,
    label: "Upload Document",
    description: "Bulk data import",
    color: "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200",
  },
];

export function QuickActions() {
  return (
    <Card className="rounded-xl shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className={`h-20 flex-col space-y-2 rounded-xl border transition-all duration-200 hover:shadow-md ${action.color}`}
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
