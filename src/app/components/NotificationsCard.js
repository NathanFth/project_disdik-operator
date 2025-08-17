// src/components/NotificationsCard.js
"use client";

import { Alert, AlertDescription } from "./ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertTriangle, Info, Calendar } from "lucide-react";

const notifications = [
  {
    type: "urgent",
    icon: AlertTriangle,
    title: "Data Submission Deadline",
    message: "Teacher data for Q4 must be submitted by December 31, 2024",
    color: "border-red-200 bg-red-50",
    iconColor: "text-red-600",
  },
  {
    type: "info",
    icon: Info,
    title: "System Maintenance",
    message: "Scheduled maintenance on Sunday, December 15th from 2:00 AM - 4:00 AM",
    color: "border-blue-200 bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    type: "reminder",
    icon: Calendar,
    title: "Monthly Report Due",
    message: "Generate and submit monthly facility report by end of week",
    color: "border-yellow-200 bg-yellow-50",
    iconColor: "text-yellow-600",
  },
];

export default function NotificationsCard() {
  return (
    <Card className="rounded-xl shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Important Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification, index) => {
          const Icon = notification.icon;
          return (
            <Alert key={index} className={`rounded-xl border ${notification.color}`}>
              <Icon className={`h-4 w-4 ${notification.iconColor}`} />
              <AlertDescription>
                <div className="font-medium mb-1">{notification.title}</div>
                <div className="text-sm opacity-90">{notification.message}</div>
              </AlertDescription>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
}
