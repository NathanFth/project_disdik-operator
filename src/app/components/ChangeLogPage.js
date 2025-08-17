"use client";

import { useState, useEffect } from "react";
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
  History,
  Search,
  Filter,
  Download,
  RefreshCw,
  User,
  Plus,
  Edit,
  Trash2,
  Settings,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import { toast } from "sonner";

// Mock data tanpa interface
const mockChangeLogData = [
  {
    id: "1",
    timestamp: "2024-01-15 14:30:25",
    user: "Admin User",
    changeType: "Add",
    affectedItem: "SDN Merdeka 01",
    description: "Added new school with NPSN 20101234",
    details:
      "Complete school information added including contact details and address",
    severity: "low",
  },
  {
    id: "2",
    timestamp: "2024-01-15 13:45:12",
    user: "Operator 1",
    changeType: "Update",
    affectedItem: "SMP Kartini 15",
    description:
      "Updated school address from 'Jl. Old Address' to 'Jl. Kartini No. 456'",
    details: "Address field updated by operator",
    severity: "low",
  },
  {
    id: "3",
    timestamp: "2024-01-15 12:20:18",
    user: "System",
    changeType: "System",
    affectedItem: "Data Import",
    description:
      "Bulk import completed: 25 schools processed, 23 successful, 2 failed",
    details: "Automated system process for bulk data import",
    severity: "medium",
  },
  {
    id: "4",
    timestamp: "2024-01-15 11:15:33",
    user: "Operator 2",
    changeType: "Delete",
    affectedItem: "PAUD Deleted School",
    description: "Removed school with NPSN 20199999 (duplicate entry)",
    details:
      "School was identified as duplicate and removed after verification",
    severity: "high",
  },
  {
    id: "5",
    timestamp: "2024-01-15 10:05:44",
    user: "Admin User",
    changeType: "Update",
    affectedItem: "SMK Teknologi 12",
    description: "Updated school status from 'Under Review' to 'Active'",
    details: "Status changed after verification process completed",
    severity: "medium",
  },
  {
    id: "6",
    timestamp: "2024-01-14 16:22:15",
    user: "Operator 1",
    changeType: "Add",
    affectedItem: "TK Pelita Bangsa",
    description: "Added new kindergarten with NPSN 20117890",
    details: "New school registration processed",
    severity: "low",
  },
  {
    id: "7",
    timestamp: "2024-01-14 15:18:27",
    user: "System",
    changeType: "System",
    affectedItem: "Database Backup",
    description: "Daily database backup completed successfully",
    details: "Automated daily backup process",
    severity: "low",
  },
  {
    id: "8",
    timestamp: "2024-01-14 14:12:09",
    user: "Operator 3",
    changeType: "Update",
    affectedItem: "SMA Nusantara 03",
    description:
      "Updated contact email from old@email.com to sma.nusantara03@email.com",
    details: "Contact information updated per school request",
    severity: "low",
  },
];

export default function ChangeLogPage() {
  const [changeLogData, setChangeLogData] = useState(mockChangeLogData);
  const [filteredData, setFilteredData] = useState(mockChangeLogData);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [changeTypeFilter, setChangeTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Unique users
  const uniqueUsers = Array.from(
    new Set(changeLogData.map((entry) => entry.user))
  );

  const applyFilters = () => {
    let filtered = changeLogData;

    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.affectedItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (userFilter !== "all") {
      filtered = filtered.filter((entry) => entry.user === userFilter);
    }

    if (changeTypeFilter !== "all") {
      filtered = filtered.filter(
        (entry) => entry.changeType === changeTypeFilter
      );
    }

    if (dateFrom) {
      filtered = filtered.filter((entry) => entry.timestamp >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(
        (entry) => entry.timestamp <= dateTo + " 23:59:59"
      );
    }

    setFilteredData(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setUserFilter("all");
    setChangeTypeFilter("all");
    setDateFrom("");
    setDateTo("");
    setFilteredData(changeLogData);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Change log refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh change log");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      "Timestamp,User,Change Type,Affected Item,Description",
      ...filteredData.map(
        (entry) =>
          `"${entry.timestamp}","${entry.user}","${entry.changeType}","${entry.affectedItem}","${entry.description}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `change_log_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Change log exported successfully!");
  };

  const getChangeTypeIcon = (type, severity) => {
    const iconClass =
      severity === "high"
        ? "text-red-600"
        : severity === "medium"
        ? "text-yellow-600"
        : "text-blue-600";

    switch (type) {
      case "Add":
        return <Plus className={`h-4 w-4 ${iconClass}`} />;
      case "Update":
        return <Edit className={`h-4 w-4 ${iconClass}`} />;
      case "Delete":
        return <Trash2 className={`h-4 w-4 ${iconClass}`} />;
      case "System":
        return <Settings className={`h-4 w-4 ${iconClass}`} />;
      default:
        return <Info className={`h-4 w-4 ${iconClass}`} />;
    }
  };

  const getChangeTypeBadge = (type, severity) => {
    let colorClass = "";

    switch (type) {
      case "Add":
        colorClass = "bg-green-100 text-green-700 border-green-200";
        break;
      case "Update":
        colorClass = "bg-blue-100 text-blue-700 border-blue-200";
        break;
      case "Delete":
        colorClass = "bg-red-100 text-red-700 border-red-200";
        break;
      case "System":
        colorClass = "bg-purple-100 text-purple-700 border-purple-200";
        break;
      default:
        colorClass = "bg-gray-100 text-gray-700 border-gray-200";
    }

    return (
      <Badge variant="outline" className={`rounded-full border ${colorClass}`}>
        {type}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.replace(" ", "T"));
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, userFilter, changeTypeFilter, dateFrom, dateTo]);

  return (
    <div className="space-y-6">
      {/* Filters Panel */}
      <Card className="rounded-xl shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl"
                placeholder="Search by school name, NPSN, user, or description..."
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userFilter">User</Label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="changeType">Change Type</Label>
              <Select
                value={changeTypeFilter}
                onValueChange={setChangeTypeFilter}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Add">Add</SelectItem>
                  <SelectItem value="Update">Update</SelectItem>
                  <SelectItem value="Delete">Delete</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="rounded-xl"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="rounded-xl"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button onClick={handleExport} className="rounded-xl">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {filteredData.length !== changeLogData.length && (
        <Alert className="rounded-xl">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Showing {filteredData.length} of {changeLogData.length} total log
            entries
          </AlertDescription>
        </Alert>
      )}

      {/* Change Log Table */}
      <Card className="rounded-xl shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Change Log Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg text-card-foreground mb-2">
                No logs found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ||
                userFilter !== "all" ||
                changeTypeFilter !== "all" ||
                dateFrom ||
                dateTo
                  ? "Try adjusting your filters to see more results."
                  : "No change log entries available at this time."}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-40">Timestamp</TableHead>
                      <TableHead className="w-32">User</TableHead>
                      <TableHead className="w-24">Type</TableHead>
                      <TableHead>Affected Item</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((entry) => {
                      const timestamp = formatTimestamp(entry.timestamp);
                      return (
                        <TableRow key={entry.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono">
                            <div className="flex flex-col">
                              <span className="text-sm">{timestamp.date}</span>
                              <span className="text-xs text-muted-foreground">
                                {timestamp.time}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{entry.user}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getChangeTypeIcon(
                                entry.changeType,
                                entry.severity
                              )}
                              {getChangeTypeBadge(
                                entry.changeType,
                                entry.severity
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{entry.affectedItem}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{entry.description}</p>
                              {entry.details && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {entry.details}
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination placeholder */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredData.length} entries
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg bg-primary text-primary-foreground"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
