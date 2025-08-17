"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { School, Save, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AddSchoolForm() {
  const [formData, setFormData] = useState({
    district: "",
    npsn: "",
    schoolName: "",
    schoolType: "",
    address: "",
    status: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.district) newErrors.district = "District is required";
    if (!formData.npsn) newErrors.npsn = "NPSN is required";
    if (!formData.schoolName) newErrors.schoolName = "School name is required";
    if (!formData.schoolType) newErrors.schoolType = "School type is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.status) newErrors.status = "Status is required";

    if (formData.npsn && !/^\d{8}$/.test(formData.npsn)) {
      newErrors.npsn = "NPSN must be exactly 8 digits";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("School added successfully!");
      setHasUnsavedChanges(false);

      setFormData({
        district: "",
        npsn: "",
        schoolName: "",
        schoolType: "",
        address: "",
        status: "",
        email: "",
        phone: "",
        notes: "",
      });
    } catch (error) {
      toast.error("Failed to add school. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to cancel?"
        )
      ) {
        setFormData({
          district: "",
          npsn: "",
          schoolName: "",
          schoolType: "",
          address: "",
          status: "",
          email: "",
          phone: "",
          notes: "",
        });
        setHasUnsavedChanges(false);
        setErrors({});
      }
    }
  };

  return (
    <Card className="rounded-xl shadow-lg border-border/50 max-w-9xl mx-auto">
      {/* <CardHeader className="border-b border-border/50">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <School className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl text-card-foreground">
              Tambahkan Sekolah Baru
            </h2>
            <p className="text-muted-foreground mt-1">
              Isi data sekolah untuk mendaftarkan sekolah baru{" "}
            </p>
          </div>
        </CardTitle>
      </CardHeader> */}

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg text-card-foreground border-l-4 border-primary pl-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="district" className="text-card-foreground">
                  District <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) =>
                    handleInputChange("district", value)
                  }
                >
                  <SelectTrigger
                    className={`rounded-xl h-12 ${
                      errors.district
                        ? "border-destructive"
                        : "border-border/50"
                    }`}
                  >
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Central">Central</SelectItem>
                    <SelectItem value="North">North</SelectItem>
                    <SelectItem value="South">South</SelectItem>
                    <SelectItem value="East">East</SelectItem>
                    <SelectItem value="West">West</SelectItem>
                  </SelectContent>
                </Select>
                {errors.district && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.district}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="npsn" className="text-card-foreground">
                  NPSN <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="npsn"
                  value={formData.npsn}
                  onChange={(e) =>
                    handleInputChange(
                      "npsn",
                      e.target.value.replace(/\D/g, "").slice(0, 8)
                    )
                  }
                  className={`rounded-xl h-12 ${
                    errors.npsn ? "border-destructive" : "border-border/50"
                  }`}
                  placeholder="Enter 8-digit NPSN"
                  maxLength={8}
                />
                {errors.npsn && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.npsn}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolName" className="text-card-foreground">
                School Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="schoolName"
                value={formData.schoolName}
                onChange={(e) =>
                  handleInputChange("schoolName", e.target.value)
                }
                className={`rounded-xl h-12 ${
                  errors.schoolName ? "border-destructive" : "border-border/50"
                }`}
                placeholder="Enter full school name"
              />
              {errors.schoolName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.schoolName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="schoolType" className="text-card-foreground">
                  School Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.schoolType}
                  onValueChange={(value) =>
                    handleInputChange("schoolType", value)
                  }
                >
                  <SelectTrigger
                    className={`rounded-xl h-12 ${
                      errors.schoolType
                        ? "border-destructive"
                        : "border-border/50"
                    }`}
                  >
                    <SelectValue placeholder="Select school type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAUD">PAUD (Early Childhood)</SelectItem>
                    <SelectItem value="TK">TK (Kindergarten)</SelectItem>
                    <SelectItem value="SD">SD (Elementary School)</SelectItem>
                    <SelectItem value="SMP">
                      SMP (Junior High School)
                    </SelectItem>
                    <SelectItem value="SMA">
                      SMA (Senior High School)
                    </SelectItem>
                    <SelectItem value="SMK">
                      SMK (Vocational High School)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.schoolType && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.schoolType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-card-foreground">
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger
                    className={`rounded-xl h-12 ${
                      errors.status ? "border-destructive" : "border-border/50"
                    }`}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Incomplete Data">
                      Incomplete Data
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.status}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-card-foreground">
                Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`rounded-xl ${
                  errors.address ? "border-destructive" : "border-border/50"
                }`}
                placeholder="Enter complete school address"
                rows={4}
              />
              {errors.address && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.address}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg text-card-foreground border-l-4 border-primary pl-4">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`rounded-xl h-12 ${
                    errors.email ? "border-destructive" : "border-border/50"
                  }`}
                  placeholder="school@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-card-foreground">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`rounded-xl h-12 ${
                    errors.phone ? "border-destructive" : "border-border/50"
                  }`}
                  placeholder="021-1234567"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-6">
            <h3 className="text-lg text-card-foreground border-l-4 border-primary pl-4">
              Additional Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-card-foreground">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="rounded-xl border-border/50"
                placeholder="Any additional information about the school (optional)"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/50">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl h-12 flex-1 sm:flex-none sm:min-w-32"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save School
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-xl h-12 flex-1 sm:flex-none sm:min-w-32"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
