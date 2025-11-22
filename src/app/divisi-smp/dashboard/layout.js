// src/app/dashboard/layout.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import TopNavbar from "../../components/TopNavbar";
import { Loader2 } from "lucide-react";
import { auth } from "../../../lib/auth";

export default function DashboardLayout({ children }) {
  const [ready, setReady] = useState(true);
  const router = useRouter();

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:pl-64">
          <TopNavbar />
          <main className="p-6 space-y-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
