import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";

export function DataPreview({ data, isLoading = false }) {
  const validRows = data.filter((row) => row.isValid);
  const invalidRows = data.filter((row) => !row.isValid);

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-700 border-gray-200";

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

  if (isLoading) {
    return (
      <Card className="rounded-xl shadow-sm border-border/50">
        <CardContent className="p-8">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Processing file...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl text-card-foreground">{data.length}</p>
                <p className="text-sm text-muted-foreground">Total Records</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl text-card-foreground">
                  {validRows.length}
                </p>
                <p className="text-sm text-muted-foreground">Valid Records</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl text-card-foreground">
                  {invalidRows.length}
                </p>
                <p className="text-sm text-muted-foreground">Invalid Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Summary */}
      {invalidRows.length > 0 && (
        <Alert className="rounded-xl border-destructive/20 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>
              {invalidRows.length} record(s) have validation errors.
            </strong>{" "}
            Please review and fix the issues before importing.
          </AlertDescription>
        </Alert>
      )}

      {/* Data Table */}
      <Card className="rounded-xl shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Data Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-16">Status</TableHead>
                  <TableHead>NPSN</TableHead>
                  <TableHead>School Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>School Status</TableHead>
                  <TableHead>Issues</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slice(0, 20).map((row) => (
                  <TableRow
                    key={row.id}
                    className={`hover:bg-muted/50 ${
                      !row.isValid ? "bg-red-50" : ""
                    }`}
                  >
                    <TableCell>
                      {row.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                    </TableCell>
                    <TableCell className="font-mono">{row.npsn}</TableCell>
                    <TableCell>{row.schoolName}</TableCell>
                    <TableCell>{row.schoolType}</TableCell>
                    <TableCell>{row.district}</TableCell>
                    <TableCell className="max-w-48 truncate">
                      {row.address}
                    </TableCell>
                    <TableCell>
                      {row.status ? (
                        <Badge
                          variant="outline"
                          className={`rounded-full ${getStatusColor(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.errors.length > 0 ? (
                        <div className="space-y-1">
                          {row.errors.map((error, index) => (
                            <div
                              key={index}
                              className="text-xs text-red-600 flex items-center gap-1"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {error}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-green-600 text-xs">Valid</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data.length > 20 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Showing first 20 records. Total: {data.length} records.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
