import { useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export function FileUpload({ onFileSelect, isLoading = false }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.toLowerCase().endsWith(".csv")
    ) {
      return "Please upload only Excel (.xlsx, .xls) or CSV files";
    }

    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    return null;
  };

  const handleFileSelect = (file) => {
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      setSelectedFile(null);
      return;
    }

    setUploadError("");
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-xl shadow-sm border-border/50">
        <CardContent className="p-8">
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
              ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : selectedFile
                  ? "border-green-300 bg-green-50"
                  : "border-muted-foreground/30 hover:border-primary/50"
              }
              ${isLoading ? "opacity-50 pointer-events-none" : ""}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              {selectedFile ? (
                <>
                  <div className="p-4 bg-green-100 rounded-full">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg text-card-foreground mb-2">
                      File Selected Successfully
                    </p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>{selectedFile.name}</span>
                      <span>({formatFileSize(selectedFile.size)})</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-muted rounded-full">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg text-card-foreground mb-2">
                      {isDragOver
                        ? "Drop your file here"
                        : "Upload File Data Sekolah"}
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Tarik dan letakkan file Excel atau CSV Anda di sini, atau
                      klik untuk memilih file
                    </p>
                    <Button
                      onClick={handleChooseFile}
                      disabled={isLoading}
                      className="rounded-xl"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* File Info */}
          <div className="mt-6 p-4 bg-muted/30 rounded-xl">
            <h4 className="text-card-foreground mb-2">Persyaratan File:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • Format yang didukung: Excel (.xlsx, .xls) atau CSV (.csv)
              </li>
              <li>• Ukuran file maksimum: 10MB</li>
              <li>
                • Kolom wajib: NPSN, Nama Sekolah, Jenis Sekolah, Kecamatan,
                Alamat
              </li>
              <li>• Kolom opsional: Status, Email, Telepon</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {uploadError && (
        <Alert className="rounded-xl border-destructive/20 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive">
            {uploadError}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
