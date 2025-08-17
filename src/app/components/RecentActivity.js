// src/components/RecentActivity.js
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
import { Clock, ExternalLink } from "lucide-react";

const recentActivities = [
  {
    schoolName: "SDN Merdeka 01",
    dataType: "Teacher Profile",
    dateModified: "2 hours ago",
    status: "Updated",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    schoolName: "SMP Kartini 15",
    dataType: "Facility Data",
    dateModified: "4 hours ago",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-700",
  },
  {
    schoolName: "SMA Nusantara 03",
    dataType: "School Info",
    dateModified: "1 day ago",
    status: "Updated",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    schoolName: "SMK Teknologi 12",
    dataType: "Teacher Data",
    dateModified: "1 day ago",
    status: "Incomplete",
    statusColor: "bg-red-100 text-red-700",
  },
  {
    schoolName: "SDN Pancasila 05",
    dataType: "Facility Report",
    dateModified: "2 days ago",
    status: "Updated",
    statusColor: "bg-green-100 text-green-700",
  },
];

export function RecentActivity() {
  return (
    <Card className="rounded-xl shadow-sm border-border/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 rounded-lg"
          >
            View All
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Name</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Date Modified</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.map((activity, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {activity.schoolName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {activity.dataType}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {activity.dateModified}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`rounded-full ${activity.statusColor}`}
                  >
                    {activity.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
