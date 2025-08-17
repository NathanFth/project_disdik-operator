"use client";

import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { DataPreview } from "./DataPreview";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Download, Upload, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ImportDataPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Mock data processing function
  const processFile = async (file) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return [
      {
        id: "1",
        npsn: "20101234",
        schoolName: "SDN Merdeka 01",
        schoolType: "SD",
        district: "Central",
        address: "Jl. Merdeka No. 123, Jakarta Pusat",
        status: "Active",
        email: "sdn.merdeka01@email.com",
        phone: "021-1234567",
        isValid: true,
        errors: [],
      },
      {
        id: "2",
        npsn: "20105678",
        schoolName: "SMP Kartini 15",
        schoolType: "SMP",
        district: "North",
        address: "Jl. Kartini No. 456, Jakarta Utara",
        status: "Active",
        email: "invalid-email",
        phone: "021-2345678",
        isValid: false,
        errors: ["Invalid email format"],
      },
      {
        id: "3",
        npsn: "201",
        schoolName: "",
        schoolType: "SMA",
        district: "South",
        address: "Jl. Nusantara No. 789, Jakarta Selatan",
        status: "Active",
        email: "sma.nusantara03@email.com",
        phone: "021-3456789",
        isValid: false,
        errors: ["NPSN must be 8 digits", "School name is required"],
      },
      {
        id: "4",
        npsn: "20113456",
        schoolName: "SMK Teknologi 12",
        schoolType: "SMK",
        district: "East",
        address: "Jl. Teknologi No. 321, Jakarta Timur",
        status: "Under Review",
        email: "smk.teknologi12@email.com",
        phone: "021-4567890",
        isValid: true,
        errors: [],
      },
      {
        id: "5",
        npsn: "20117890",
        schoolName: "TK Pelita Bangsa",
        schoolType: "TK",
        district: "West",
        address: "Jl. Pelita No. 654, Jakarta Barat",
        status: "Active",
        email: "tk.pelitabangsa@email.com",
        phone: "021-5678901",
        isValid: true,
        errors: [],
      },
    ];
  };

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setPreviewData([]);

    try {
      const processedData = await processFile(file);
      setPreviewData(processedData);
      toast.success(
        `File processed successfully! Found ${processedData.length} records.`
      );
    } catch (error) {
      toast.error("Failed to process file. Please try again.");
      setSelectedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    const validData = previewData.filter((row) => row.isValid);

    if (validData.length === 0) {
      toast.error("No valid records to import.");
      return;
    }

    setIsImporting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast.success(
        `Successfully imported ${validData.length} school records!`
      );

      setSelectedFile(null);
      setPreviewData([]);
    } catch (error) {
      toast.error("Failed to import data. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancel = () => {
    if (selectedFile || previewData.length > 0) {
      if (
        window.confirm(
          "Are you sure you want to cancel? All uploaded data will be lost."
        )
      ) {
        setSelectedFile(null);
        setPreviewData([]);
      }
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = `NPSN,School Name,School Type,District,Address,Status,Email,Phone
20101234,SDN Sample 01,SD,Central,"Jl. Sample No. 123, Jakarta Pusat",Active,sample@email.com,021-1234567
20105678,SMP Sample 02,SMP,North,"Jl. Sample No. 456, Jakarta Utara",Active,sample2@email.com,021-2345678`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "school_data_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Template downloaded successfully!");
  };

  const validRows = previewData.filter((row) => row.isValid);
  const hasValidData = validRows.length > 0;
  const hasInvalidData = previewData.some((row) => !row.isValid);

  return (
    <div className="space-y-8">
      {/* Download Template */}
      <Card className="rounded-xl shadow-sm border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg text-card-foreground mb-2">
                Butuh Template?{" "}
              </h3>
              <p className="text-muted-foreground">
                Unduh template contoh kami untuk memastikan data Anda memiliki
                format yang benar.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="rounded-xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <FileUpload onFileSelect={handleFileSelect} isLoading={isProcessing} />

      {/* Data Preview */}
      {(previewData.length > 0 || isProcessing) && (
        <DataPreview data={previewData} isLoading={isProcessing} />
      )}

      {/* Import Actions */}
      {previewData.length > 0 && !isProcessing && (
        <Card className="rounded-xl shadow-sm border-border/50">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Status Summary */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg text-card-foreground mb-2">
                    Ready to Import
                  </h3>
                  <p className="text-muted-foreground">
                    {hasValidData
                      ? `${validRows.length} valid record(s) ready for import.`
                      : "No valid records found. Please fix the errors first."}
                    {hasInvalidData && (
                      <span className="text-destructive ml-1">
                        {previewData.filter((row) => !row.isValid).length}{" "}
                        record(s) have errors and will be skipped.
                      </span>
                    )}
                  </p>
                </div>

                {hasInvalidData && (
                  <Alert className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Only valid records will be imported. Invalid records will
                      be skipped.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleImport}
                  disabled={!hasValidData || isImporting}
                  className="rounded-xl flex-1 sm:flex-none sm:min-w-40"
                >
                  {isImporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import {validRows.length} Record(s)
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isImporting}
                  className="rounded-xl flex-1 sm:flex-none sm:min-w-32"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
