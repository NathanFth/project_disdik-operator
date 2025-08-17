"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { School, MapPin, Phone, Mail, Users, GraduationCap, Building, Calendar } from "lucide-react";

export function SchoolDetailsModal({ school, isOpen, onClose }) {
  if (!school) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 border-green-200";
      case "Incomplete Data":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Under Review":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Inactive":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <School className="h-6 w-6 text-primary" />
            School Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-muted/30 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl text-card-foreground mb-2">{school.name}</h3>
                <p className="text-primary font-mono">{school.npsn}</p>
              </div>
              <Badge className={`rounded-full ${getStatusColor(school.status)}`}>
                {school.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{school.district} District</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{school.schoolType}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-card-foreground mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </h4>
            <p className="text-muted-foreground bg-card border rounded-lg p-3">
              {school.address}
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-card-foreground mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-card border rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{school.email}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-card border rounded-lg">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{school.phone}</span>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div>
            <h4 className="text-card-foreground mb-3">Data Summary</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl text-blue-600">{school.studentsCount}</p>
                <p className="text-xs text-blue-600">Students</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <GraduationCap className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl text-green-600">{school.teachersCount}</p>
                <p className="text-xs text-green-600">Teachers</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Building className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl text-purple-600">{school.facilitiesCount}</p>
                <p className="text-xs text-purple-600">Facilities</p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Last updated: {school.lastUpdated}
            </div>
            <Button onClick={onClose} className="rounded-xl">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}